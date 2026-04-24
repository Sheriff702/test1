"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, ScrambleTextPlugin } from "@/lib/gsap";

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

export function Drops() {
  const ref = useRef<HTMLElement>(null);
  const target = new Date();
  target.setDate(target.getDate() + 14);
  const { d, h, m, s } = useCountdown(target);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".drops-img",
        { clipPath: "inset(50% 50% 50% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        },
      );
      gsap.from(".drops-copy > *", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.to(".drops-title", {
        scrambleText: {
          text: "SS26 / DROP 02",
          chars: "upperCase",
          speed: 0.7,
        },
        duration: 2,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-12 bg-ink overflow-hidden"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className="relative aspect-[4/5] overflow-hidden bg-smoke order-2 md:order-1">
          <div className="drops-img absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=1400&q=80"
              alt="Next drop"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest bg-volt text-ink px-2 py-1">
            Drop 02
          </span>
        </div>

        <div className="drops-copy order-1 md:order-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-volt mb-4">/ Next drop</p>
          <h2 className="drops-title font-display text-6xl md:text-8xl leading-[0.9] tracking-tighter mb-8">
            SS26 / DROP 02
          </h2>
          <p className="text-lg text-cream/80 max-w-md mb-10 leading-snug">
            Twelve pieces. Two hundred of each. Weatherproofed outerwear, deadstock
            indigo, technical knits. Set your alarm.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-10 max-w-md">
            {[
              { v: d, l: "Days" },
              { v: h, l: "Hours" },
              { v: m, l: "Mins" },
              { v: s, l: "Secs" },
            ].map((t) => (
              <div key={t.l} className="border-t border-cream/20 pt-3">
                <p className="font-display text-4xl md:text-5xl tracking-tight leading-none tabular-nums">
                  {String(t.v).padStart(2, "0")}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-2">
                  {t.l}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            data-cursor="go"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cream border-b border-cream pb-1 hover:text-volt hover:border-volt transition-colors"
          >
            Notify me <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
