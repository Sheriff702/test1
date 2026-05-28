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

  const rows = seedProducts.map((p, i) => ({
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
  }));

  await db.insert(productsTable).values(rows).run();
}
