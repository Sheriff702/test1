"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const VALUES = [
  {
    n: "01",
    t: "Function first",
    b: "Every seam, every pocket, every zip — tested on a 40-minute commute in the rain.",
  },
  {
    n: "02",
    t: "No logo noise",
    b: "Debossed hardware. No chest prints. If you know, you know.",
  },
  {
    n: "03",
    t: "Built to last",
    b: "250–500gsm fabrics. Reinforced stress points. Pieces you'll retire, not replace.",
  },
  {
    n: "04",
    t: "Small runs",
    b: "200 of each. When it's gone, it's gone — and we move on to the next one.",
  },
];

export function AboutContent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector(".about-title") as HTMLElement;
      const split = new SplitText(title, { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.04,
        duration: 1.2,
        ease: "expo.out",
      });
      gsap.fromTo(
        ".about-img",
        { clipPath: "inset(0 0 100% 0)", scale: 1.1 },
        {
          clipPath: "inset(0 0 0% 0)",
          scale: 1,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".about-img", start: "top 80%" },
        },
      );
      gsap.from(".about-value", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-values", start: "top 70%" },
      });
      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-4">
          / Studio
        </p>
        <h1 className="about-title font-display text-7xl md:text-10xl tracking-tighter leading-[0.85] max-w-5xl">
          We make clothes for people who move.
        </h1>

        <div className="grid md:grid-cols-12 gap-10 mt-24">
          <div className="md:col-span-5">
            <div className="about-img relative aspect-[3/4] bg-smoke overflow-hidden sticky top-28">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                alt="Studio"
                fill
                sizes="(max-width:768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-8 text-lg leading-relaxed text-cream/80">
            <p>
              MARES is a small studio between Stockholm and Berlin. We design technical
              streetwear in limited runs — twelve pieces per season, two hundred of
              each, no restocks.
            </p>
            <p>
              Every garment gets a winter, a summer, a rainy autumn, and at
              least one 3AM club test before we approve the sample. If it fails
              any of them, it doesn&apos;t leave the atelier.
            </p>
            <p>
              We don&apos;t chase trends. We build an urban uniform — the layers
              you reach for without thinking, the ones that outlast the version
              of yourself that bought them.
            </p>
          </div>
        </div>

        <div className="about-values mt-40 grid md:grid-cols-4 gap-10">
          {VALUES.map((v) => (
            <div key={v.n} className="about-value border-t border-cream/20 pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-mares mb-6">
                {v.n}
              </p>
              <h3 className="font-display text-3xl tracking-tight leading-tight mb-3">
                {v.t}
              </h3>
              <p className="text-sm text-cream/70 leading-relaxed">{v.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
