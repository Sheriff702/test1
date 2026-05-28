"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";
import { db, ensureReady } from "@/db";
import { products, siteContent } from "@/db/schema";
import { isAuthed } from "@/lib/auth";
import { LANGUAGES, TRANSLATION_KEYS } from "@/lib/preferences-data";

async function guard() {
  if (!(await isAuthed())) {
    throw new Error("Unauthorized");
  }
  await ensureReady();
}

function csvList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const productSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  name: z.string().min(1).max(120),
  subtitle: z.string().max(120).default(""),
  price: z.coerce.number().int().min(0).max(100000),
  currency: z.string().min(1).max(4).default("€"),
  category: z.enum(["outerwear", "tops", "bottoms", "footwear", "accessories"]),
  drop: z.string().max(40).default(""),
  description: z.string().max(2000).default(""),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export async function createProduct(formData: FormData) {
  await guard();
  const parsed = productSchema.parse({
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    name: formData.get("name"),
    subtitle: formData.get("subtitle") ?? "",
    price: formData.get("price"),
    currency: formData.get("currency") ?? "€",
    category: formData.get("category"),
    drop: formData.get("drop") ?? "",
    description: formData.get("description") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await db
    .insert(products)
    .values({
      ...parsed,
      sizes: csvList(formData.get("sizes")),
      colors: csvList(formData.get("colors")),
      images: csvList(formData.get("images")),
      featured: formData.get("featured") === "on",
      archived: false,
    })
    .run();

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${parsed.slug}`);
}

export async function updateProduct(currentSlug: string, formData: FormData) {
  await guard();
  const parsed = productSchema.parse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    subtitle: formData.get("subtitle") ?? "",
    price: formData.get("price"),
    currency: formData.get("currency") ?? "€",
    category: formData.get("category"),
    drop: formData.get("drop") ?? "",
    description: formData.get("description") ?? "",
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await db
    .update(products)
    .set({
      ...parsed,
      sizes: csvList(formData.get("sizes")),
      colors: csvList(formData.get("colors")),
      images: csvList(formData.get("images")),
      featured: formData.get("featured") === "on",
      updatedAt: Date.now(),
    })
    .where(eq(products.slug, currentSlug))
    .run();

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${parsed.slug}`);
  if (parsed.slug !== currentSlug) revalidatePath(`/shop/${currentSlug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${parsed.slug}`);
}

export async function archiveProduct(slug: string) {
  await guard();
  await db
    .update(products)
    .set({ archived: true, updatedAt: Date.now() })
    .where(eq(products.slug, slug))
    .run();
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function unarchiveProduct(slug: string) {
  await guard();
  await db
    .update(products)
    .set({ archived: false, updatedAt: Date.now() })
    .where(eq(products.slug, slug))
    .run();
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function deleteProduct(slug: string) {
  await guard();
  await db.delete(products).where(eq(products.slug, slug)).run();
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function uploadImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await guard();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file" };
  if (file.size === 0) return { error: "Empty file" };
  if (file.size > 8 * 1024 * 1024) return { error: "Max 8MB" };
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) return { error: "Use JPG/PNG/WebP/AVIF" };

  // Serverless hosts have a read-only filesystem outside /tmp. The local
  // filesystem upload path is for self-hosted / dev only. On Vercel, paste a
  // CDN URL into the image field instead (or wire BLOB_READ_WRITE_TOKEN in
  // future to push to Vercel Blob).
  if (process.env.VERCEL) {
    return {
      error:
        "Uploads disabled on Vercel. Paste an image URL into the field instead, or configure Vercel Blob storage.",
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, safeName), buf);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      return { error: "Filesystem is read-only here. Paste a URL instead." };
    }
    throw err;
  }
  return { url: `/uploads/${safeName}` };
}

/**
 * Save translation overrides. Form fields are encoded as "lang::key" so a
 * single form can edit any number of language/key pairs in one shot. Empty
 * strings delete the override (so the in-code default takes over again).
 */
export async function saveContent(formData: FormData) {
  await guard();
  const validLangs = new Set(LANGUAGES.map((l) => l.code as string));
  const validKeys = new Set<string>(TRANSLATION_KEYS);

  for (const [field, raw] of formData.entries()) {
    if (typeof raw !== "string") continue;
    if (!field.includes("::")) continue;
    const [lang, key] = field.split("::");
    if (!validLangs.has(lang) || !validKeys.has(key)) continue;
    const id = `${lang}::${key}`;
    const value = raw.trim();

    if (value === "") {
      await db.delete(siteContent).where(eq(siteContent.id, id)).run();
      continue;
    }

    await db
      .insert(siteContent)
      .values({ id, lang, key, value })
      .onConflictDoUpdate({
        target: siteContent.id,
        set: { value, updatedAt: Date.now() },
      })
      .run();
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}

export async function saveProductOrder(slugs: string[]) {
  await guard();
  for (let i = 0; i < slugs.length; i++) {
    await db
      .update(products)
      .set({ sortOrder: i, updatedAt: Date.now() })
      .where(eq(products.slug, slugs[i]))
      .run();
  }
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}
