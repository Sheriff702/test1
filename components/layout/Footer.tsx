"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePreferences } from "@/lib/preferences";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { t } = usePreferences();

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
            {t("footerShopLabel")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("catAll")}
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("catOuterwear")}
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("catTops")}
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("catFootwear")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            {t("footerStudio")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/lookbook"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("lookbook")}
              </Link>
            </li>
            <li>
              <a
                href="#"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("footerStockists")}
              </a>
            </li>
            <li>
              <a
                href="#"
                data-cursor="view"
                className="hover:text-mares transition-colors"
              >
                {t("footerPress")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            {t("footerContact")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:hello@mares.studio"
                data-cursor="mail"
                className="hover:text-mares transition-colors"
              >
                hello@mares.studio
              </a>
            </li>
            <li className="text-cream/60">Stockholm</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mb-4">
            {t("footerSubscribe")}
          </p>
          <form className="flex gap-0 border-b border-cream/30 focus-within:border-mares transition-colors">
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="bg-transparent py-2 flex-1 text-sm outline-none placeholder:text-cream/40"
            />
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-widest text-mares"
            >
              →
            </button>
          </form>
          <p className="text-[10px] text-cream/40 mt-2 font-mono">
            {t("dropAlerts")}
          </p>
        </div>
      </div>

      <div className="footer-wordmark whitespace-nowrap font-display text-10xl leading-[0.85] text-mares select-none pointer-events-none tracking-tighter px-6 will-change-transform">
        MARES — MARES—MARES—MARES
      </div>

      <div className="container mx-auto px-6 mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        <span>
          © {new Date().getFullYear()} {t("copyright")}
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
