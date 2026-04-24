"use client";

import { useEffect, useRef, useState } from "react";
import {
  LANGUAGES,
  usePreferences,
  type LanguageCode,
} from "@/lib/preferences";
import { cn } from "@/lib/utils";

export function PreferencesSwitcher() {
  const { theme, setTheme, lang, setLang } = usePreferences();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={wrapRef} className="relative flex items-center gap-3">
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        data-cursor="theme"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="w-8 h-8 rounded-full border border-cream/30 hover:border-mares hover:text-mares transition-colors flex items-center justify-center text-[12px]"
      >
        {theme === "dark" ? "☾" : "☀"}
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor="lang"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="font-mono text-[10px] uppercase tracking-widest border border-cream/30 hover:border-mares hover:text-mares transition-colors rounded-full px-3 h-8 flex items-center gap-1"
      >
        {currentLang.code.toUpperCase()}
        <span className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-10 min-w-[160px] bg-smoke border border-cream/10 rounded-xl p-1 shadow-2xl z-[60]"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code as LanguageCode);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg font-mono text-xs flex items-center justify-between gap-4 transition-colors",
                  l.code === lang
                    ? "bg-mares/10 text-mares"
                    : "text-cream/80 hover:bg-cream/5",
                )}
              >
                <span>{l.label}</span>
                <span className="opacity-50 uppercase tracking-widest text-[10px]">
                  {l.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
