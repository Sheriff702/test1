"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

export function AboutContent() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = usePreferences();

  const VALUES = [
    { n: "01", t: t("valueFunctionTitle"), b: t("valueFunctionBody") },
    { n: "02", t: t("valueNoLogoTitle"), b: t("valueNoLogoBody") },
    { n: "03", t: t("valueBuiltTitle"), b: t("valueBuiltBody") },
    { n: "04", t: t("valueRunsTitle"), b: t("valueRunsBody") },
  ];

  useEffect(() => {
    if (!ref.current) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector(".about-title") as HTMLElement;
      split = new SplitText(title, { type: "chars" });
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
    }, ref);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [lang]);

  return (
    <div ref={ref} className="pt-32 pb-20">
      <div className="  px-6 md:px-12">
        <p
          data-text-role="about.label"
          className="font-mono text-[20px] uppercase tracking-widest text-mares mb-4"
        >
          {t("studio")}
        </p>
        <h1
          data-text-role="about.title"
          className="font-display text-7xl md:text-[350px] tracking-tighter leading-[0.85] "
        >
          <span className="about-title inline-block">
            {t("aboutTitle")}
          </span>
        </h1>

        <div className="grid md:grid-cols-12 gap-10 mt-24">
          <div className="md:col-span-5">
            <div className="about-img relative aspect-[3/4] bg-smoke overflow-hidden sticky top-28">
              <Image
                src={t("imgAbout")}
                alt="Studio"
                fill
                sizes="(max-width:768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div
            data-text-role="about.paragraph"
            className="md:col-span-7 space-y-8 text-lg leading-relaxed text-cream/80"
          >
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
            <p>{t("aboutP3")}</p>
          </div>
        </div>

        <div className="about-values mt-40 grid md:grid-cols-4 gap-10">
          {VALUES.map((v) => (
            <div
              key={v.n}
              className="about-value border-t border-cream/20 pt-4"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-mares mb-6">
                {v.n}
              </p>
              <h3
                data-text-role="about.valueTitle"
                className="font-display text-3xl tracking-tight leading-tight mb-3"
              >
                {v.t}
              </h3>
              <p
                data-text-role="about.valueBody"
                className="text-sm text-cream/70 leading-relaxed"
              >
                {v.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
