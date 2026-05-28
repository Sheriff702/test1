import "server-only";
import path from "path";
import fs from "fs";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, usingD1 } from "./index";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let migrated = false;

/**
 * Apply Drizzle migrations against the local libsql database. D1 has its
 * schema applied out-of-band via drizzle-kit + the REST API, so this is a
 * no-op when running against D1.
 *
 * If a local data/mares.db already has the tables from a prior schema (so
 * the Drizzle journal is out of date) we replay each migration statement
 * ignoring "already exists" / "duplicate column" — pull users with a stale
 * db get auto-upgraded.
 */
export async function ensureMigrated() {
  if (migrated) return;
  if (usingD1) {
    migrated = true;
    return;
  }
  const localDb = db as unknown as LibSQLDatabase<typeof schema>;
  try {
    await migrate(localDb, {
      migrationsFolder: path.join(process.cwd(), "db", "migrations"),
    });
  } catch (err) {
    const msg = (err as Error).message ?? "";
    if (!/already exists/i.test(msg)) throw err;
    await replayMigrationsIdempotently(localDb);
  }
  migrated = true;
}

async function replayMigrationsIdempotently(localDb: LibSQLDatabase<typeof schema>) {
  const dir = path.join(process.cwd(), "db", "migrations");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sqlText = fs.readFileSync(path.join(dir, file), "utf8");
    const statements = sqlText
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      try {
        await localDb.run(sql.raw(stmt));
      } catch (err) {
        const msg = (err as Error).message ?? "";
        if (/already exists|duplicate column/i.test(msg)) continue;
        throw err;
      }
    }
  }
}
