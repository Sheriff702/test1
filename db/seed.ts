import "server-only";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { products as productsTable } from "./schema";
import { ensureMigrated } from "./migrate";
import { products as seedProducts } from "@/lib/products";

export async function seedIfEmpty() {
  await ensureMigrated();
  const count = await db
    .select({ c: sql<number>`count(*)` })
    .from(productsTable)
    .all();
  if ((count[0]?.c ?? 0) > 0) return;

  // Insert one row at a time. D1's HTTP API limits a single statement to ~100
  // bound params; 12 × 17 = 204 params would exceed that as a multi-row
  // VALUES clause. One-row inserts are also easier to diagnose if any row
  // hits a validation error.
  for (let i = 0; i < seedProducts.length; i++) {
    const p = seedProducts[i];
    await db
      .insert(productsTable)
      .values({
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        price: p.price,
        currency: p.currency,
        category: p.category,
        drop: p.drop,
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
        images: p.images,
        featured: i < 4,
        archived: false,
        sortOrder: i,
      })
      .run();
  }
}
