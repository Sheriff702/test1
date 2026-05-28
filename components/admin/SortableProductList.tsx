"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "./SortableList";
import {
  archiveProduct,
  unarchiveProduct,
  saveProductOrder,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

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

type View = "list" | "grid";
const VIEW_KEY = "mares-admin-view";

export function SortableProductList({ initial }: { initial: AdminProductRow[] }) {
  const [items, setItems] = useState<AdminProductRow[]>(initial);
  const [view, setView] = useState<View>("list");
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Hydrate view from localStorage so the user's choice sticks.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_KEY);
      if (stored === "list" || stored === "grid") setView(stored);
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.slug === active.id);
    const newIdx = items.findIndex((i) => i.slug === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    setItems(arrayMove(items, oldIdx, newIdx));
    setDirty(true);
  };

  const onSave = () => {
    const slugs = items.map((i) => i.slug);
    startTransition(async () => {
      await saveProductOrder(slugs);
      setDirty(false);
      setSavedAt(Date.now());
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/60">
          {items.length} pieces — drag to reorder. Featured pieces also lead the homepage.
        </p>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-cream/15 rounded-md overflow-hidden bg-smoke">
            <ViewButton
              active={view === "list"}
              onClick={() => setView("list")}
              label="List"
              icon={<ListIcon />}
            />
            <ViewButton
              active={view === "grid"}
              onClick={() => setView("grid")}
              label="Grid"
              icon={<GridIcon />}
            />
          </div>

          {dirty ? (
            <button
              type="button"
              onClick={onSave}
              disabled={isPending}
              className="bg-mares text-ink font-display tracking-tight text-base px-4 py-2 rounded-md disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save order"}
            </button>
          ) : savedAt ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mares">
              Saved ✓
            </span>
          ) : null}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.slug)}
          strategy={
            view === "grid" ? rectSortingStrategy : verticalListSortingStrategy
          }
        >
          {view === "list" ? (
            <ul className="space-y-2">
              {items.map((p) => (
                <ListRow key={p.slug} p={p} />
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((p) => (
                <GridCard key={p.slug} p={p} />
              ))}
            </ul>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
        active
          ? "bg-mares text-ink"
          : "text-cream/70 hover:text-cream hover:bg-cream/5",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusPill({ p }: { p: AdminProductRow }) {
  if (p.archived) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
        Archived
      </span>
    );
  }
  if (p.featured) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-widest text-mares">
        Featured
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
      Live
    </span>
  );
}

function ToggleArchive({ p }: { p: AdminProductRow }) {
  const [busy, start] = useTransition();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        start(async () => {
          if (p.archived) await unarchiveProduct(p.slug);
          else await archiveProduct(p.slug);
        });
      }}
      disabled={busy}
      className="font-mono text-[10px] uppercase tracking-widest text-cream/60 hover:text-blood transition-colors disabled:opacity-50"
    >
      {busy ? "…" : p.archived ? "Restore" : "Archive"}
    </button>
  );
}

/* ── List row (compact) ───────────────────────────────────────── */

function ListRow({ p }: { p: AdminProductRow }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.slug });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center gap-4 bg-smoke border rounded-lg p-3 transition-colors",
          isDragging
            ? "border-mares shadow-2xl"
            : "border-cream/10 hover:border-mares",
        )}
      >
        <DragHandle handle={{ attributes, listeners, isDragging }} />
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
        <span className="w-20 text-right">
          <StatusPill p={p} />
        </span>
        <span className="w-20 text-right">
          <ToggleArchive p={p} />
        </span>
      </div>
    </li>
  );
}

/* ── Grid card (storefront preview) ──────────────────────────── */

function GridCard({ p }: { p: AdminProductRow }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: p.slug });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div
        className={cn(
          "group relative bg-smoke border rounded-lg overflow-hidden transition-all",
          isDragging
            ? "border-mares shadow-2xl scale-[1.02]"
            : "border-cream/10 hover:border-mares",
          p.archived && "opacity-50",
        )}
      >
        {/* Drag area = the whole image. Cursor: grab. */}
        <div
          {...attributes}
          {...listeners}
          className="relative aspect-[3/4] bg-ink overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          aria-label={`Drag ${p.name} to reorder`}
        >
          {p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt={p.name}
              fill
              sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-widest text-cream/30">
              No image
            </div>
          )}

          {/* Drop tag */}
          {p.drop ? (
            <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-ink/80 px-2 py-1 text-cream z-10">
              {p.drop}
            </span>
          ) : null}

          {/* Drag affordance */}
          <span className="absolute top-3 right-3 font-mono text-base text-cream/80 bg-ink/70 rounded w-7 h-7 grid place-items-center select-none">
            ⋮⋮
          </span>

          {/* Featured corner ribbon */}
          {p.featured && !p.archived ? (
            <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-mares text-ink px-2 py-1 z-10">
              Featured · Homepage
            </span>
          ) : null}

          {p.archived ? (
            <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-cream/20 text-cream px-2 py-1 z-10">
              Archived
            </span>
          ) : null}
        </div>

        {/* Footer matches storefront card */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/admin/products/${p.slug}`}
              className="font-display text-lg leading-none tracking-tight hover:text-mares transition-colors"
            >
              {p.name}
            </Link>
            <p className="font-mono text-sm text-cream shrink-0">
              {p.currency}
              {p.price}
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50 mt-1">
            {p.category}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream/10">
            <StatusPill p={p} />
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/products/${p.slug}`}
                className="font-mono text-[10px] uppercase tracking-widest text-cream/70 hover:text-mares transition-colors"
              >
                Edit
              </Link>
              <ToggleArchive p={p} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ListIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
