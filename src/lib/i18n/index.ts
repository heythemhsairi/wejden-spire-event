import { fr } from "./fr";

/**
 * Active dictionary. French-only for now; to add English later, select by locale
 * here (e.g. from a cookie/route) and components keep calling t() unchanged.
 */
const dict = fr;

/**
 * Translate by dot-path with optional {var} interpolation.
 * Returns arrays as-is (for lists like advisor.chips). Falls back to the key.
 */
export function t(path: string, vars?: Record<string, string | number>): string {
  const value = path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), dict);
  if (typeof value !== "string") return path;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

/** Get an array value (e.g. suggested chips). */
export function tArr(path: string): string[] {
  const value = path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), dict);
  return Array.isArray(value) ? (value as string[]) : [];
}

export { fr };
