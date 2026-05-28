"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrambleTextPlugin } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

function useCountdown(daysAhead: number) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.now() + daysAhead * 86400000;
    const tick = () => setDiff(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [daysAhead]);
  const ready = diff !== null;
  const v = diff ?? 0;
  return {
    ready,
    d: Math.floor(v / 86400000),
    h: Math.floor((v / 3600000) % 24),
    m: Math.floor((v / 60000) % 60),
    s: Math.floor((v / 1000) % 60),
  };
}

export function Drops() {
  const ref = useRef<HTMLElement>(null);
  const { ready, d, h, m, s } = useCountdown(14);
  const { t } = usePreferences();

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".drops-img", {
        scale: 1.15,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.from(".drops-copy > *", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.to(".drops-title", {
        scrambleText: {
          text: t("newDrop").toUpperCase(),
          chars: "upperCase",
          speed: 0.7,
        },
        duration: 2,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [t]);

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-12 bg-ink overflow-hidden"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className="relative aspect-[4/5] overflow-hidden bg-smoke order-2 md:order-1">
          <div className="drops-img absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1400&q=80"
              alt="Next drop"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest bg-mares text-ink px-2 py-1">
            Drop 02
          </span>
        </div>

        <div className="drops-copy order-1 md:order-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-4">
            {t("nextDrop")}
          </p>
          <h2 className="drops-title font-display text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-8">
            {t("newDrop")}
          </h2>
          <p className="text-lg text-cream/80 max-w-md mb-10 leading-snug">
            {t("dropBody")}
          </p>

          <div className="grid grid-cols-4 gap-4 mb-10 max-w-md">
            {[
              { v: d, l: t("days") },
              { v: h, l: t("hours") },
              { v: m, l: t("mins") },
              { v: s, l: t("secs") },
            ].map((r) => (
              <div key={r.l} className="border-t border-cream/20 pt-3">
                <p className="font-display text-4xl md:text-5xl tracking-tight leading-none tabular-nums">
                  {ready ? String(r.v).padStart(2, "0") : "--"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-2">
                  {r.l}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            data-cursor="go"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cream border-b border-cream pb-1 hover:text-mares hover:border-mares transition-colors"
          >
            {t("notifyMe")} <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
