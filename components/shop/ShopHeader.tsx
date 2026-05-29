"use client";

import { usePreferences } from "@/lib/preferences";

export function ShopHeader() {
  const { t } = usePreferences();
  return (
    <header className="mb-16">
      <p
        data-text-role="shop.label"
        className="font-mono text-[10px] uppercase tracking-widest text-mares mb-3"
      >
        {t("collection")}
      </p>
      <h1
        data-text-role="shop.title"
        className="font-display text-7xl md:text-9xl tracking-tighter leading-[0.85]"
      >
        {t("shopTitle")}
      </h1>
      <p data-text-role="shop.intro" className="text-cream/60 mt-4 max-w-md">
        {t("shopIntro")}
      </p>
    </header>
  );
}
