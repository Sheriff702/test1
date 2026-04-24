"use client";

import { usePreferences } from "@/lib/preferences";

export function ShopHeader() {
  const { t } = usePreferences();
  return (
    <header className="mb-16">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-3">
        {t("collection")}
      </p>
      <h1 className="font-display text-7xl md:text-9xl tracking-tighter leading-[0.85]">
        {t("shopTitle")}
      </h1>
      <p className="text-cream/60 mt-4 max-w-md">{t("shopIntro")}</p>
    </header>
  );
}
