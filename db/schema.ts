import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  price: integer("price").notNull().default(0),
  currency: text("currency").notNull().default("€"),
  category: text("category").notNull().default("tops"),
  drop: text("drop").notNull().default(""),
  description: text("description").notNull().default(""),
  sizes: text("sizes", { mode: "json" }).$type<string[]>().notNull().default([]),
  colors: text("colors", { mode: "json" }).$type<string[]>().notNull().default([]),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  archived: integer("archived", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});

/**
 * Per-language overrides for translation keys defined in lib/preferences.tsx.
 * Anything not in this table falls back to the in-code TRANSLATIONS default.
 */
export const siteContent = sqliteTable("site_content", {
  // Composite key encoded as "lang::key" so we keep a single-column PK and
  // simple insert-on-conflict semantics.
  id: text("id").primaryKey(),
  lang: text("lang").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull().default(""),
  updatedAt: integer("updated_at").notNull().$defaultFn(() => Date.now()),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;
