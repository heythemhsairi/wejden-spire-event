import { BENCHMARKS } from "./benchmarks";
import type { Industry } from "./types";

const WORKING_DAYS = 220;
const COVERAGE_MULT = 1.3; // cost of covering an absent employee (temp/overtime/lost output)

export interface CostInputs {
  employees: number;
  turnoverRate: number; // %
  avgSalary: number; // €
  sickDays: number; // per employee / year
  industry: Industry;
}

export interface CostResult {
  turnoverCost: number;
  absenteeismCost: number;
  productivityLoss: number;
  hiddenAnnualCost: number;
  burnoutExposure: "Low" | "Moderate" | "High" | "Severe";
  burnoutScore: number; // 0–100
  benchmarkMultiple: number; // hidden cost as multiple of industry median
  costPerEmployee: number;
}

/**
 * Estimation model for the Hidden Cost Calculator (Experience 1).
 * All coefficients sourced from the industry benchmark table. These are
 * defensible estimates, not measurements — that's the whole point of the CTA.
 */
export function calculateHiddenCost(input: CostInputs): CostResult {
  const b = BENCHMARKS[input.industry] ?? BENCHMARKS.Other;
  const employees = Math.max(0, input.employees);
  const turnoverRate = Math.max(0, input.turnoverRate);
  const avgSalary = Math.max(0, input.avgSalary);
  const sickDays = Math.max(0, input.sickDays);

  const leavers = employees * (turnoverRate / 100);
  const turnoverCost = leavers * avgSalary * b.replacement_factor;

  const dailySalary = avgSalary / WORKING_DAYS;
  const absenteeismCost = employees * sickDays * dailySalary * COVERAGE_MULT;

  const productivityLoss = employees * avgSalary * b.presenteeism_rate;

  const hiddenAnnualCost = turnoverCost + absenteeismCost + productivityLoss;

  // Burnout exposure: how far turnover & sick days run above the industry median.
  const turnoverPressure = turnoverRate / Math.max(1, b.turnover_median); // ~1 = at median
  const sickPressure = sickDays / Math.max(1, b.sickdays_median);
  const raw = (turnoverPressure * 0.55 + sickPressure * 0.45) * 50; // ~50 at median
  const burnoutScore = Math.round(Math.min(100, Math.max(0, raw)));

  const burnoutExposure =
    burnoutScore >= 75 ? "Severe" : burnoutScore >= 55 ? "High" : burnoutScore >= 40 ? "Moderate" : "Low";

  const payroll = Math.max(1, employees * avgSalary);
  const ratio = hiddenAnnualCost / payroll;
  const medianRatio =
    (b.turnover_median / 100) * b.replacement_factor +
    (b.sickdays_median / WORKING_DAYS) * COVERAGE_MULT +
    b.presenteeism_rate;
  const benchmarkMultiple = medianRatio > 0 ? ratio / medianRatio : 1;

  return {
    turnoverCost,
    absenteeismCost,
    productivityLoss,
    hiddenAnnualCost,
    burnoutExposure,
    burnoutScore,
    benchmarkMultiple,
    costPerEmployee: employees > 0 ? hiddenAnnualCost / employees : 0,
  };
}
