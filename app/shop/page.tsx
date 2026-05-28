import { ShopGrid } from "@/components/shop/ShopGrid";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { getAllProducts } from "@/lib/products-db";

export const metadata = {
  title: "Shop — MARES",
  description: "Shop the new collection.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen">
      <div className="container mx-auto">
        <ShopHeader />
        <ShopGrid products={products} />
      </div>
    </div>
  );
}
