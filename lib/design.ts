import "server-only";
import { eq } from "drizzle-orm";
import { db, ensureReady } from "@/db";
import { siteContent } from "@/db/schema";
import {
  DEFAULTS,
  DESIGN_LANG,
  DISPLAY_FONTS,
  MONO_FONTS,
  SANS_FONTS,
  TYPOGRAPHY_ROLES,
  hexToRgbTriplet,
  type ColorSlot,
  type DesignTokens,
  type FontOption,
  type FontSlot,
  type TypographyRoleId,
} from "./design-data";

const ALL_FONTS: Record<FontSlot, FontOption[]> = {
  display: DISPLAY_FONTS,
  sans: SANS_FONTS,
  mono: MONO_FONTS,
};

export type DesignBundle = {
  tokens: DesignTokens;
  /** font family per role id (only roles the admin overrode). */
  roles: Partial<Record<TypographyRoleId, string>>;
};

export async function getDesignBundle(): Promise<DesignBundle> {
  await ensureReady();
  const rows = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.lang, DESIGN_LANG))
    .all();

  const out: DesignBundle = {
    tokens: {
      fonts: { ...DEFAULTS.fonts },
      colors: {
        dark: { ...DEFAULTS.colors.dark },
        light: { ...DEFAULTS.colors.light },
      },
    },
    roles: {},
  };

  const roleIds = new Set<string>(TYPOGRAPHY_ROLES.map((r) => r.id));

  for (const r of rows) {
    const parts = r.key.split(".");
    if (parts[0] === "font" && parts[1] && parts[1] in out.tokens.fonts && parts.length === 2) {
      const slot = parts[1] as FontSlot;
      out.tokens.fonts[slot] = r.value || out.tokens.fonts[slot];
    } else if (parts[0] === "font" && parts[1] === "role" && parts.length >= 3) {
      const roleId = parts.slice(2).join(".");
      if (roleIds.has(roleId) && r.value) {
        out.roles[roleId as TypographyRoleId] = r.value;
      }
    } else if (
      parts[0] === "color" &&
      (parts[1] === "dark" || parts[1] === "light") &&
      parts[2]
    ) {
      const scheme = parts[1] as "dark" | "light";
      const slot = parts[2] as ColorSlot;
      if (slot in out.tokens.colors[scheme]) {
        out.tokens.colors[scheme][slot] = r.value || out.tokens.colors[scheme][slot];
      }
    }
  }
  return out;
}

/** Build a Google Fonts CSS link URL for every unique active font face. */
export function buildGoogleFontsHref(bundle: DesignBundle): string | null {
  const allFontsFlat: FontOption[] = [
    ...DISPLAY_FONTS,
    ...SANS_FONTS,
    ...MONO_FONTS,
  ];
  const families = new Set<string>();
  // Global slots
  (Object.values(bundle.tokens.fonts) as string[]).forEach((family) => {
    const opt = allFontsFlat.find((f) => f.family === family);
    if (opt) families.add(opt.slug);
  });
  // Role overrides
  Object.values(bundle.roles).forEach((family) => {
    const opt = allFontsFlat.find((f) => f.family === family);
    if (opt) families.add(opt.slug);
  });
  if (families.size === 0) return null;
  return `https://fonts.googleapis.com/css2?${Array.from(families)
    .map((f) => `family=${f}`)
    .join("&")}&display=swap`;
}

/**
 * Build a <style> block that overrides --color-* / --font-* CSS variables AND
 * emits `[data-text-role="..."]` rules for any role the admin overrode.
 */
export function buildDesignStyle(bundle: DesignBundle): string {
  const { tokens, roles } = bundle;
  const escape = (family: string) => family.replace(/'/g, "\\'");

  const fontDecls = (Object.entries(tokens.fonts) as [FontSlot, string][])
    .map(
      ([slot, family]) =>
        `--font-${slot}: '${escape(family)}', ${slot === "mono" ? "monospace" : "sans-serif"};`,
    )
    .join(" ");

  const triplet = (hex: string) => hexToRgbTriplet(hex);

  const dark = Object.entries(tokens.colors.dark)
    .map(([slot, hex]) => `--color-${slot}: ${triplet(hex)};`)
    .join(" ");
  const light = Object.entries(tokens.colors.light)
    .map(([slot, hex]) => `--color-${slot}: ${triplet(hex)};`)
    .join(" ");

  const roleRules = Object.entries(roles)
    .map(([id, family]) => {
      const stack = id.startsWith("nav.cart") || id.endsWith(".label") || id.endsWith(".meta") || id.includes(".cardMeta") || id.includes(".counter") || id.includes(".price")
        ? "monospace"
        : "sans-serif";
      return `[data-text-role="${id}"] { font-family: '${escape(family!)}', ${stack}; }`;
    })
    .join("\n");

  return `
:root { ${dark} ${fontDecls} }
html[data-theme="light"] { ${light} }
${roleRules}
`.trim();
}
