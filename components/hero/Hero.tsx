"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { HeroMarquee } from "./HeroMarquee";
import { MagneticCTA } from "./MagneticCTA";
import { usePreferences } from "@/lib/preferences";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { t } = usePreferences();

  useEffect(() => {
    if (!root.current) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const wordmark = root.current!.querySelector(
        ".hero-wordmark",
      ) as HTMLElement;
      const kicker = root.current!.querySelector(".hero-kicker") as HTMLElement;
      const subline = root.current!.querySelectorAll(".hero-subline");
      const bgImage = root.current!.querySelector(".hero-bg") as HTMLElement;
      const model = root.current!.querySelector(".hero-model") as HTMLElement;
      const cta = root.current!.querySelector(".hero-cta") as HTMLElement;
      const meta = root.current!.querySelectorAll(".hero-meta-row");
      const hint = root.current!.querySelector(".hero-hint") as HTMLElement;

      split = new SplitText(wordmark, { type: "chars" });
      gsap.set(wordmark, { visibility: "visible" });
      gsap.set(split.chars, { yPercent: 120, opacity: 0, rotation: 8 });

      // Intro timeline
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(
        bgImage,
        { clipPath: "inset(50% 50% 50% 50%)", scale: 1.2 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.6 },
        0,
      )
        .from(kicker, { y: 30, opacity: 0, duration: 1 }, 0.2)
        .to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            rotation: 0,
            stagger: { each: 0.06, from: "random" },
            duration: 1.4,
          },
          0.3,
        )
        .fromTo(
          model,
          { yPercent: 40, opacity: 0, scale: 1.05 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 1.6 },
          0.6,
        )
        .from(subline, { y: 30, opacity: 0, stagger: 0.12, duration: 1 }, 0.9)
        .from(cta, { y: 30, opacity: 0, duration: 1 }, 1.1)
        .from(meta, { opacity: 0, y: 10, stagger: 0.08, duration: 0.8 }, 1.2)
        .from(hint, { opacity: 0, y: 10, duration: 0.8 }, 1.4);
    }, root);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        <Image
          src={t("imgHeroBg")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
      </div>

      {/* Foreground model */}
      <div className="hero-model absolute right-0 bottom-0 top-0 w-[65%] md:w-[55%] lg:w-[48%] pointer-events-none will-change-transform">
        <Image
          src={t("imgHeroModel")}
          alt="Model wearing MARES"
          fill
          priority
          sizes="(max-width: 768px) 65vw, 48vw"
          className="object-cover object-top grayscale contrast-125"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 h-full flex flex-col">
        {/* Top meta */}
        <div className="pt-32 px-6 md:px-12 flex justify-between items-start font-mono text-[10px] uppercase tracking-widest text-cream/70">
          <span className="hero-meta-row flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-mares rounded-full animate-pulse" />
            Live / {t("newCollection")}
          </span>
          <span className="hero-meta-row hidden md:inline">
            N59°19′ / E18°04′
          </span>
        </div>

        {/* Wordmark + subline */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 relative">
          <p className="hero-kicker font-mono text-xs uppercase tracking-[0.3em] text-mares mb-6">
            {t("heroKicker")}
          </p>
          <h1 className="font-display text-10xl leading-[0.82] tracking-tighter text-cream mix-blend-difference">
            <span
              className="hero-wordmark inline-block"
              style={{ visibility: "hidden" }}
            >
              MARES
            </span>
          </h1>
          <div className="mt-10 max-w-xl">
            <p className="hero-subline text-lg md:text-xl text-cream/80 leading-snug">
              {t("subPart1")}{" "}
              <span className="text-mares">{t("subPart2")}</span> {t("subPart3")}
            </p>
            <div className="hero-cta mt-10 flex items-center gap-6">
              <MagneticCTA href="/shop" label={t("shopTheDrop")} />
              <Link
                href="/lookbook"
                data-cursor="view"
                className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-mares transition-colors border-b border-cream/30 hover:border-mares pb-1"
              >
                {t("seeLookbook")}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-hint absolute bottom-28 left-6 md:left-12 font-mono text-[10px] uppercase tracking-widest text-cream/60 flex items-center gap-3">
          <span className="block w-10 h-px bg-cream/40" />
          {t("scrollToEnter")}
        </div>
      </div>

      {/* Marquee at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-cream/10 bg-ink/40 backdrop-blur-sm py-4 z-10">
        <HeroMarquee />
      </div>
    </section>
  );
}
