import "server-only";
import { eq, asc } from "drizzle-orm";
import { db, ensureReady } from "@/db";
import { products as productsTable } from "@/db/schema";
import type { Product as DbProduct } from "@/db/schema";
import type { Product } from "./products";

function toProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    price: row.price,
    currency: row.currency,
    category: row.category as Product["category"],
    drop: row.drop,
    description: row.description,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    images: row.images ?? [],
  };
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureReady();
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.archived, false))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.id))
    .all();
  return rows.map(toProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  await ensureReady();
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.archived, false))
    .orderBy(asc(productsTable.sortOrder), asc(productsTable.id))
    .all();
  const featured = rows.filter((r) => r.featured);
  const pool = featured.length > 0 ? featured : rows;
  return pool.slice(0, limit).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureReady();
  const row = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug))
    .get();
  return row ? toProduct(row) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  await ensureReady();
  const rows = await db
    .select({ slug: productsTable.slug })
    .from(productsTable)
    .where(eq(productsTable.archived, false))
    .all();
  return rows.map((r) => r.slug);
}
