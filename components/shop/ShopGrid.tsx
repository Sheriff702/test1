"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { gsap, Flip } from "@/lib/gsap";
import { products, categories, type Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

type Cat = (typeof categories)[number]["slug"];

export function ShopGrid() {
  const [active, setActive] = useState<Cat>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  const filtered = useMemo<Product[]>(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".product-card");
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 1, ease: "expo.out" },
        );
      }
      return;
    }
    if (!gridRef.current) return;
    const state = Flip.getState(gridRef.current.querySelectorAll(".product-card"));
    // state captured AFTER re-render via rAF
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.03,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
      });
    });
  }, [filtered]);

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
              {c.label}
            </button>
          ))}
          <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-widest text-cream/50">
            {filtered.length} item{filtered.length !== 1 && "s"}
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
