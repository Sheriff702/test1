"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const TOKENS = [
  "NEW DROP",
  "SS26",
  "URBAN UNIFORM",
  "BUILT FOR THE STREET",
  "MARES ✦",
];

export function HeroMarquee({
  direction = 1,
  className,
}: {
  direction?: 1 | -1;
  className?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current!;
    const speed = 40 * direction;
    let x = 0;
    let lastScroll = 0;
    let boost = 0;

    const tween = gsap.to(
      {},
      {
        duration: 1,
        repeat: -1,
        onUpdate: () => {
          x -= (speed + boost) / 60;
          const width = inner.scrollWidth / 2;
          if (x <= -width) x += width;
          if (x >= 0 && direction === -1) x -= width;
          inner.style.transform = `translate3d(${x}px,0,0)`;
          boost *= 0.92;
        },
      },
    );

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const delta = self.scroll() - lastScroll;
        lastScroll = self.scroll();
        boost += delta * 0.8 * direction;
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, [direction]);

  return (
    <div
      ref={rowRef}
      className={cn("overflow-hidden whitespace-nowrap", className)}
    >
      <div ref={innerRef} className="inline-flex will-change-transform">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="inline-flex items-center shrink-0">
            {TOKENS.concat(TOKENS).map((t, j) => (
              <span
                key={`${i}-${j}`}
                className="font-display text-6xl md:text-8xl tracking-tight px-8 leading-none flex items-center gap-8"
              >
                {t}
                <span className="text-MARES">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
