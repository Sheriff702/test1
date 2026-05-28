"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { SortableList, DragHandle, type DragHandleProps } from "./SortableList";
import {
  archiveProduct,
  unarchiveProduct,
  saveProductOrder,
} from "@/app/admin/actions";

export type AdminProductRow = {
  slug: string;
  name: string;
  category: string;
  drop: string;
  currency: string;
  price: number;
  featured: boolean;
  archived: boolean;
  imageUrl: string | null;
};

type SortableRow = AdminProductRow & { id: string };

export function SortableProductList({ initial }: { initial: AdminProductRow[] }) {
  const [items, setItems] = useState<SortableRow[]>(
    initial.map((p) => ({ ...p, id: p.slug })),
  );
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const onSave = () => {
    const slugs = items.map((i) => i.slug);
    startTransition(async () => {
      await saveProductOrder(slugs);
      setDirty(false);
      setSavedAt(Date.now());
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-cream/60 font-mono text-[10px] uppercase tracking-widest">
        <span>{items.length} pieces — drag the handle to reorder</span>
        {dirty ? (
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="bg-mares text-ink font-display tracking-tight text-base px-4 py-2 rounded-md disabled:opacity-60 normal-case"
          >
            {isPending ? "Saving…" : "Save order"}
          </button>
        ) : savedAt ? (
          <span className="text-mares">Saved ✓</span>
        ) : null}
      </div>

      <SortableList
        items={items}
        onChange={(next) => {
          setItems(next);
          setDirty(true);
        }}
        renderItem={(p, _i, handle) => <Row p={p} handle={handle} />}
      />
    </div>
  );
}

function Row({ p, handle }: { p: AdminProductRow; handle: DragHandleProps }) {
  const [busy, start] = useTransition();
  const toggle = () => {
    start(async () => {
      if (p.archived) await unarchiveProduct(p.slug);
      else await archiveProduct(p.slug);
    });
  };
  return (
    <div className="flex items-center gap-4 bg-smoke border border-cream/10 hover:border-mares rounded-lg p-3">
      <DragHandle handle={handle} />
      <div className="relative w-12 h-14 bg-ink rounded overflow-hidden shrink-0">
        {p.imageUrl ? (
          <Image src={p.imageUrl} alt="" fill sizes="48px" className="object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/admin/products/${p.slug}`}
          className="font-display text-lg leading-none hover:text-mares transition-colors"
        >
          {p.name}
        </Link>
        <p className="font-mono text-[10px] text-cream/40 mt-1">
          {p.slug} · {p.category} · {p.drop || "—"}
        </p>
      </div>
      <p className="font-mono text-sm shrink-0">
        {p.currency}
        {p.price}
      </p>
      <span className="font-mono text-[10px] uppercase tracking-widest w-24 text-right">
        {p.archived ? (
          <span className="text-cream/40">Archived</span>
        ) : p.featured ? (
          <span className="text-mares">Featured</span>
        ) : (
          <span className="text-cream/70">Live</span>
        )}
      </span>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-blood transition-colors w-20 text-right"
      >
        {busy ? "…" : p.archived ? "Restore" : "Archive"}
      </button>
    </div>
  );
}
