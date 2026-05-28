"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { z } from "zod";
import { db, ensureReady } from "@/db";
import { products } from "@/db/schema";
import { isAuthed } from "@/lib/auth";

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
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, safeName), buf);
  return { url: `/uploads/${safeName}` };
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
