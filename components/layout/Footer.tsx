"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const word = ref.current!.querySelector(".footer-wordmark");
      gsap.to(word, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-cream/5 mt-32 pt-20 pb-8"
    >
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            Shop
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                All
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Outerwear
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Tops
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Footwear
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            Studio
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/lookbook"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Lookbook
              </Link>
            </li>
            <li>
              <a
                href="#"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Stockists
              </a>
            </li>
            <li>
              <a
                href="#"
                data-cursor="view"
                className="hover:text-MARES transition-colors"
              >
                Press
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            Contact
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:hello@MARES.studio"
                data-cursor="mail"
                className="hover:text-MARES transition-colors"
              >
                hello@MARES.studio
              </a>
            </li>
            <li className="text-cream/60">Stockholm / Berlin</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            Subscribe
          </p>
          <form className="flex gap-0 border-b border-cream/30 focus-within:border-MARES transition-colors">
            <input
              type="email"
              placeholder="your@email"
              className="bg-transparent py-2 flex-1 text-sm outline-none placeholder:text-cream/40"
            />
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-widest text-MARES"
            >
              →
            </button>
          </form>
          <p className="text-[10px] text-cream/40 mt-2 font-mono">
            Drop alerts, no noise.
          </p>
        </div>
      </div>

      <div className="footer-wordmark whitespace-nowrap font-display text-11xl leading-[0.85] text-MARES select-none pointer-events-none tracking-tighter px-6 will-change-transform">
        MARES—MARES—MARES—MARES
      </div>

      <div className="container mx-auto px-6 mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        <span>
          © {new Date().getFullYear()} MARES Studio. Built for the street.
        </span>
        <span className="flex gap-6">
          <a
            href="#"
            data-cursor="view"
            className="hover:text-cream transition-colors"
          >
            Instagram
          </a>
          <a
            href="#"
            data-cursor="view"
            className="hover:text-cream transition-colors"
          >
            TikTok
          </a>
          <a
            href="#"
            data-cursor="view"
            className="hover:text-cream transition-colors"
          >
            Spotify
          </a>
        </span>
      </div>
    </footer>
  );
}
