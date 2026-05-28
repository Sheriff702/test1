import "server-only";
import path from "path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

let migrated = false;

export async function ensureMigrated() {
  if (migrated) return;
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "db", "migrations"),
  });
  migrated = true;
}
