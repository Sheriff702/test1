import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { Lookbook } from "@/components/home/Lookbook";
import { Drops } from "@/components/home/Drops";
import { HeroMarquee } from "@/components/hero/HeroMarquee";
import { getFeaturedProducts } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedGrid products={featured} />
      <Lookbook />
      <div className="py-12 z-50 border-y border-cream/10 bg-smoke">
        <HeroMarquee direction={-1} />
      </div>
      <Drops />
    </>
  );
}
