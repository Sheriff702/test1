"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

export function LookbookStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = usePreferences();

  const STORY = ([1, 2, 3, 4] as const).map((i) => ({
    n: `0${i}`,
    h: t(`storyChapter${i}H` as "storyChapter1H"),
    b: t(`storyChapter${i}B` as "storyChapter1B"),
    src: t(`imgLbStory${i}` as "imgLbStory1"),
  }));

  useEffect(() => {
    if (!ref.current) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector(".lb-hero-title") as HTMLElement;
      split = new SplitText(title, { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.04,
        duration: 1.1,
        ease: "expo.out",
      });

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
    }, ref);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [lang]);

  return (
    <div ref={ref}>
      <section className="pt-40 pb-20 px-6 md:px-12">
        <div className="container mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-4">
            {t("lookbookLabelStory")}
          </p>
          <h1 className="font-display text-7xl md:text-10xl tracking-tighter leading-[0.8]">
            <span className="lb-hero-title inline-block">
              {t("storyTitleOne")}
              <br />
              {t("storyTitleTwo")}
            </span>
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
              <p className="font-mono text-[10px] uppercase tracking-widest text-mares">
                {t("chapter")} {c.n}
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
