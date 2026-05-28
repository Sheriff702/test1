import Link from "next/link";
import { sql } from "drizzle-orm";
import { db, ensureReady } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  await ensureReady();

  const [productRows, featuredRows, archivedRows] = await Promise.all([
    db
      .select({ c: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.archived} = 0`)
      .all(),
    db
      .select({ c: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.featured} = 1 and ${products.archived} = 0`)
      .all(),
    db
      .select({ c: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.archived} = 1`)
      .all(),
  ]);
  const productCount = productRows[0]?.c ?? 0;
  const featuredCount = featuredRows[0]?.c ?? 0;
  const archivedCount = archivedRows[0]?.c ?? 0;

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
          / Dashboard
        </p>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">Welcome back.</h1>
        <p className="text-cream/60 mt-2">Manage the catalog. Site copy lives in code translations.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Live products" value={productCount} />
        <Stat label="Featured" value={featuredCount} />
        <Stat label="Archived" value={archivedCount} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Tile
          href="/admin/products"
          title="Products"
          body="Add a new piece, edit price, sizes, colors and images, archive what's gone. Drag the list to reorder how products appear on the storefront."
          cta="Manage products →"
        />
        <Tile
          href="/admin/content"
          title="Site copy"
          body="Edit every label, headline and paragraph on the storefront, per language. Leave a field blank to keep the in-code default."
          cta="Edit content →"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-cream/10 bg-smoke rounded-lg p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-2">
        {label}
      </p>
      <p className="font-display text-4xl">{value}</p>
    </div>
  );
}

function Tile({
  href,
  title,
  body,
  cta,
}: {
  href: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-cream/10 bg-smoke rounded-lg p-6 hover:border-mares hover:bg-ink transition-colors group"
    >
      <p className="font-display text-2xl tracking-tight">{title}</p>
      <p className="text-cream/60 mt-2 text-sm">{body}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-mares mt-6 group-hover:translate-x-1 transition-transform">
        {cta}
      </p>
    </Link>
  );
}
