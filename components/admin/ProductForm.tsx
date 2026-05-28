"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/admin/actions";
import { SortableList, DragHandle, type DragHandleProps } from "./SortableList";

type ProductValues = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  category: string;
  drop: string;
  description: string;
  sortOrder: number;
  featured: boolean;
  sizes: string[];
  colors: string[];
  images: string[];
};

const CATEGORIES = ["outerwear", "tops", "bottoms", "footwear", "accessories"] as const;

export function ProductForm({
  initial,
  action,
  submitLabel,
  onDelete,
}: {
  initial: ProductValues;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
}) {
  const [images, setImages] = useState<string[]>(initial.images);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const onUploadClick = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImage(fd);
      if ("error" in result) {
        setUploadError(result.error);
      } else {
        setImages((prev) => [...prev, result.url]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="grid lg:grid-cols-[1fr_360px] gap-8"
    >
      {/* Hidden carriers for the image array (preserves order) */}
      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="space-y-6">
        <Field label="Name" required>
          <input
            name="name"
            defaultValue={initial.name}
            required
            className="input"
            placeholder="Ghost Shell Parka"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Slug" hint="URL-safe, lowercase. Leave blank on create to auto-generate.">
            <input
              name="slug"
              defaultValue={initial.slug}
              pattern="[a-z0-9-]+"
              className="input font-mono text-sm"
              placeholder="ghost-shell-parka"
            />
          </Field>
          <Field label="Subtitle">
            <input
              name="subtitle"
              defaultValue={initial.subtitle}
              className="input"
              placeholder="SS26 / Outerwear"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Price" required>
            <input
              type="number"
              name="price"
              min={0}
              defaultValue={initial.price}
              required
              className="input"
            />
          </Field>
          <Field label="Currency">
            <input
              name="currency"
              defaultValue={initial.currency}
              className="input"
              maxLength={4}
            />
          </Field>
          <Field label="Drop">
            <input
              name="drop"
              defaultValue={initial.drop}
              className="input font-mono"
              placeholder="SS26"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" required>
            <select name="category" defaultValue={initial.category} required className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort order" hint="Lower = appears first.">
            <input
              type="number"
              name="sortOrder"
              defaultValue={initial.sortOrder}
              className="input"
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            name="description"
            defaultValue={initial.description}
            rows={4}
            className="input resize-y"
          />
        </Field>

        <Field label="Sizes" hint="Comma-separated, in display order.">
          <input
            name="sizes"
            defaultValue={initial.sizes.join(", ")}
            className="input font-mono text-sm"
            placeholder="XS, S, M, L, XL"
          />
        </Field>

        <Field label="Colors" hint="Comma-separated.">
          <input
            name="colors"
            defaultValue={initial.colors.join(", ")}
            className="input"
            placeholder="Ink, Bone"
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial.featured}
            className="w-4 h-4 accent-mares"
          />
          <span className="font-mono text-xs uppercase tracking-widest">
            Show in homepage Featured grid
          </span>
        </label>
      </div>

      <aside className="space-y-6">
        <div className="border border-cream/10 bg-smoke rounded-lg p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/60 mb-3">
            Images
          </p>
          <SortableList
            items={images.map((src, i) => ({ id: `${i}-${src}`, src, i }))}
            onChange={(next) => setImages(next.map((n) => n.src))}
            emptyLabel="No images yet."
            renderItem={(it, _index, handle) => (
              <ImageRow src={it.src} handle={handle} onRemove={() => removeImage(it.i)} />
            )}
          />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onUploadClick}
              disabled={uploading}
              className="bg-cream/10 hover:bg-cream/20 text-cream font-mono text-xs uppercase tracking-widest py-2 rounded disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "+ Upload"}
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Image URL");
                if (url) setImages((p) => [...p, url]);
              }}
              className="bg-cream/10 hover:bg-cream/20 text-cream font-mono text-xs uppercase tracking-widest py-2 rounded"
            >
              + URL
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={onFileChange}
            className="hidden"
          />
          {uploadError ? (
            <p className="text-blood font-mono text-[10px] mt-2">{uploadError}</p>
          ) : null}
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-mares text-ink font-display tracking-tight text-lg py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isPending ? "Saving…" : submitLabel}
          </button>

          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm("Delete permanently? This cannot be undone.")) return;
                startTransition(() => onDelete());
              }}
              className="w-full border border-blood/40 text-blood font-mono text-xs uppercase tracking-widest py-2 rounded hover:bg-blood/10"
            >
              Delete forever
            </button>
          ) : null}
        </div>
      </aside>

      <style>{`
        .input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid rgba(244,239,230,0.15);
          padding: 0.7rem 0.85rem;
          border-radius: 6px;
          color: #f4efe6;
          outline: none;
          font: inherit;
        }
        .input:focus { border-color: #c6f24e; }
      `}</style>
    </form>
  );
}

function ImageRow({
  src,
  handle,
  onRemove,
}: {
  src: string;
  handle: DragHandleProps;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-ink border border-cream/15 rounded p-2">
      <DragHandle handle={handle} />
      <div className="relative w-12 h-14 bg-smoke rounded overflow-hidden shrink-0">
        <Image src={src} alt="" fill sizes="48px" className="object-cover" />
      </div>
      <input readOnly value={src} className="input font-mono text-[10px] flex-1" />
      <button
        type="button"
        onClick={onRemove}
        className="font-mono text-[10px] uppercase tracking-widest text-cream/40 hover:text-blood"
      >
        ×
      </button>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/60 block mb-2">
        {label} {required ? <span className="text-mares">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-cream/40 text-xs mt-1 block">{hint}</span> : null}
    </label>
  );
}
