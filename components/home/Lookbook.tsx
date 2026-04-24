"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    title: "Chapter 01",
    subtitle: "Concrete",
    body: "Built for the freight elevator, the loading dock, the quiet minute before the night begins.",
  },
  {
    src: "https://images.unsplash.com/photo-1488831295921-b4ed3d0e9a0a?auto=format&fit=crop&w=1600&q=80",
    title: "Chapter 02",
    subtitle: "Signal",
    body: "Reflective tape, silent hardware, soft interior. Designed to disappear and reappear.",
  },
  {
    src: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1600&q=80",
    title: "Chapter 03",
    subtitle: "Static",
    body: "Heavyweight jersey, boxed shoulders, no logo. The uniform before it becomes a uniform.",
  },
  {
    src: "https://images.unsplash.com/photo-1520975922284-9d8e0f4c5c2b?auto=format&fit=crop&w=1600&q=80",
    title: "Chapter 04",
    subtitle: "Drift",
    body: "Wide, soft, weatherproof. For the walk home at 3AM when the city finally belongs to you.",
  },
];

export function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth;

      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -distance(), ease: "none" }),
      });

      // Active slide subtle scale on focus
      const slides = gsap.utils.toArray<HTMLElement>(".lb-slide");
      slides.forEach((slide) => {
        gsap.fromTo(
          slide.querySelector(".lb-img"),
          { scale: 0.95 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              containerAnimation: st.animation,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-ink">
      <div className="absolute top-8 left-6 md:left-12 z-10 font-mono text-[10px] uppercase tracking-widest text-mares">
        / Lookbook SS26 — drag or scroll
      </div>

      <div
        ref={trackRef}
        className="h-full flex items-center gap-8 md:gap-16 pl-6 md:pl-12 pr-[40vw] will-change-transform"
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="lb-slide shrink-0 w-[70vw] md:w-[45vw] lg:w-[35vw] h-[70vh] relative flex flex-col justify-end"
          >
            <div className="lb-img absolute inset-0 overflow-hidden will-change-transform">
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
  );
}
