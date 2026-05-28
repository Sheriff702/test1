"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/app/admin/actions";

export type LangOption = { code: string; label: string };

export type FieldRow = {
  key: string;
  label: string;
  /** "text" (single line), "textarea" (multi-line), "image" (URL + upload UI) */
  type?: "text" | "textarea" | "image";
  /** Current saved override for the active language (empty if none). */
  defaultValue: string;
  /** English default shown as placeholder/preview. */
  fallback: string;
};

export type SectionDef = {
  id: string;
  title: string;
  description: string;
  /** Section starts collapsed unless this is true. */
  defaultOpen?: boolean;
  /** Optional anchor on the storefront to scroll to when previewing. */
  previewHref?: string;
  fields: FieldRow[];
};

export function ContentEditor({
  languages,
  activeLang,
  sections,
  action,
}: {
  languages: LangOption[];
  activeLang: string;
  sections: SectionDef[];
  action: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const matchesFilter = (s: SectionDef) => {
    if (!query) return s;
    const q = query.toLowerCase();
    return {
      ...s,
      fields: s.fields.filter(
        (f) =>
          f.key.toLowerCase().includes(q) ||
          f.label.toLowerCase().includes(q) ||
          f.fallback.toLowerCase().includes(q) ||
          f.defaultValue.toLowerCase().includes(q),
      ),
    };
  };
  const filtered = sections.map(matchesFilter).filter((s) => s.fields.length > 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
            / Content
          </p>
          <h1 className="font-display text-5xl tracking-tight">Site copy & imagery</h1>
          <p className="text-cream/60 text-sm mt-2 max-w-xl">
            Everything that shows up on the storefront, organised by where it lives.
            Empty a field to fall back to the in-code default.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter…"
            className="bg-smoke border border-cream/15 px-3 py-2 rounded text-cream text-sm w-48 outline-none focus:border-mares"
          />
          <div className="inline-flex items-center border border-cream/15 bg-smoke rounded-md overflow-hidden">
            {languages.map((l) => (
              <Link
                key={l.code}
                href={`/admin/content?lang=${l.code}`}
                className={cn(
                  "px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
                  l.code === activeLang
                    ? "bg-mares text-ink"
                    : "text-cream/70 hover:text-cream hover:bg-cream/5",
                )}
              >
                {l.code}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <form
        ref={formRef}
        action={(fd) =>
          startTransition(async () => {
            await action(fd);
            setSavedAt(Date.now());
          })
        }
        className="space-y-3"
      >
        {filtered.map((section) => (
          <Section
            key={section.id}
            section={section}
            activeLang={activeLang}
            openByDefault={Boolean(query) || section.defaultOpen}
          />
        ))}

        {filtered.length === 0 ? (
          <p className="text-cream/40 text-sm font-mono uppercase tracking-widest">
            No keys match this filter.
          </p>
        ) : null}

        <div className="sticky bottom-6 z-10 flex justify-end pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="bg-mares text-ink font-display tracking-tight text-lg px-8 py-4 rounded-md shadow-2xl shadow-ink disabled:opacity-60"
          >
            {isPending
              ? "Saving…"
              : savedAt
                ? `Saved · ${activeLang.toUpperCase()} ✓`
                : `Save ${activeLang.toUpperCase()} changes`}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  section,
  activeLang,
  openByDefault,
}: {
  section: SectionDef;
  activeLang: string;
  openByDefault?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(openByDefault));
  const imageCount = section.fields.filter((f) => f.type === "image").length;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group border border-cream/10 bg-smoke rounded-lg overflow-hidden"
    >
      <summary
        className="cursor-pointer flex items-center justify-between gap-4 px-5 py-4 hover:bg-cream/5 select-none list-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "font-mono text-cream/40 transition-transform shrink-0",
              open && "rotate-90",
            )}
          >
            ▸
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl tracking-tight">{section.title}</h2>
            <p className="text-cream/50 text-xs mt-0.5 truncate">{section.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {imageCount > 0 ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mares">
              {imageCount} {imageCount === 1 ? "image" : "images"}
            </span>
          ) : null}
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
            {section.fields.length} field{section.fields.length === 1 ? "" : "s"}
          </span>
          {section.previewHref ? (
            <Link
              href={section.previewHref}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-mares transition-colors"
            >
              View on site ↗
            </Link>
          ) : null}
        </div>
      </summary>

      <div className="px-5 pb-5 pt-1 grid md:grid-cols-2 gap-5">
        {section.fields.map((f) => (
          <Field key={f.key} activeLang={activeLang} field={f} />
        ))}
      </div>
    </details>
  );
}

function Field({ activeLang, field }: { activeLang: string; field: FieldRow }) {
  if (field.type === "image") {
    return <ImageFieldRow activeLang={activeLang} field={field} />;
  }
  const name = `${activeLang}::${field.key}`;
  const baseClass =
    "w-full bg-ink border border-cream/15 px-3 py-2 rounded-md text-cream text-sm outline-none focus:border-mares";

  return (
    <label className="block">
      <FieldLabel field={field} />
      {field.type === "textarea" ? (
        <textarea
          name={name}
          defaultValue={field.defaultValue}
          rows={Math.max(3, Math.ceil(field.fallback.length / 60))}
          placeholder={field.fallback}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          name={name}
          defaultValue={field.defaultValue}
          placeholder={field.fallback}
          className={baseClass}
        />
      )}
      {field.fallback ? (
        <span className="text-cream/30 text-[11px] mt-1 block leading-snug">
          <span className="text-cream/40 font-mono uppercase tracking-widest mr-1">
            Default:
          </span>
          {field.fallback}
        </span>
      ) : null}
    </label>
  );
}

function FieldLabel({ field }: { field: FieldRow }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60 flex items-center justify-between gap-2 mb-2">
      <span>{field.label}</span>
      <span className="text-cream/30">{field.key}</span>
    </span>
  );
}

function ImageFieldRow({ activeLang, field }: { activeLang: string; field: FieldRow }) {
  const name = `${activeLang}::${field.key}`;
  const [value, setValue] = useState(field.defaultValue);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const preview = value || field.fallback;

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImage(fd);
      if ("error" in result) setErr(result.error);
      else setValue(result.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <label className="block md:col-span-2">
      <FieldLabel field={field} />
      <div className="grid sm:grid-cols-[160px_1fr] gap-4">
        <div className="relative aspect-[3/4] bg-ink border border-cream/10 rounded-md overflow-hidden">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-widest text-cream/30">
              No image
            </span>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={field.fallback}
            className="w-full bg-ink border border-cream/15 px-3 py-2 rounded-md text-cream font-mono text-xs outline-none focus:border-mares"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-cream/10 hover:bg-cream/20 text-cream font-mono text-[10px] uppercase tracking-widest px-3 py-2 rounded disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => setValue("")}
                className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-blood px-3 py-2"
              >
                Reset to default
              </button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={onFile}
            className="hidden"
          />
          {err ? <p className="text-blood font-mono text-[10px]">{err}</p> : null}
          {field.fallback ? (
            <p className="text-cream/30 text-[11px] leading-snug">
              <span className="text-cream/40 font-mono uppercase tracking-widest mr-1">
                Default:
              </span>
              <span className="break-all">{field.fallback}</span>
            </p>
          ) : null}
        </div>
      </div>
    </label>
  );
}
