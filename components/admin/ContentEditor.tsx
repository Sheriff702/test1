"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LangOption = { code: string; label: string };

export type FieldRow = {
  key: string;
  label: string;
  multiline?: boolean;
  /** Current saved override for the active language (empty if none). */
  defaultValue: string;
  /** English default shown as placeholder/preview. */
  fallback: string;
};

export type SectionDef = {
  id: string;
  title: string;
  description: string;
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

  const filtered = sections
    .map((s) => ({
      ...s,
      fields: s.fields.filter((f) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          f.key.toLowerCase().includes(q) ||
          f.label.toLowerCase().includes(q) ||
          f.fallback.toLowerCase().includes(q) ||
          f.defaultValue.toLowerCase().includes(q)
        );
      }),
    }))
    .filter((s) => s.fields.length > 0);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
            / Content
          </p>
          <h1 className="font-display text-5xl tracking-tight">Site copy</h1>
          <p className="text-cream/60 text-sm mt-2 max-w-xl">
            Override any line of text per language. Leave a field blank to fall
            back to the in-code default. Saved values hit the storefront
            immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter keys, labels, text…"
            className="bg-smoke border border-cream/15 px-3 py-2 rounded text-cream text-sm w-56 outline-none focus:border-mares"
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
        className="space-y-10"
      >
        {filtered.map((section) => (
          <section
            key={section.id}
            className="border border-cream/10 bg-smoke rounded-lg p-6"
          >
            <header className="mb-6">
              <h2 className="font-display text-2xl tracking-tight">{section.title}</h2>
              <p className="text-cream/60 text-sm mt-1">{section.description}</p>
            </header>

            <div className="grid md:grid-cols-2 gap-5">
              {section.fields.map((f) => (
                <Field key={f.key} activeLang={activeLang} field={f} />
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 ? (
          <p className="text-cream/40 text-sm font-mono uppercase tracking-widest">
            No keys match this filter.
          </p>
        ) : null}

        <div className="sticky bottom-6 z-10 flex justify-end">
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

function Field({ activeLang, field }: { activeLang: string; field: FieldRow }) {
  const name = `${activeLang}::${field.key}`;
  const baseClass =
    "w-full bg-ink border border-cream/15 px-3 py-2 rounded-md text-cream text-sm outline-none focus:border-mares";

  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60 flex items-center justify-between gap-2 mb-2">
        <span>{field.label}</span>
        <span className="text-cream/30">{field.key}</span>
      </span>
      {field.multiline ? (
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
