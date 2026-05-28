"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { gsap, Flip } from "@/lib/gsap";
import {
  products as staticProducts,
  categories,
  type Product,
} from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/preferences";

type Cat = (typeof categories)[number]["slug"];

const CAT_KEY: Record<(typeof categories)[number]["slug"], string> = {
  all: "catAll",
  outerwear: "catOuterwear",
  tops: "catTops",
  bottoms: "catBottoms",
  footwear: "catFootwear",
  accessories: "catAccessories",
};

export function ShopGrid({ products }: { products?: Product[] } = {}) {
  const [active, setActive] = useState<Cat>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef<Cat | null>(null);
  const { t } = usePreferences();
  const source = products ?? staticProducts;

  const filtered = useMemo<Product[]>(
    () =>
      active === "all" ? source : source.filter((p) => p.category === active),
    [active, source],
  );

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card");

    if (prevActive.current === null) {
      prevActive.current = active;
      gsap.from(cards, {
        y: 40,
        stagger: 0.06,
        duration: 0.9,
        ease: "expo.out",
      });
      return;
    }

    if (prevActive.current === active) return;
    prevActive.current = active;

    const state = Flip.getState(cards);
    requestAnimationFrame(() => {
      if (!gridRef.current) return;
      Flip.from(state, {
        duration: 0.6,
        ease: "expo.out",
        stagger: 0.03,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { scale: 0.9 }, { scale: 1, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
      });
    });
  }, [active]);

  return (
    <div>
      <div className="sticky top-20 z-30 bg-ink/80 backdrop-blur-md -mx-6 md:-mx-12 px-6 md:px-12 py-4 border-b border-cream/10 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              data-cursor="filter"
              className={cn(
                "shrink-0 font-mono text-xs uppercase tracking-widest px-4 py-2 border rounded-full transition-colors",
                active === c.slug
                  ? "bg-mares text-ink border-mares"
                  : "border-cream/20 text-cream/80 hover:border-cream/60 hover:text-cream",
              )}
            >
              {t(CAT_KEY[c.slug] as "catAll")}
            </button>
          ))}
          <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-widest text-cream/50">
            {filtered.length} {filtered.length === 1 ? t("item") : t("items")}
          </span>
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
