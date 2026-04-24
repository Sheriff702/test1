import { ShopGrid } from "@/components/shop/ShopGrid";

export const metadata = {
  title: "Shop — MARES",
  description: "Shop the SS26 collection.",
};

export default function ShopPage() {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen">
      <div className="container mx-auto">
        <header className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-MARES mb-3">
            / Collection
          </p>
          <h1 className="font-display text-7xl md:text-9xl tracking-tighter leading-[0.85]">
            Shop
          </h1>
          <p className="text-cream/60 mt-4 max-w-md">
            Twelve pieces, engineered. Filter by category — the grid reflows.
          </p>
        </header>
        <ShopGrid />
      </div>
    </div>
  );
}
