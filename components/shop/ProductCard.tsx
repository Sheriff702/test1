"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.04, duration: 0.8, ease: "expo.out" });
  };
  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 1, ease: "expo.out" });
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "expo.out" });
  };
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: 0.6,
      ease: "expo.out",
      transformPerspective: 1000,
    });
  };

  return (
    <Link
      ref={ref}
      href={`/shop/${product.slug}`}
      data-cursor="view"
      data-flip-id={`product-${product.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className="product-card group block relative [transform-style:preserve-3d]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-smoke mb-4">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </div>
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-ink/80 px-2 py-1 text-cream z-10">
          {product.drop}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg leading-none tracking-tight">{product.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-1">
            {product.subtitle}
          </p>
        </div>
        <p className="font-mono text-sm text-cream">
          {product.currency}
          {product.price}
        </p>
      </div>
    </Link>
  );
}
