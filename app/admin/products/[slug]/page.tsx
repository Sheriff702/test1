import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, ensureReady } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-guard";
import { updateProduct, deleteProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  await ensureReady();
  const { slug } = await params;
  const row = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!row) notFound();

  const action = updateProduct.bind(null, row.slug);
  const onDelete = deleteProduct.bind(null, row.slug);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <Link
            href="/admin/products"
            className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-mares"
          >
            ← Back to products
          </Link>
          <h1 className="font-display text-5xl tracking-tight mt-2">{row.name}</h1>
          <p className="font-mono text-[10px] text-cream/40 mt-1">/shop/{row.slug}</p>
        </div>
        <Link
          href={`/shop/${row.slug}`}
          target="_blank"
          className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-mares"
        >
          View live ↗
        </Link>
      </header>

      <ProductForm
        initial={{
          slug: row.slug,
          name: row.name,
          subtitle: row.subtitle,
          price: row.price,
          currency: row.currency,
          category: row.category,
          drop: row.drop,
          description: row.description,
          sortOrder: row.sortOrder,
          featured: row.featured,
          sizes: row.sizes ?? [],
          colors: row.colors ?? [],
          images: row.images ?? [],
        }}
        action={action}
        submitLabel="Save changes"
        onDelete={onDelete}
      />
    </div>
  );
}
