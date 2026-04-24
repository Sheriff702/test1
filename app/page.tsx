import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { Lookbook } from "@/components/home/Lookbook";
import { Drops } from "@/components/home/Drops";
import { HeroMarquee } from "@/components/hero/HeroMarquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedGrid />
      <Lookbook />
      <div className="py-12 border-y border-cream/10 bg-smoke">
        <HeroMarquee direction={-1} />
      </div>
      <Drops />
    </>
  );
}
