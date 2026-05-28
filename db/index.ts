import "server-only";
import path from "path";
import fs from "fs";
import { createClient, type Client, type Config } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Where the database lives:
 *
 * 1. Turso (preferred for production) — set TURSO_DATABASE_URL and
 *    TURSO_AUTH_TOKEN in Vercel env. Reads/writes go to a persistent libsql
 *    instance and survive cold starts.
 * 2. Local file — used during dev and on long-lived hosts. DB_PATH overrides
 *    the default ./data/mares.db.
 * 3. Vercel without Turso configured — falls back to /tmp/mares.db. The file
 *    persists for the lifetime of the container but is wiped on each cold
 *    start. Fine for demos, not for real data.
 */
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

function resolveLocalPath(): string {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  if (isServerless) return "/tmp/mares.db";
  return path.join(process.cwd(), "data", "mares.db");
}

type Db = LibSQLDatabase<typeof schema>;

declare global {
  var __mares_client: Client | undefined;
  var __mares_db: Db | undefined;
  var __mares_db_ready: boolean | undefined;
}

function build(): { client: Client; db: Db } {
  let config: Config;
  if (TURSO_URL) {
    config = TURSO_TOKEN
      ? { url: TURSO_URL, authToken: TURSO_TOKEN }
      : { url: TURSO_URL };
  } else {
    const dbPath = resolveLocalPath();
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    } catch (err) {
      // /tmp/ already exists on serverless; only re-throw on other failures.
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EEXIST" && code !== "EROFS") throw err;
    }
    config = { url: `file:${dbPath}` };
  }
  const client = createClient(config);
  const db = drizzle(client, { schema });
  return { client, db };
}

const cached = (() => {
  if (global.__mares_db && global.__mares_client) {
    return { client: global.__mares_client, db: global.__mares_db };
  }
  const created = build();
  if (process.env.NODE_ENV !== "production") {
    global.__mares_client = created.client;
    global.__mares_db = created.db;
  }
  return created;
})();

export const client = cached.client;
export const db = cached.db;

export async function ensureReady() {
  if (global.__mares_db_ready) return;
  const { ensureMigrated } = await import("./migrate");
  const { seedIfEmpty } = await import("./seed");
  await ensureMigrated();
  await seedIfEmpty();
  global.__mares_db_ready = true;
}

export { schema };
