import "server-only";
import path from "path";
import fs from "fs";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "mares.db");

type Db = LibSQLDatabase<typeof schema>;

declare global {
  var __mares_client: Client | undefined;
  var __mares_db: Db | undefined;
  var __mares_db_ready: boolean | undefined;
}

function build(): { client: Client; db: Db } {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const client = createClient({ url: `file:${DB_PATH}` });
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
