import { BENCHMARKS } from "./benchmarks";
import { clamp, seededNoise } from "../utils";
import type { CompanySize, Industry } from "./types";

/** Size multipliers — larger orgs carry more structural overload & leadership pressure. */
const SIZE_FACTOR: Record<CompanySize, number> = {
  "50–200": 0.9,
  "200–500": 0.97,
  "500–1000": 1.0,
  "1000–5000": 1.06,
  "5000+": 1.12,
};

export interface DashboardMetric {
  key: string;
  label: string;
  value: number; // current value
  unit: "index" | "percent";
  delta: number; // vs last tick
  spark: number[]; // recent history for sparkline
  higherIsWorse: boolean;
}

export interface DashboardSnapshot {
  metrics: DashboardMetric[];
  heatmap: number[][]; // departments × weeks, 0–100 risk
  departments: string[];
  weeks: string[];
  feed: string[];
}

const DEPARTMENTS = ["Operations", "Sales", "Engineering", "Support", "Finance", "People"];
const WEEKS = ["W-5", "W-4", "W-3", "W-2", "W-1", "Now"];

const METRIC_DEFS = [
  { key: "burnout", label: "Burnout Risk Index", unit: "index" as const, higherIsWorse: true },
  { key: "overload", label: "Emotional Overload Index", unit: "index" as const, higherIsWorse: true },
  { key: "turnover", label: "Turnover Risk", unit: "index" as const, higherIsWorse: true },
  { key: "engagement", label: "Engagement Risk", unit: "index" as const, higherIsWorse: true },
  { key: "productivity", label: "Productivity Impact", unit: "percent" as const, higherIsWorse: true },
  { key: "leadership", label: "Leadership Pressure", unit: "index" as const, higherIsWorse: true },
];

/**
 * Deterministic-but-alive dashboard generator (Experience 3).
 * Seeded by industry+size+tick so it feels live without being random per refresh.
 */
export function generateDashboard(industry: Industry, size: CompanySize, tick: number): DashboardSnapshot {
  const b = BENCHMARKS[industry] ?? BENCHMARKS.Other;
  const sf = SIZE_FACTOR[size] ?? 1;
  const seed = `${industry}:${size}`;

  const metrics: DashboardMetric[] = METRIC_DEFS.map((def) => {
    const baseline = (b.dashboard_baselines as Record<string, number>)[def.key] ?? 50;
    const series: number[] = [];
    for (let i = 0; i < 8; i++) {
      const wobble = (seededNoise(`${seed}:${def.key}`, tick - (7 - i)) - 0.5) * 6;
      const v = def.unit === "percent" ? baseline * sf + wobble : clamp(baseline * sf + wobble, 0, 100);
      series.push(Math.round(v * 10) / 10);
    }
    const value = series[series.length - 1];
    const delta = Math.round((value - series[series.length - 2]) * 10) / 10;
    return {
      key: def.key,
      label: def.label,
      value,
      unit: def.unit,
      delta,
      spark: series,
      higherIsWorse: def.higherIsWorse,
    };
  });

  // Heatmap: departments × weeks, drifting around the burnout baseline.
  const base = (b.dashboard_baselines.burnout ?? 60) * sf;
  const heatmap = DEPARTMENTS.map((dept, di) =>
    WEEKS.map((_, wi) => {
      const n = seededNoise(`${seed}:${dept}`, di * 13 + wi * 7 + tick);
      const trend = wi * 1.5; // mild escalation toward "Now"
      return Math.round(clamp(base + (n - 0.45) * 40 + trend, 5, 98));
    }),
  );

  // Signal feed: surfaces the hottest cells as streaming alerts.
  const feedPool = [
    `${DEPARTMENTS[(tick) % DEPARTMENTS.length]} overload rising ▲`,
    `Night-shift fatigue signal detected`,
    `${DEPARTMENTS[(tick + 2) % DEPARTMENTS.length]} engagement dipping`,
    `Flight-risk concentration in ${DEPARTMENTS[(tick + 1) % DEPARTMENTS.length]}`,
    `Leadership pressure above threshold`,
    `Psychological-safety variance widening`,
    `Recovery: ${DEPARTMENTS[(tick + 4) % DEPARTMENTS.length]} stabilizing ▼`,
  ];
  const feed = [feedPool[tick % feedPool.length], feedPool[(tick + 3) % feedPool.length], feedPool[(tick + 5) % feedPool.length]];

  return { metrics, heatmap, departments: DEPARTMENTS, weeks: WEEKS, feed };
}
