/**
 * Design tokens — fonts and colors that the storefront uses. Stored in
 * site_content under a synthetic lang "_design" so the existing
 * site_content table backs both translations and design overrides.
 *
 * No "use server" / "use client" directive so both server and client
 * components can import the curated font lists and color slots.
 */

export type FontOption = {
  /** CSS family name as used by Google Fonts. */
  family: string;
  /** Google Fonts URL fragment (e.g. "Archivo+Black"). */
  slug: string;
  /** Optional weights to request from Google. */
  weights?: string[];
};

/** Display fonts (big, condensed, character) — used for hero, headlines. */
export const DISPLAY_FONTS: FontOption[] = [
  { family: "Archivo Black", slug: "Archivo+Black" },
  { family: "Bebas Neue", slug: "Bebas+Neue" },
  { family: "Anton", slug: "Anton" },
  { family: "Black Ops One", slug: "Black+Ops+One" },
  { family: "Big Shoulders Display", slug: "Big+Shoulders+Display:wght@700;900", weights: ["700", "900"] },
  { family: "Krona One", slug: "Krona+One" },
  { family: "Russo One", slug: "Russo+One" },
  { family: "Unbounded", slug: "Unbounded:wght@700;900", weights: ["700", "900"] },
  { family: "Antonio", slug: "Antonio:wght@600;700", weights: ["600", "700"] },
  { family: "Oswald", slug: "Oswald:wght@500;700", weights: ["500", "700"] },
];

/** Sans body fonts — used for descriptive copy, paragraphs. */
export const SANS_FONTS: FontOption[] = [
  { family: "Space Grotesk", slug: "Space+Grotesk:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Inter", slug: "Inter:wght@400;500;600", weights: ["400", "500", "600"] },
  { family: "Manrope", slug: "Manrope:wght@400;500;600", weights: ["400", "500", "600"] },
  { family: "DM Sans", slug: "DM+Sans:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Plus Jakarta Sans", slug: "Plus+Jakarta+Sans:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Outfit", slug: "Outfit:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Sora", slug: "Sora:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Work Sans", slug: "Work+Sans:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Geist", slug: "Geist:wght@400;500;700", weights: ["400", "500", "700"] },
];

/** Monospaced fonts — used for labels, captions, eyebrows. */
export const MONO_FONTS: FontOption[] = [
  { family: "JetBrains Mono", slug: "JetBrains+Mono:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "Space Mono", slug: "Space+Mono:wght@400;700", weights: ["400", "700"] },
  { family: "Fira Code", slug: "Fira+Code:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "IBM Plex Mono", slug: "IBM+Plex+Mono:wght@400;500;700", weights: ["400", "500", "700"] },
  { family: "DM Mono", slug: "DM+Mono:wght@400;500", weights: ["400", "500"] },
  { family: "Geist Mono", slug: "Geist+Mono:wght@400;500;700", weights: ["400", "500", "700"] },
];

export const FONT_SLOTS = [
  { key: "display", label: "Display (hero, headlines)", options: DISPLAY_FONTS },
  { key: "sans", label: "Body (paragraphs, links)", options: SANS_FONTS },
  { key: "mono", label: "Mono (labels, eyebrows)", options: MONO_FONTS },
] as const;

export type FontSlot = (typeof FONT_SLOTS)[number]["key"];

/** Slots in the dark + light palettes. Both schemes use the same slot names. */
export const COLOR_SLOTS = [
  { key: "ink", label: "Background", help: "Page background." },
  { key: "cream", label: "Foreground / text", help: "Default text color." },
  { key: "mares", label: "Accent", help: "Buttons, highlights, links." },
  { key: "blood", label: "Alert / danger", help: "Errors, archive, destructive actions." },
  { key: "smoke", label: "Surface", help: "Cards, drawers, footers." },
  { key: "ash", label: "Surface 2", help: "Hovered surfaces, borders." },
  { key: "bone", label: "Muted text", help: "Secondary text, hints." },
] as const;

export type ColorSlot = (typeof COLOR_SLOTS)[number]["key"];

/** In-code defaults — used when no override is saved. Keep in sync with globals.css. */
export const DEFAULTS = {
  fonts: {
    display: "Archivo Black",
    sans: "Space Grotesk",
    mono: "JetBrains Mono",
  } as Record<FontSlot, string>,
  colors: {
    dark: {
      ink: "#0a0a0a",
      cream: "#f4efe6",
      mares: "#c6f24e",
      blood: "#ff3b2e",
      smoke: "#1a1a1a",
      ash: "#2a2a2a",
      bone: "#e8e2d4",
    },
    light: {
      ink: "#f4efe6",
      cream: "#0f0f0f",
      mares: "#448200",
      blood: "#cc1e14",
      smoke: "#e4ded2",
      ash: "#d2ccbe",
      bone: "#1a1a1a",
    },
  } as const,
} as const;

export type DesignTokens = {
  fonts: Record<FontSlot, string>;
  colors: {
    dark: Record<ColorSlot, string>;
    light: Record<ColorSlot, string>;
  };
};

/**
 * Per-section typography roles. Every storefront text element is tagged with
 * `data-text-role="<id>"`; admin can override the font on each one
 * independently. If no override is saved, the element falls back to the
 * Tailwind class on the element (font-display / font-sans / font-mono), which
 * itself resolves to the global font slot above.
 */
export const TYPOGRAPHY_ROLES = [
  { id: "nav.brand", section: "Nav", label: "MARES wordmark", base: "display" },
  { id: "nav.link", section: "Nav", label: "Menu links", base: "mono" },
  { id: "nav.cart", section: "Nav", label: "Cart button", base: "mono" },

  { id: "hero.kicker", section: "Hero", label: "Kicker (small line above wordmark)", base: "mono" },
  { id: "hero.wordmark", section: "Hero", label: "Wordmark (giant text)", base: "display" },
  { id: "hero.subline", section: "Hero", label: "Subline (under wordmark)", base: "sans" },
  { id: "hero.cta", section: "Hero", label: "CTA button", base: "display" },
  { id: "hero.meta", section: "Hero", label: "Status & coordinates", base: "mono" },

  { id: "manifesto.label", section: "Manifesto", label: "Section label", base: "mono" },
  { id: "manifesto.body", section: "Manifesto", label: "Body text", base: "display" },

  { id: "featured.label", section: "Featured grid", label: "Section label", base: "mono" },
  { id: "featured.title", section: "Featured grid", label: "Section title", base: "display" },
  { id: "featured.cardName", section: "Featured grid", label: "Product card name", base: "display" },
  { id: "featured.cardMeta", section: "Featured grid", label: "Product card meta", base: "mono" },

  { id: "drops.label", section: "Drops countdown", label: "Section label", base: "mono" },
  { id: "drops.title", section: "Drops countdown", label: "Title", base: "display" },
  { id: "drops.body", section: "Drops countdown", label: "Body", base: "sans" },
  { id: "drops.counter", section: "Drops countdown", label: "Countdown digits", base: "display" },

  { id: "lookbook.label", section: "Lookbook (home)", label: "Section label", base: "mono" },
  { id: "lookbook.title", section: "Lookbook (home)", label: "Chapter titles", base: "display" },
  { id: "lookbook.body", section: "Lookbook (home)", label: "Chapter body", base: "sans" },

  { id: "story.label", section: "Lookbook page", label: "Section label", base: "mono" },
  { id: "story.title", section: "Lookbook page", label: "Title", base: "display" },
  { id: "story.chapterTitle", section: "Lookbook page", label: "Chapter heading", base: "display" },
  { id: "story.chapterBody", section: "Lookbook page", label: "Chapter body", base: "sans" },

  { id: "about.label", section: "About", label: "Section label", base: "mono" },
  { id: "about.title", section: "About", label: "Page title", base: "display" },
  { id: "about.paragraph", section: "About", label: "Paragraphs", base: "sans" },
  { id: "about.valueTitle", section: "About", label: "Value titles", base: "display" },
  { id: "about.valueBody", section: "About", label: "Value bodies", base: "sans" },

  { id: "shop.label", section: "Shop", label: "Section label", base: "mono" },
  { id: "shop.title", section: "Shop", label: "Page title", base: "display" },
  { id: "shop.intro", section: "Shop", label: "Intro line", base: "sans" },
  { id: "shop.category", section: "Shop", label: "Category pills", base: "mono" },

  { id: "product.name", section: "Product detail", label: "Product name", base: "display" },
  { id: "product.price", section: "Product detail", label: "Price", base: "mono" },
  { id: "product.desc", section: "Product detail", label: "Description", base: "sans" },
  { id: "product.cta", section: "Product detail", label: "Add to cart", base: "display" },

  { id: "cart.heading", section: "Cart", label: "Drawer heading", base: "display" },
  { id: "cart.line", section: "Cart", label: "Line items", base: "sans" },

  { id: "footer.wordmark", section: "Footer", label: "Giant footer wordmark", base: "display" },
  { id: "footer.label", section: "Footer", label: "Column labels", base: "mono" },
  { id: "footer.link", section: "Footer", label: "Links", base: "sans" },

  { id: "marquee", section: "Marquee", label: "Ticker tokens", base: "display" },
] as const;

export type TypographyRoleId = (typeof TYPOGRAPHY_ROLES)[number]["id"];

/** Group roles by section for the editor UI. */
export function groupRolesBySection() {
  const map = new Map<string, typeof TYPOGRAPHY_ROLES[number][]>();
  for (const role of TYPOGRAPHY_ROLES) {
    const arr = map.get(role.section) ?? [];
    arr.push(role);
    map.set(role.section, arr);
  }
  return Array.from(map, ([section, roles]) => ({ section, roles }));
}

/** The synthetic "language" key used to store design tokens in site_content. */
export const DESIGN_LANG = "_design";

/** Translate a hex color (#aabbcc) into "r g b" for use with Tailwind's rgb(var(--x) / <alpha>) syntax. */
export function hexToRgbTriplet(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "0 0 0";
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 0xff} ${(n >> 8) & 0xff} ${n & 0xff}`;
}
