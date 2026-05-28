import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, ensureReady } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-guard";
import {
  SortableProductList,
  type AdminProductRow,
} from "@/components/admin/SortableProductList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  await ensureReady();
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.id))
    .all();

  const items: AdminProductRow[] = rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    drop: p.drop,
    currency: p.currency,
    price: p.price,
    featured: p.featured,
    archived: p.archived,
    imageUrl: p.images?.[0] ?? null,
  }));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
            / Products
          </p>
          <h1 className="font-display text-5xl tracking-tight">Catalog</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-mares text-ink font-display tracking-tight text-base px-5 py-3 rounded-md"
        >
          + New product
        </Link>
      </header>

      <SortableProductList initial={items} />
    </div>
  );
}
