import { ShopGrid } from "@/components/shop/ShopGrid";
import { ShopHeader } from "@/components/shop/ShopHeader";

export const metadata = {
  title: "Shop — MARES",
  description: "Shop the new collection.",
};

export default function ShopPage() {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen">
      <div className="container mx-auto">
        <ShopHeader />
        <ShopGrid />
      </div>
    </div>
  );
}
