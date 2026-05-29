"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = usePreferences();
  const TEXT = t("manifestoText");

  useEffect(() => {
    if (!ref.current) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const section = ref.current!;
      const target = section.querySelector(".manifesto-text") as HTMLElement;
      const eyebrow = section.querySelectorAll(".manifesto-eyebrow");
      const signature = section.querySelector(".manifesto-signature");
      const underline = section.querySelector(".manifesto-underline");
      const stamp = section.querySelector(".manifesto-stamp") as HTMLElement;
      const progress = section.querySelector(".manifesto-progress") as HTMLElement;
      const backdrop = section.querySelector(".manifesto-backdrop") as HTMLElement;
      const glow = section.querySelector(".manifesto-glow") as HTMLElement;

      split = new SplitText(target, { type: "words,chars" });

      // Accent long words across languages: alternate mares / blood
      let accent = 0;
      split.words.forEach((word) => {
        const el = word as HTMLElement;
        const len = (el.textContent ?? "").replace(/[^\p{L}]/gu, "").length;
        if (len >= 7) {
          el.classList.add(accent % 2 === 0 ? "word-mares" : "word-blood");
          accent += 1;
        }
      });

      gsap.set(split.chars, { yPercent: 110, opacity: 0, rotateX: -40 });
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(signature, { opacity: 0, y: 20 });
      gsap.set(underline, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(stamp, { opacity: 0, scale: 0.6, rotate: -25 });

      // Intro timeline — fires when the section enters
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
        .to(eyebrow, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 }, 0)
        .to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.3,
            stagger: { each: 0.012, from: "start" },
          },
          0.15,
        )
        .to(signature, { opacity: 1, y: 0, duration: 0.9 }, 0.9)
        .to(underline, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 1.0)
        .to(
          stamp,
          { opacity: 1, scale: 1, rotate: -12, duration: 1, ease: "back.out(2)" },
          1.1,
        );

      // Scroll-linked progress rail + backdrop parallax
      gsap.to(progress, {
        scaleY: 1,
        transformOrigin: "0% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      gsap.fromTo(
        backdrop,
        { yPercent: -8, xPercent: -3 },
        {
          yPercent: 8,
          xPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Floating glow
      gsap.to(glow, {
        x: 40,
        y: -30,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, ref);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [lang]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink py-40 md:py-56 px-6 md:px-12"
    >
      {/* Ambient gradient glow */}
      <div
        className="manifesto-glow pointer-events-none absolute -left-32 top-1/3 h-[38rem] w-[38rem] rounded-full opacity-40 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--color-mares) / 0.45) 0%, transparent 70%)",
        }}
      />

      {/* Gigantic backdrop wordmark */}
      <div
        aria-hidden
        className="manifesto-backdrop pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="text-stroke font-display text-[26vw] leading-none tracking-tighter text-cream/10 whitespace-nowrap select-none">
          MANIFESTO
        </span>
      </div>

      {/* Vertical ticker on the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-4 md:right-8 top-0 bottom-0 hidden md:flex items-center"
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/30"
          style={{ writingMode: "vertical-rl" }}
        >
          CH.II · EST 2026 · NO TREND CYCLE · CH.II · EST 2026
        </span>
      </div>

      {/* Scroll progress rail */}
      <div className="pointer-events-none absolute left-6 md:left-12 top-32 bottom-32 hidden md:block w-px bg-cream/10">
        <div className="manifesto-progress absolute inset-0 origin-top scale-y-0 bg-mares" />
      </div>

      <div className="container relative mx-auto grid md:grid-cols-12 gap-10">
        {/* Sidebar meta */}
        <aside className="md:col-span-3 flex flex-col gap-6 md:sticky md:top-32 self-start">
          <p
            data-text-role="manifesto.label"
            className="manifesto-eyebrow font-mono text-[10px] uppercase tracking-[0.4em] text-mares flex items-center gap-2"
          >
            <span className="inline-block w-1.5 h-1.5 bg-mares rounded-full animate-pulse" />
            {t("manifesto")}
          </p>
          <div className="manifesto-eyebrow flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-cream/50">
            <span>Chapter · 02 / 12</span>
            <span>Filed · 04.2026</span>
            <span>N59°19′ / E18°04′</span>
          </div>
          <div
            className="manifesto-eyebrow relative hidden md:block mt-4 h-[1px] w-16 overflow-hidden bg-cream/20"
          >
            <span className="absolute inset-y-0 left-0 w-1/2 bg-cream animate-[marquee_3s_linear_infinite]" />
          </div>
        </aside>

        {/* Main text */}
        <div className="md:col-span-9 relative">
          {/* Giant quote glyph */}
          <span
            aria-hidden
            className="manifesto-stamp absolute -top-10 -left-4 md:-top-20 md:-left-12 font-display text-[14rem] md:text-[22rem] leading-none text-mares/15 select-none"
          >
            ¶
          </span>

          <p
            data-text-role="manifesto.body"
            className="manifesto-text relative font-display text-4xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-cream"
          >
            {TEXT}
          </p>

          {/* Signature */}
          <div className="manifesto-signature relative mt-16 flex items-center gap-6">
            <span className="manifesto-underline block h-px w-24 md:w-40 bg-mares" />
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-cream/70">
              — MARES / {t("manifesto").replace("/ ", "")}
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-cream/40 hidden md:inline">
              §002
            </span>
          </div>
        </div>
      </div>

      {/* Bottom marquee accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden border-t border-cream/5 py-3"
      >
        <div className="flex whitespace-nowrap animate-marquee-slow font-mono text-[10px] uppercase tracking-[0.5em] text-cream/20">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              No trend cycle
              <span className="inline-block w-1 h-1 rounded-full bg-mares" />
              Silent logos
              <span className="inline-block w-1 h-1 rounded-full bg-blood" />
              Heavyweight fabric
              <span className="inline-block w-1 h-1 rounded-full bg-cream/40" />
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        :global(.manifesto-text .word-mares) {
          color: rgb(var(--color-mares));
        }
        :global(.manifesto-text .word-blood) {
          color: rgb(var(--color-blood));
          font-style: italic;
        }
        :global(.manifesto-text .word-mares),
        :global(.manifesto-text .word-blood) {
          transition: letter-spacing 0.5s ease, transform 0.5s ease;
        }
        :global(.manifesto-text .word-mares:hover),
        :global(.manifesto-text .word-blood:hover) {
          letter-spacing: 0.02em;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
