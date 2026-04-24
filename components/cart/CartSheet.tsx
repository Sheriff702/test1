"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/lib/cart";

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const remove = useCart((s) => s.remove);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;
    if (isOpen) {
      gsap.to(backdropRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4 });
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.7, ease: "expo.out" });
      gsap.fromTo(
        ".cart-line",
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "expo.out", delay: 0.2 },
      );
    } else {
      gsap.to(backdropRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
      gsap.to(panelRef.current, { xPercent: 100, duration: 0.6, ease: "expo.in" });
    }
  }, [isOpen, items.length]);

  useEffect(() => {
    if (!totalRef.current) return;
    const obj = { v: total };
    gsap.fromTo(
      obj,
      { v: 0 },
      {
        v: total,
        duration: 0.8,
        ease: "expo.out",
        onUpdate: () => {
          if (totalRef.current)
            totalRef.current.textContent = Math.round(obj.v).toString();
        },
      },
    );
  }, [total]);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={close}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-[120] opacity-0 pointer-events-none"
      />
      <aside
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-smoke border-l border-cream/10 z-[121] translate-x-full flex flex-col"
        style={{ transform: "translateX(100%)" }}
      >
        <header className="flex items-center justify-between p-6 border-b border-cream/10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-1">
              / Cart
            </p>
            <h2 className="font-display text-3xl tracking-tight leading-none">
              Your bag
            </h2>
          </div>
          <button
            onClick={close}
            data-cursor="close"
            className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-mares transition-colors"
          >
            Close ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="font-display text-4xl tracking-tight mb-3">Empty.</p>
              <p className="text-cream/60 text-sm max-w-xs">
                Nothing selected yet. The drop won&apos;t wait.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.slug}-${item.size}-${item.color}`}
                className="cart-line flex gap-4"
              >
                <div className="relative w-24 aspect-[3/4] bg-ink overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-display text-lg leading-none tracking-tight">
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-1">
                      {item.color} / {item.size} / ×{item.qty}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm">
                      {item.currency}
                      {item.price * item.qty}
                    </p>
                    <button
                      onClick={() => remove(item.slug, item.size, item.color)}
                      data-cursor="remove"
                      className="font-mono text-[10px] uppercase tracking-widest text-cream/50 hover:text-blood transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="border-t border-cream/10 p-6 space-y-4">
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="uppercase tracking-widest text-cream/60 text-[10px]">
              Subtotal
            </span>
            <span className="font-display text-2xl">
              €<span ref={totalRef}>0</span>
            </span>
          </div>
          <button
            disabled={items.length === 0}
            data-cursor="checkout"
            className="w-full bg-mares text-ink font-display text-lg py-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Checkout →
          </button>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40 text-center">
            Demo — no real checkout
          </p>
        </footer>
      </aside>
    </>
  );
}
