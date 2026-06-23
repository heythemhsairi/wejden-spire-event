import { BENCHMARKS } from "./benchmarks";
import { clamp, seededNoise } from "../utils";
import type { CompanySize, Industry } from "./types";

const SIZE_FACTOR: Record<CompanySize, number> = {
  "50–200": 0.95,
  "200–500": 0.98,
  "500–1000": 1.0,
  "1000–5000": 1.04,
  "5000+": 1.08,
};

export interface TrendPoint {
  label: string; // week label
  positive: number; // 0–100 positive affect
  negative: number; // 0–100 negative affect
  wellbeing: number; // 0–100 balance (higher = better)
  live?: boolean; // true if this point came from real check-ins
}

export interface MoodTrend {
  points: TrendPoint[];
  weeks: number;
  /** Index threshold below which wellbeing enters the "intervention zone". */
  interventionThreshold: number;
  liveCount: number; // number of real check-ins folded into the last point
}

const WEEKS = 10;

/**
 * Hybrid mood-trend generator.
 * Simulates ~10 weeks of company affect data that drifts toward strain (the story:
 * negative affect creeping up, positive dipping), then overlays REAL live check-in
 * averages on the final "now" point when available.
 */
export function generateMoodTrend(
  industry: Industry,
  size: CompanySize,
  live?: { positiveAvg: number | null; negativeAvg: number | null; count: number },
): MoodTrend {
  const b = BENCHMARKS[industry] ?? BENCHMARKS.Other;
  const sf = SIZE_FACTOR[size] ?? 1;
  const seed = `${industry}:${size}`;

  // Baselines derived from the industry dashboard baselines.
  const basePos = clamp(100 - (b.dashboard_baselines.engagement ?? 45) * 0.6 - 10, 35, 75);
  const baseNeg = clamp((b.dashboard_baselines.burnout ?? 62) * 0.55 * sf, 25, 70);

  const points: TrendPoint[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const t = w / (WEEKS - 1); // 0..1 across the window
    // Gentle deterioration story: positive sags, negative climbs toward "now".
    const posTrend = basePos - t * 10 * sf;
    const negTrend = baseNeg + t * 14 * sf;
    const posWobble = (seededNoise(`${seed}:pos`, w) - 0.5) * 8;
    const negWobble = (seededNoise(`${seed}:neg`, w) - 0.5) * 8;
    const positive = clamp(posTrend + posWobble, 5, 95);
    const negative = clamp(negTrend + negWobble, 5, 95);
    const wellbeing = clamp((positive - negative + 100) / 2, 0, 100);
    points.push({
      label: w === WEEKS - 1 ? "Now" : `W-${WEEKS - 1 - w}`,
      positive: Math.round(positive),
      negative: Math.round(negative),
      wellbeing: Math.round(wellbeing),
    });
  }

  // Overlay live data on the final point if we have real check-ins.
  let liveCount = 0;
  if (live && live.count > 0 && (live.positiveAvg !== null || live.negativeAvg !== null)) {
    const last = points[points.length - 1];
    const pos = live.positiveAvg ?? last.positive;
    const neg = live.negativeAvg ?? last.negative;
    points[points.length - 1] = {
      label: "Now",
      positive: Math.round(pos),
      negative: Math.round(neg),
      wellbeing: Math.round(clamp((pos - neg + 100) / 2, 0, 100)),
      live: true,
    };
    liveCount = live.count;
  }

  return { points, weeks: WEEKS, interventionThreshold: 45, liveCount };
}
