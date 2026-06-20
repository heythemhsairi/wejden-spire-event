import "server-only";
import { cookies } from "next/headers";

const COOKIE = "ws_admin";

/** Constant-time-ish check that the admin cookie matches the configured password. */
export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE)?.value === expected;
}

export async function setAdminCookie(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, password, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 12, path: "/" });
  return true;
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
