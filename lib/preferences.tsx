"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  LANGUAGES,
  TRANSLATIONS,
  TRANSLATION_KEYS,
  type ContentOverrides,
  type LanguageCode,
  type Theme,
  type TranslationKey,
} from "./preferences-data";

// Re-export for backwards compatibility — every existing client component
// imports these from "@/lib/preferences".
export {
  LANGUAGES,
  TRANSLATIONS,
  TRANSLATION_KEYS,
  type ContentOverrides,
  type LanguageCode,
  type Theme,
  type TranslationKey,
};

type PrefsCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const Ctx = createContext<PrefsCtx | null>(null);

export function PreferencesProvider({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: ContentOverrides;
}) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("mares-theme") as Theme) ?? "dark";
    const savedLang =
      (localStorage.getItem("mares-lang") as LanguageCode) ?? "en";
    setThemeState(savedTheme);
    setLangState(savedLang);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("lang", savedLang);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("mares-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const setLang = (l: LanguageCode) => {
    setLangState(l);
    localStorage.setItem("mares-lang", l);
    document.documentElement.setAttribute("lang", l);
  };

  const t = (key: TranslationKey) => {
    const override = overrides?.[lang]?.[key];
    if (override !== undefined && override !== "") return override;
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key];
  };

  return (
    <Ctx.Provider value={{ theme, setTheme, lang, setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
