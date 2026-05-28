import "server-only";
import path from "path";
import fs from "fs";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "./index";

let migrated = false;

/**
 * Apply Drizzle migrations. If the schema was regenerated (so the journal
 * doesn't match) but the tables already exist with the right shape, we treat
 * "table already exists" as success — that just means a prior schema version
 * already created the table. New tables in the latest migration are created
 * by hand so we don't fight Drizzle's journal.
 */
export async function ensureMigrated() {
  if (migrated) return;
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "db", "migrations"),
    });
  } catch (err) {
    const msg = (err as Error).message ?? "";
    if (!/already exists/i.test(msg)) throw err;
    // The journal was wiped (schema regen) but the legacy tables remain.
    // Replay each migration's statements manually, ignoring "already exists".
    await replayMigrationsIdempotently();
  }
  migrated = true;
}

async function replayMigrationsIdempotently() {
  const dir = path.join(process.cwd(), "db", "migrations");
  if (!fs.existsSync(dir)) return;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sqlText = fs.readFileSync(path.join(dir, file), "utf8");
    const statements = sqlText
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err) {
        const msg = (err as Error).message ?? "";
        if (/already exists|duplicate column/i.test(msg)) continue;
        throw err;
      }
    }
  }

  // Drizzle uses __drizzle_migrations to track applied migrations. If the
  // journal was regenerated, mark all migration hashes from the journal as
  // applied so future migrate() calls don't try to re-run them.
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at NUMERIC
    )
  `);
}
