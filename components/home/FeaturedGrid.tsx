"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { products } from "@/lib/products";

export function FeaturedGrid() {
  const ref = useRef<HTMLElement>(null);
  const featured = products.slice(0, 4);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".fg-card");
      cards.forEach((card, i) => {
        const img = card.querySelector(".fg-img");
        const info = card.querySelector(".fg-info");
        gsap.fromTo(
          card,
          { yPercent: 20, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
        gsap.fromTo(
          img,
          { scale: 1.25, clipPath: "inset(0 0 100% 0)" },
          {
            scale: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 80%" },
          },
        );
        gsap.fromTo(
          info,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 80%" },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-32 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-volt mb-3">/ Featured</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight leading-none">
              Core drop.
            </h2>
          </div>
          <Link
            href="/shop"
            data-cursor="view"
            className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-volt transition-colors border-b border-cream/30 hover:border-volt pb-1 hidden md:inline"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              data-cursor="view"
              className="fg-card group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-smoke mb-4">
                <div className="fg-img absolute inset-0">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                  />
                </div>
                <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-ink/80 px-2 py-1 text-cream">
                  {p.drop}
                </span>
              </div>
              <div className="fg-info flex items-start justify-between">
                <div>
                  <p className="font-display text-lg leading-none tracking-tight">{p.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-1">
                    {p.subtitle}
                  </p>
                </div>
                <p className="font-mono text-sm text-cream">
                  {p.currency}
                  {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
