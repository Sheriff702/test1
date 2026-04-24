"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/preferences";

export default function NotFound() {
  const { t } = usePreferences();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-4">
        / 404
      </p>
      <h1 className="font-display text-8xl md:text-10xl tracking-tighter leading-none">
        {t("pageLost")}
      </h1>
      <p className="mt-6 text-cream/60 max-w-md">{t("pageLostBody")}</p>
      <Link
        href="/"
        data-cursor="home"
        className="mt-10 inline-flex items-center gap-3 bg-mares text-ink font-display text-lg px-8 py-4 rounded-full"
      >
        {t("home")}
      </Link>
    </div>
  );
}
