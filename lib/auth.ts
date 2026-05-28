import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "mares_admin";
const ONE_WEEK = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET || "dev-only-insecure-mares-secret-change-me";
}

function password() {
  return process.env.ADMIN_PASSWORD || "mares-admin";
}

function sign(payload: string) {
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(token: string | undefined): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return false;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  // payload format: ts:nonce
  const parts = payload.split(":");
  const ts = Number(parts[0]);
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > ONE_WEEK * 1000) return false;
  return true;
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(password());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function startSession() {
  const payload = `${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
  const token = sign(payload);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return verify(token);
}

export const ADMIN_COOKIE = COOKIE;
