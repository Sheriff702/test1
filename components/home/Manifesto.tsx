"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const TEXT =
  "We build the uniform for people who move through the city on their own frequency. Heavyweight fabric, considered hardware, silent logos. No trend cycle—just garments that survive the commute, the club, the weather, and you.";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const target = ref.current!.querySelector(".manifesto-text") as HTMLElement;
      const split = new SplitText(target, { type: "words" });

      gsap.set(split.words, { opacity: 0.15 });

      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      });

      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-12 bg-ink"
    >
      <div className="container mx-auto grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-volt sticky top-32">
            / Manifesto
          </p>
        </div>
        <div className="md:col-span-9">
          <p className="manifesto-text font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-cream">
            {TEXT}
          </p>
        </div>
      </div>
    </section>
  );
}
