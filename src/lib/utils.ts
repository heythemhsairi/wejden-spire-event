import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as EUR with no decimals, e.g. 1840000 -> "€1.84M". */
export function formatCurrencyCompact(value: number): string {
  if (!isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `€${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `€${(value / 1_000).toFixed(0)}k`;
  return `€${Math.round(value).toLocaleString("en-US")}`;
}

/** Full EUR with thousands separators, e.g. "€1,840,000". */
export function formatCurrencyFull(value: number): string {
  if (!isFinite(value)) return "—";
  return `€${Math.round(value).toLocaleString("en-US")}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic seeded pseudo-random in [0,1) from a string + tick. */
export function seededNoise(seed: string, tick = 0): number {
  let h = 2166136261 ^ tick;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  h += tick * 2654435761;
  h = (h ^ (h >>> 15)) >>> 0;
  return (h % 100000) / 100000;
}

/** Map a 0–100 risk value to a brand-aligned color (higher = worse). */
export function riskColor(value: number): string {
  if (value >= 75) return "#E06A5C"; // soft red
  if (value >= 55) return "#E0843C"; // warm amber
  if (value >= 40) return "#E0A23C"; // gold
  return "#4AAA83"; // Spire Green
}

/** Risk band label for a 0–100 score (higher = worse). */
export function riskBand(value: number): string {
  if (value >= 75) return "Severe";
  if (value >= 55) return "Elevated";
  if (value >= 40) return "Moderate";
  return "Low";
}

/** Generate an unguessable token for shareable reports. */
export function makeToken(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
