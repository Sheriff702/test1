"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const [size, setSize] = useState(
    product.sizes[Math.floor(product.sizes.length / 2)],
  );
  const [color, setColor] = useState(product.colors[0]);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector(".pd-title") as HTMLElement;
      const split = new SplitText(title, { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.03,
        duration: 1,
        ease: "expo.out",
      });
      gsap.fromTo(
        ".pd-hero-img",
        { clipPath: "inset(0 0 100% 0)", scale: 1.2 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          delay: 0.1,
        },
      );
      gsap.from(".pd-meta > *", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        delay: 0.4,
        ease: "expo.out",
      });
      gsap.from(".pd-side", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        delay: 0.5,
        ease: "expo.out",
      });
      gsap.from(".pd-thumb", {
        yPercent: 20,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: ".pd-gallery", start: "top 80%" },
        duration: 1,
        ease: "expo.out",
      });
      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  const addToCart = () => {
    add(product, { size, color });
    gsap.fromTo(
      ".pd-add",
      { scale: 1 },
      {
        scale: 0.96,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
    );
  };

  return (
    <div ref={ref} className="pt-28 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <Link
          href="/shop"
          data-cursor="back"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cream/60 hover:text-MARES transition-colors mb-8"
        >
          <span>←</span> Back to shop
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20">
          <div>
            <div
              data-flip-id={`product-${product.slug}`}
              className="pd-hero-img relative aspect-[4/5] bg-smoke overflow-hidden"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="pd-gallery grid grid-cols-2 gap-4 mt-4">
              {product.images.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="pd-thumb relative aspect-[4/5] bg-smoke overflow-hidden"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="40vw"
                    className="object-cover"
                  />
                </div>
              ))}
              {product.images.length < 2 && (
                <div className="pd-thumb relative aspect-[4/5] bg-smoke overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="40vw"
                    className="object-cover grayscale"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pd-side lg:sticky lg:top-28 lg:self-start space-y-8">
            <div className="pd-meta">
              <p className="font-mono text-[10px] uppercase tracking-widest text-MARES mb-3">
                {product.subtitle}
              </p>
              <h1 className="pd-title font-display text-5xl md:text-7xl tracking-tight leading-none">
                {product.name}
              </h1>
              <p className="font-mono text-xl text-cream mt-4">
                {product.currency}
                {product.price}
              </p>
            </div>

            <p className="text-cream/75 leading-relaxed max-w-md">
              {product.description}
            </p>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-3">
                Color
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    data-cursor="pick"
                    className={cn(
                      "font-mono text-xs uppercase tracking-widest px-4 py-2 border rounded-full transition-colors",
                      color === c
                        ? "bg-cream text-ink border-cream"
                        : "border-cream/30 hover:border-cream",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-3">
                Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    data-cursor="pick"
                    className={cn(
                      "font-mono text-xs uppercase tracking-widest min-w-[3rem] px-3 py-2 border rounded-full transition-colors",
                      size === s
                        ? "bg-cream text-ink border-cream"
                        : "border-cream/30 hover:border-cream",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addToCart}
              data-cursor="add"
              className="pd-add group w-full relative overflow-hidden bg-MARES text-ink font-display tracking-tight text-xl py-5 rounded-full"
            >
              <span className="relative z-10">
                Add to cart — {product.currency}
                {product.price}
              </span>
              <span className="absolute inset-0 bg-ink scale-y-0 origin-bottom transition-transform duration-500 ease-expo group-hover:scale-y-100" />
              <span className="absolute inset-0 flex items-center justify-center text-MARES opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-expo">
                Secure the piece →
              </span>
            </button>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream/10 font-mono text-[10px] uppercase tracking-widest text-cream/60">
              <div>
                <p className="text-cream/40 mb-1">Shipping</p>
                <p className="text-cream">Free over €250</p>
              </div>
              <div>
                <p className="text-cream/40 mb-1">Returns</p>
                <p className="text-cream">30 days, on us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
