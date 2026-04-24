"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { HeroMarquee } from "./HeroMarquee";
import { MagneticCTA } from "./MagneticCTA";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const wordmark = root.current!.querySelector(".hero-wordmark") as HTMLElement;
      const kicker = root.current!.querySelector(".hero-kicker") as HTMLElement;
      const subline = root.current!.querySelectorAll(".hero-subline");
      const bgImage = root.current!.querySelector(".hero-bg") as HTMLElement;
      const model = root.current!.querySelector(".hero-model") as HTMLElement;
      const cta = root.current!.querySelector(".hero-cta") as HTMLElement;
      const meta = root.current!.querySelectorAll(".hero-meta-row");
      const hint = root.current!.querySelector(".hero-hint") as HTMLElement;

      // Split the giant wordmark
      const split = new SplitText(wordmark, { type: "chars" });
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
        .to(split.chars, {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          stagger: { each: 0.06, from: "random" },
          duration: 1.4,
        }, 0.3)
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

      // Scroll-driven: pin, letters spread, model parallax, blur-out handoff
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        animation: gsap
          .timeline()
          .to(split.chars, {
            xPercent: (i, el, arr) => (i - (arr.length - 1) / 2) * 18,
            yPercent: (i) => (i % 2 ? -6 : 6),
            ease: "power2.out",
          }, 0)
          .to(bgImage, { scale: 1.15, ease: "none" }, 0)
          .to(model, { yPercent: -20, scale: 1.05, ease: "none" }, 0)
          .to(".hero-content", { opacity: 0, ease: "none" }, 0.3)
          .to(root.current, { filter: "blur(6px)", scale: 1.05, ease: "none" }, 0.5),
      });

      return () => split.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        <Image
          src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=2400&q=80"
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
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
          alt="Model wearing VOLT"
          fill
          priority
          sizes="(max-width: 768px) 65vw, 48vw"
          className="object-cover object-top grayscale contrast-125"
          style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 h-full flex flex-col">
        {/* Top meta */}
        <div className="pt-32 px-6 md:px-12 flex justify-between items-start font-mono text-[10px] uppercase tracking-widest text-cream/70">
          <span className="hero-meta-row flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-volt rounded-full animate-pulse" />
            Live / SS26 collection
          </span>
          <span className="hero-meta-row hidden md:inline">N59°19′ / E18°04′</span>
        </div>

        {/* Wordmark + subline */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 relative">
          <p className="hero-kicker font-mono text-xs uppercase tracking-[0.3em] text-volt mb-6">
            Chapter 01 — Urban Uniform
          </p>
          <h1 className="hero-wordmark font-display text-10xl leading-[0.82] tracking-tighter text-cream mix-blend-difference">
            VOLT
          </h1>
          <div className="mt-10 max-w-xl">
            <p className="hero-subline text-lg md:text-xl text-cream/80 leading-snug">
              Streetwear, engineered.{" "}
              <span className="text-volt">Built for the street,</span> cut for the body, tested in the rain.
            </p>
            <div className="hero-cta mt-10 flex items-center gap-6">
              <MagneticCTA href="/shop" label="Shop the drop" />
              <Link
                href="/lookbook"
                data-cursor="view"
                className="font-mono text-xs uppercase tracking-widest text-cream/70 hover:text-volt transition-colors border-b border-cream/30 hover:border-volt pb-1"
              >
                Lookbook SS26 →
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-hint absolute bottom-28 left-6 md:left-12 font-mono text-[10px] uppercase tracking-widest text-cream/60 flex items-center gap-3">
          <span className="block w-10 h-px bg-cream/40" />
          Scroll to enter
        </div>
      </div>

      {/* Marquee at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-cream/10 bg-ink/40 backdrop-blur-sm py-4 z-10">
        <HeroMarquee />
      </div>
    </section>
  );
}
