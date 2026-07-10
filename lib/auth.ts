import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "carzo-dev-secret-change-me";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@carzo.in";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "carzo123";

export const SESSION_COOKIE = "carzo_admin";

export function sign(value: string): string {
  const sig = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function verify(token: string | undefined): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i === -1) return false;
  const value = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verify(store.get(SESSION_COOKIE)?.value);
}
