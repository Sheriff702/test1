import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-guard";
import { createProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/products"
          className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-mares"
        >
          ← Back to products
        </Link>
        <h1 className="font-display text-5xl tracking-tight mt-2">New product</h1>
      </header>
      <ProductForm
        initial={{
          slug: "",
          name: "",
          subtitle: "",
          price: 0,
          currency: "€",
          category: "tops",
          drop: "",
          description: "",
          sortOrder: 100,
          featured: false,
          sizes: [],
          colors: [],
          images: [],
        }}
        action={createProduct}
        submitLabel="Create product"
      />
    </div>
  );
}
