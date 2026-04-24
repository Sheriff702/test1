"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/preferences";

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const remove = useCart((s) => s.remove);
  const { t } = usePreferences();

  const totalRef = useRef<HTMLSpanElement>(null);

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
        onClick={close}
        className={cn(
          "fixed inset-0 bg-ink/70 backdrop-blur-sm z-[120] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-smoke border-l border-cream/10 z-[121] flex flex-col will-change-transform transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between p-6 border-b border-cream/10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-1">
              {t("cartLabel")}
            </p>
            <h2 className="font-display text-3xl tracking-tight leading-none">
              {t("yourBag")}
            </h2>
          </div>
          <button
            onClick={close}
            data-cursor="close"
            className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-mares transition-colors"
          >
            {t("closeMark")}
          </button>
        </header>

        <div
          className="flex-1 overflow-y-auto p-6 space-y-6"
          data-lenis-prevent
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="font-display text-4xl tracking-tight mb-3">
                {t("empty")}
              </p>
              <p className="text-cream/60 text-sm max-w-xs">
                {t("emptyHint")}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.slug}-${item.size}-${item.color}`}
                className="cart-line flex gap-4"
              >
                <div className="relative w-24 aspect-[3/4] bg-ink overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
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
                      {t("remove")}
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
              {t("subtotal")}
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
            {t("checkout")}
          </button>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40 text-center">
            {t("demoNoCheckout")}
          </p>
        </footer>
      </aside>
    </>
  );
}
