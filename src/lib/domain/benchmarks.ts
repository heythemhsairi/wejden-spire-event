import type { Industry, IndustryBenchmark } from "./types";

/**
 * Static fallback of the industry_benchmarks table.
 * The calculators run fully client-side at the booth (offline-safe), so they
 * use these constants. The DB table mirrors them and is the source of truth
 * the admin can tune; keep the two in sync.
 */
export const BENCHMARKS: Record<Industry, IndustryBenchmark> = {
  Technology: {
    industry: "Technology",
    replacement_factor: 1.4,
    presenteeism_rate: 0.045,
    turnover_median: 13,
    sickdays_median: 6.5,
    dashboard_baselines: { burnout: 68, overload: 62, turnover: 24, engagement: 42, productivity: -11, leadership: 55 },
  },
  Healthcare: {
    industry: "Healthcare",
    replacement_factor: 1.6,
    presenteeism_rate: 0.06,
    turnover_median: 18,
    sickdays_median: 9.2,
    dashboard_baselines: { burnout: 74, overload: 69, turnover: 28, engagement: 48, productivity: -14, leadership: 61 },
  },
  Manufacturing: {
    industry: "Manufacturing",
    replacement_factor: 1.3,
    presenteeism_rate: 0.05,
    turnover_median: 15,
    sickdays_median: 8.0,
    dashboard_baselines: { burnout: 63, overload: 58, turnover: 21, engagement: 40, productivity: -10, leadership: 52 },
  },
  Finance: {
    industry: "Finance",
    replacement_factor: 1.8,
    presenteeism_rate: 0.04,
    turnover_median: 12,
    sickdays_median: 5.5,
    dashboard_baselines: { burnout: 66, overload: 64, turnover: 19, engagement: 38, productivity: -9, leadership: 58 },
  },
  Retail: {
    industry: "Retail",
    replacement_factor: 0.9,
    presenteeism_rate: 0.055,
    turnover_median: 26,
    sickdays_median: 7.2,
    dashboard_baselines: { burnout: 61, overload: 55, turnover: 34, engagement: 44, productivity: -12, leadership: 49 },
  },
  Energy: {
    industry: "Energy",
    replacement_factor: 1.5,
    presenteeism_rate: 0.048,
    turnover_median: 14,
    sickdays_median: 7.8,
    dashboard_baselines: { burnout: 64, overload: 60, turnover: 17, engagement: 41, productivity: -10, leadership: 56 },
  },
  "Public Sector": {
    industry: "Public Sector",
    replacement_factor: 1.2,
    presenteeism_rate: 0.058,
    turnover_median: 11,
    sickdays_median: 9.8,
    dashboard_baselines: { burnout: 59, overload: 57, turnover: 13, engagement: 46, productivity: -13, leadership: 47 },
  },
  Other: {
    industry: "Other",
    replacement_factor: 1.3,
    presenteeism_rate: 0.05,
    turnover_median: 16,
    sickdays_median: 7.5,
    dashboard_baselines: { burnout: 62, overload: 58, turnover: 20, engagement: 43, productivity: -11, leadership: 53 },
  },
};
