"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const STORY = [
  {
    n: "01",
    h: "Concrete",
    b: "Pre-dawn on the docks. The uniform hasn't earned its name yet.",
    src: "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&w=2000&q=80",
  },
  {
    n: "02",
    h: "Signal",
    b: "Reflective tape catches a passing tram. The city is listening.",
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=2000&q=80",
  },
  {
    n: "03",
    h: "Static",
    b: "Cotton, fleece, silence. The in-between hours.",
    src: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=2000&q=80",
  },
  {
    n: "04",
    h: "Drift",
    b: "Rain on nylon. Walking home the long way on purpose.",
    src: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=2000&q=80",
  },
];

export function LookbookStory() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      // Title split
      const title = ref.current!.querySelector(".lb-hero-title") as HTMLElement;
      const split = new SplitText(title, { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.04,
        duration: 1.1,
        ease: "expo.out",
      });

      // Each chapter
      gsap.utils.toArray<HTMLElement>(".lb-chapter").forEach((ch) => {
        gsap.fromTo(
          ch.querySelector(".lb-chapter-img"),
          { clipPath: "inset(10% 10% 10% 10%)", scale: 1.1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ch,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.from(ch.querySelectorAll(".lb-chapter-text > *"), {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ch, start: "top 70%" },
        });
      });

      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="container mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-MARES mb-4">
            / Lookbook SS26
          </p>
          <h1 className="lb-hero-title font-display text-7xl md:text-11xl tracking-tighter leading-[0.8]">
            FOUR
            <br />
            CHAPTERS.
          </h1>
        </div>
      </section>

      {STORY.map((c, i) => (
        <section
          key={c.n}
          className={`lb-chapter relative min-h-screen flex items-center py-20 px-6 md:px-12 ${
            i % 2 ? "bg-smoke" : "bg-ink"
          }`}
        >
          <div className="container mx-auto grid md:grid-cols-12 gap-10 items-center">
            <div className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
              <div className="lb-chapter-img relative aspect-[4/5] md:aspect-[16/10] bg-smoke overflow-hidden">
                <Image
                  src={c.src}
                  alt={c.h}
                  fill
                  sizes="(max-width:768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div
              className={`lb-chapter-text md:col-span-5 ${i % 2 ? "md:order-1" : ""} space-y-4`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-MARES">
                Chapter {c.n}
              </p>
              <h2 className="font-display text-6xl md:text-8xl tracking-tighter leading-none">
                {c.h}
              </h2>
              <p className="text-lg text-cream/75 max-w-sm">{c.b}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
