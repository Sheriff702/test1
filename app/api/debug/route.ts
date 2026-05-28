import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, ensureReady, usingD1 } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Surfaces backend status as JSON so production errors stop being a guessing
 * game. Visit /api/debug to see what the server actually sees. No secrets are
 * returned — just which envs are set and whether DB calls succeed.
 */
export async function GET() {
  const env = {
    using_d1: usingD1,
    has_CLOUDFLARE_ACCOUNT_ID: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID),
    has_D1_DATABASE_ID: Boolean(process.env.D1_DATABASE_ID),
    has_CLOUDFLARE_D1_API_TOKEN: Boolean(process.env.CLOUDFLARE_D1_API_TOKEN),
    has_R2_BUCKET: Boolean(process.env.R2_BUCKET),
    has_R2_PUBLIC_URL: Boolean(process.env.R2_PUBLIC_URL),
    has_ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
    has_SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
    is_vercel: Boolean(process.env.VERCEL),
  };

  const steps: Record<string, unknown> = {};

  try {
    steps.ensureReady = "starting";
    await ensureReady();
    steps.ensureReady = "ok";
  } catch (err) {
    steps.ensureReady = { error: (err as Error).message };
    return NextResponse.json({ env, steps }, { status: 500 });
  }

  try {
    const count = await db
      .select({ c: sql<number>`count(*)` })
      .from(products)
      .all();
    steps.count = count[0]?.c ?? null;
  } catch (err) {
    steps.count = { error: (err as Error).message };
    return NextResponse.json({ env, steps }, { status: 500 });
  }

  try {
    const sample = await db.select().from(products).limit(1).all();
    steps.sample = sample[0] ?? null;
  } catch (err) {
    steps.sample = { error: (err as Error).message };
    return NextResponse.json({ env, steps }, { status: 500 });
  }

  return NextResponse.json({ env, steps });
}
