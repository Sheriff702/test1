import "server-only";
import { db, ensureReady } from "@/db";
import { siteContent } from "@/db/schema";
import { LANGUAGES, type LanguageCode } from "./preferences";

export type ContentOverrides = Partial<Record<LanguageCode, Record<string, string>>>;

/** Fetch all per-language overrides at once so the layout can pass them to PreferencesProvider. */
export async function getAllOverrides(): Promise<ContentOverrides> {
  await ensureReady();
  const rows = await db.select().from(siteContent).all();
  const out: ContentOverrides = {};
  for (const r of rows) {
    const lang = r.lang as LanguageCode;
    if (!LANGUAGES.some((l) => l.code === lang)) continue;
    if (!out[lang]) out[lang] = {};
    (out[lang] as Record<string, string>)[r.key] = r.value;
  }
  return out;
}
