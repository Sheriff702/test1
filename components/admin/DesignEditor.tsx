"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { saveDesign } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import {
  COLOR_SLOTS,
  DISPLAY_FONTS,
  FONT_SLOTS,
  MONO_FONTS,
  SANS_FONTS,
  TYPOGRAPHY_ROLES,
  groupRolesBySection,
  type ColorSlot,
  type DesignTokens,
  type FontOption,
  type FontSlot,
  type TypographyRoleId,
} from "@/lib/design-data";

type RoleMap = Partial<Record<TypographyRoleId, string>>;

const ALL_FONTS: FontOption[] = [...DISPLAY_FONTS, ...SANS_FONTS, ...MONO_FONTS]
  .filter((f, i, arr) => arr.findIndex((g) => g.family === f.family) === i)
  .sort((a, b) => a.family.localeCompare(b.family));

const CATALOG: Record<FontSlot, FontOption[]> = {
  display: DISPLAY_FONTS,
  sans: SANS_FONTS,
  mono: MONO_FONTS,
};

const SECTION_GROUPS = groupRolesBySection();

export function DesignEditor({
  initialTokens,
  initialRoles,
}: {
  initialTokens: DesignTokens;
  initialRoles: RoleMap;
}) {
  const [tokens, setTokens] = useState<DesignTokens>(initialTokens);
  const [roles, setRoles] = useState<RoleMap>(initialRoles);
  const [scheme, setScheme] = useState<"dark" | "light">("dark");
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [tab, setTab] = useState<"global" | "roles" | "colors">("global");

  /** Load all currently selected Google Fonts in the editor preview. */
  useEffect(() => {
    const families = new Set<string>([
      ...Object.values(tokens.fonts),
      ...Object.values(roles).filter(Boolean) as string[],
    ]);
    if (families.size === 0) return;
    const url = `https://fonts.googleapis.com/css2?${Array.from(families)
      .map((f) => `family=${f.replace(/\s+/g, "+")}`)
      .join("&")}&display=swap`;
    const id = "design-editor-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = id;
      document.head.appendChild(link);
    }
    link.href = url;
  }, [tokens.fonts, roles]);

  const setFont = (slot: FontSlot, family: string) =>
    setTokens((t) => ({ ...t, fonts: { ...t.fonts, [slot]: family } }));

  const setColor = (s: "dark" | "light", slot: ColorSlot, hex: string) =>
    setTokens((t) => ({
      ...t,
      colors: { ...t.colors, [s]: { ...t.colors[s], [slot]: hex } },
    }));

  const setRole = (roleId: TypographyRoleId, family: string) =>
    setRoles((prev) => {
      const next = { ...prev };
      if (!family) delete next[roleId];
      else next[roleId] = family;
      return next;
    });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    (Object.entries(tokens.fonts) as [FontSlot, string][]).forEach(([slot, family]) => {
      fd.append(`font.${slot}`, family);
    });
    TYPOGRAPHY_ROLES.forEach((role) => {
      const value = roles[role.id] ?? "";
      fd.append(`font.role.${role.id}`, value);
    });
    (["dark", "light"] as const).forEach((s) => {
      (Object.entries(tokens.colors[s]) as [ColorSlot, string][]).forEach(([slot, hex]) => {
        fd.append(`color.${s}.${slot}`, hex);
      });
    });
    startTransition(async () => {
      await saveDesign(fd);
      setSavedAt(Date.now());
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
            / Design
          </p>
          <h1 className="font-display text-5xl tracking-tight">Fonts & colors</h1>
          <p className="text-cream/60 text-sm mt-2 max-w-xl">
            Set a font per text role across the storefront, override the global
            defaults, and tune the dark / light palettes. All overrides save to
            D1 and hit the page on the next paint.
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-mares text-ink font-display tracking-tight text-lg px-8 py-4 rounded-md disabled:opacity-60"
        >
          {isPending ? "Saving…" : savedAt ? "Saved ✓" : "Save design"}
        </button>
      </header>

      <div className="inline-flex border border-cream/15 bg-smoke rounded-md overflow-hidden">
        {[
          { id: "global", label: "Global fonts" },
          { id: "roles", label: "Per-section fonts" },
          { id: "colors", label: "Colors" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
              tab === t.id
                ? "bg-mares text-ink"
                : "text-cream/70 hover:text-cream hover:bg-cream/5",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "global" ? (
        <Section
          title="Global defaults"
          description="These are the three base fonts the storefront falls back to when a role isn't overridden. Tailwind's font-display / font-sans / font-mono classes resolve to these."
        >
          <div className="grid md:grid-cols-3 gap-4">
            {FONT_SLOTS.map((s) => (
              <FontPicker
                key={s.key}
                label={s.label}
                value={tokens.fonts[s.key]}
                options={CATALOG[s.key]}
                onChange={(family) => setFont(s.key, family)}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {tab === "roles" ? (
        <RoleEditor roles={roles} setRole={setRole} globalFonts={tokens.fonts} />
      ) : null}

      {tab === "colors" ? (
        <Section
          title="Colors"
          description="Dark + light palettes."
          right={
            <div className="inline-flex border border-cream/15 bg-smoke rounded-md overflow-hidden">
              {(["dark", "light"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScheme(s)}
                  className={cn(
                    "px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
                    s === scheme
                      ? "bg-mares text-ink"
                      : "text-cream/70 hover:text-cream hover:bg-cream/5",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            {COLOR_SLOTS.map((c) => (
              <ColorRow
                key={c.key}
                label={c.label}
                help={c.help}
                slot={c.key}
                value={tokens.colors[scheme][c.key]}
                onChange={(hex) => setColor(scheme, c.key, hex)}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        title="Live preview"
        description="A peek at a few of the most prominent text roles. The actual storefront uses the same fallbacks."
      >
        <Preview tokens={tokens} roles={roles} scheme={scheme} />
      </Section>
    </form>
  );
}

function Section({
  title,
  description,
  right,
  children,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-cream/10 bg-smoke rounded-lg p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          {description ? (
            <p className="text-cream/60 text-sm mt-1">{description}</p>
          ) : null}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

function RoleEditor({
  roles,
  setRole,
  globalFonts,
}: {
  roles: RoleMap;
  setRole: (id: TypographyRoleId, family: string) => void;
  globalFonts: DesignTokens["fonts"];
}) {
  return (
    <div className="space-y-5">
      {SECTION_GROUPS.map((group) => (
        <Section key={group.section} title={group.section}>
          <div className="grid md:grid-cols-2 gap-4">
            {group.roles.map((role) => {
              const inherited = globalFonts[role.base];
              const current = roles[role.id] ?? "";
              const effective = current || inherited;
              return (
                <div key={role.id} className="border border-cream/10 bg-ink rounded-md p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-none tracking-tight">
                        {role.label}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mt-1">
                        {role.id} · falls back to {role.base}
                      </p>
                    </div>
                  </div>
                  <select
                    value={current}
                    onChange={(e) => setRole(role.id, e.target.value)}
                    className="w-full bg-smoke border border-cream/15 px-3 py-2 rounded-md text-cream text-sm outline-none focus:border-mares"
                  >
                    <option value="">
                      Use global ({inherited})
                    </option>
                    {ALL_FONTS.map((o) => (
                      <option key={o.family} value={o.family}>
                        {o.family}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-2xl leading-tight"
                    style={{ fontFamily: `'${effective}', sans-serif` }}
                  >
                    {role.id === "hero.wordmark" ? "MARES" : "The quick brown fox"}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      ))}
    </div>
  );
}

function FontPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FontOption[];
  onChange: (family: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60 block mb-2">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-ink border border-cream/15 px-3 py-2 rounded-md text-cream text-sm outline-none focus:border-mares"
      >
        {options.map((o) => (
          <option key={o.family} value={o.family}>
            {o.family}
          </option>
        ))}
      </select>
      <p className="mt-3 text-2xl text-cream" style={{ fontFamily: `'${value}', sans-serif` }}>
        {label.startsWith("Display") ? "MARES" : "The quick brown fox jumps."}
      </p>
    </label>
  );
}

function ColorRow({
  label,
  help,
  slot,
  value,
  onChange,
}: {
  label: string;
  help: string;
  slot: ColorSlot;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-cream/5 pb-4">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded-md border border-cream/20 bg-transparent cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg leading-none tracking-tight">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40 mt-1">
          {slot} · {help}
        </p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 bg-ink border border-cream/15 px-2 py-1.5 rounded text-cream font-mono text-xs outline-none focus:border-mares"
        pattern="#?[0-9a-fA-F]{6}"
      />
    </div>
  );
}

function Preview({
  tokens,
  roles,
  scheme,
}: {
  tokens: DesignTokens;
  roles: RoleMap;
  scheme: "dark" | "light";
}) {
  const c = tokens.colors[scheme];
  const fontFor = (id: TypographyRoleId, base: FontSlot) =>
    roles[id] ?? tokens.fonts[base];

  const style = useMemo<React.CSSProperties>(
    () => ({ backgroundColor: c.ink, color: c.cream }),
    [c.ink, c.cream],
  );

  return (
    <div className="rounded-lg overflow-hidden border border-cream/10" style={style}>
      <div className="p-8 space-y-6">
        <p
          className="text-[10px] uppercase tracking-widest"
          style={{ color: c.mares, fontFamily: `'${fontFor("hero.kicker", "mono")}', monospace` }}
        >
          / Hero · {scheme}
        </p>
        <h2
          className="text-6xl leading-none tracking-tight"
          style={{ fontFamily: `'${fontFor("hero.wordmark", "display")}', sans-serif` }}
        >
          MARES.
        </h2>
        <p
          className="text-base max-w-md"
          style={{
            color: c.cream,
            opacity: 0.8,
            fontFamily: `'${fontFor("hero.subline", "sans")}', sans-serif`,
          }}
        >
          Streetwear, engineered.{" "}
          <span style={{ color: c.mares }}>Built for the street,</span> cut for the body,
          tested in the rain.
        </p>
        <div className="flex items-center gap-3">
          <span
            className="px-5 py-2 rounded-full text-sm"
            style={{
              backgroundColor: c.mares,
              color: c.ink,
              fontFamily: `'${fontFor("hero.cta", "display")}', sans-serif`,
            }}
          >
            Shop the drop
          </span>
        </div>
        <div className="pt-4 border-t" style={{ borderColor: `${c.cream}20` }}>
          <p
            className="text-[10px] uppercase tracking-widest mb-2"
            style={{ color: c.mares, fontFamily: `'${fontFor("manifesto.label", "mono")}', monospace` }}
          >
            / Manifesto
          </p>
          <p
            className="text-2xl leading-tight"
            style={{ fontFamily: `'${fontFor("manifesto.body", "display")}', sans-serif` }}
          >
            We build the uniform for people who move on their own frequency.
          </p>
        </div>
      </div>
    </div>
  );
}
