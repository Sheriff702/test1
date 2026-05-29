"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { products as staticProducts, type Product } from "@/lib/products";
import { usePreferences } from "@/lib/preferences";

export function FeaturedGrid({ products }: { products?: Product[] } = {}) {
  const ref = useRef<HTMLElement>(null);
  const source = products ?? staticProducts;
  const featured = source.slice(0, 4);
  const { t } = usePreferences();

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".fg-card");
      cards.forEach((card) => {
        const img = card.querySelector(".fg-img");
        gsap.from(card, {
          y: 40,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 95%", once: true },
        });
        gsap.from(img, {
          scale: 1.15,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 95%", once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-32 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p
              data-text-role="featured.label"
              className="font-mono text-[10px] uppercase tracking-widest text-mares mb-3"
            >
              {t("featured")}
            </p>
            <h2
              data-text-role="featured.title"
              className="font-display text-5xl md:text-7xl tracking-tight leading-none"
            >
              {t("coreDrop")}
            </h2>
          </div>
          <Link
            href="/shop"
            data-cursor="view"
            className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-mares transition-colors border-b border-cream/30 hover:border-mares pb-1 hidden md:inline"
          >
            {t("seeAll")}
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
                  <p
                    data-text-role="featured.cardName"
                    className="font-display text-lg leading-none tracking-tight"
                  >
                    {p.name}
                  </p>
                  <p
                    data-text-role="featured.cardMeta"
                    className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-1"
                  >
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
