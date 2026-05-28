import "server-only";
import path from "path";
import fs from "fs";
import { createClient, type Client } from "@libsql/client";
import { drizzle as drizzleLibsql, type LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle as drizzleProxy, type SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";
import { makeD1Driver, makeD1BatchDriver } from "./d1-http";

/**
 * Backend selection:
 *
 * 1. Cloudflare D1 (preferred for production on Vercel) — set
 *    CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID and CLOUDFLARE_D1_API_TOKEN. The
 *    HTTP driver talks to D1 over Cloudflare's REST API.
 * 2. Local libsql file — used for `npm run dev` and for any long-lived host
 *    that doesn't set the D1 env vars. DB_PATH overrides the default.
 */

const D1_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const D1_DB_ID = process.env.D1_DATABASE_ID;
const D1_TOKEN = process.env.CLOUDFLARE_D1_API_TOKEN;
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
);

export const usingD1 = Boolean(D1_ACCOUNT && D1_DB_ID && D1_TOKEN);

type LocalDb = LibSQLDatabase<typeof schema>;
type RemoteDb = SqliteRemoteDatabase<typeof schema>;
/**
 * Public type: pick one concrete API to expose so call sites get useful types.
 * At runtime the implementation may be either; their query builder surfaces
 * are interchangeable for everything we use.
 */
type Db = LocalDb;

declare global {
  var __mares_local_client: Client | undefined;
  var __mares_db: Db | undefined;
  var __mares_db_ready: boolean | undefined;
}

function resolveLocalPath(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  if (isServerless) return "/tmp/mares.db";
  return path.join(process.cwd(), "data", "mares.db");
}

function buildLocal(): { client: Client; db: LocalDb } {
  const dbPath = resolveLocalPath();
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== "EEXIST" && code !== "EROFS") throw err;
  }
  const client = createClient({ url: `file:${dbPath}` });
  return { client, db: drizzleLibsql(client, { schema }) };
}

function buildD1(): RemoteDb {
  const cfg = {
    accountId: D1_ACCOUNT!,
    databaseId: D1_DB_ID!,
    apiToken: D1_TOKEN!,
  };
  return drizzleProxy(makeD1Driver(cfg), makeD1BatchDriver(cfg), { schema });
}

const cached = (() => {
  if (global.__mares_db) return { db: global.__mares_db };
  const built: LocalDb | RemoteDb = usingD1 ? buildD1() : buildLocal().db;
  // Cast to the public Db type — see comment above.
  const db = built as unknown as Db;
  if (process.env.NODE_ENV !== "production") {
    global.__mares_db = db;
  }
  return { db };
})();

export const db = cached.db;

export async function ensureReady() {
  if (global.__mares_db_ready) return;
  if (usingD1) {
    // D1 schema is owned out-of-band (drizzle-kit + REST API), so we only
    // run the seed if the table is empty.
    const { seedIfEmpty } = await import("./seed");
    await seedIfEmpty();
  } else {
    const { ensureMigrated } = await import("./migrate");
    const { seedIfEmpty } = await import("./seed");
    await ensureMigrated();
    await seedIfEmpty();
  }
  global.__mares_db_ready = true;
}

export { schema };
