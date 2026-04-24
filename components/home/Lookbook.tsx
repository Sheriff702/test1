"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

const SLIDES_RAW = [
  {
    src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1600&q=80",
    n: 1 as const,
  },
  {
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1600&q=80",
    n: 2 as const,
  },
  {
    src: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1600&q=80",
    n: 3 as const,
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    n: 4 as const,
  },
];

export function Lookbook() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = usePreferences();
  const SLIDES = SLIDES_RAW.map((s) => ({
    src: s.src,
    title: `${t("chapter")} 0${s.n}`,
    subtitle: t(`lbHomeTitle${s.n}` as "lbHomeTitle1"),
    body: t(`lbHomeBody${s.n}` as "lbHomeBody1"),
  }));

  useEffect(() => {
    if (!ref.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
    <section ref={ref} className="relative h-screen overflow-hidden bg-ink">
      <div className="absolute top-8 left-6 md:left-12 z-10 font-mono text-[10px] uppercase tracking-widest text-mares">
        {t("lookbookLabel")}
      </div>

      <div
        ref={trackRef}
        className="h-full flex items-stretch gap-6 md:gap-10 pt-20 pb-8 pl-6 md:pl-12 pr-[20vw] will-change-transform"
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="lb-slide shrink-0 w-[70vw] md:w-[45vw] lg:w-[35vw] relative flex flex-col justify-end"
          >
            <div className="lb-img absolute inset-0 overflow-hidden">
              <Image
                src={s.src}
                alt={s.title}
                fill
                sizes="(max-width:768px) 70vw, 35vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/60">
                {s.title}
              </p>
              <h3 className="font-display text-5xl md:text-7xl tracking-tight leading-none my-3">
                {s.subtitle}
              </h3>
              <p className="text-sm text-cream/70 max-w-xs">{s.body}</p>
            </div>
            <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-cream/40">
              0{i + 1} / 0{SLIDES.length}
            </span>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}
