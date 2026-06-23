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

export type TurnoverBand = "Sain" | "Acceptable" | "Préoccupant" | "Critique";

export interface CostResult {
  turnoverCost: number;
  absenteeismCost: number;
  productivityLoss: number;
  hiddenAnnualCost: number;
  burnoutExposure: "Faible" | "Modérée" | "Élevée" | "Sévère";
  burnoutScore: number; // 0–100
  benchmarkMultiple: number; // hidden cost as multiple of industry median
  costPerEmployee: number;
  turnoverBand: TurnoverBand;
  turnoverVsMedian: number; // ratio of user's turnover to the industry median
  // "What if" quick win: reduce 1 sick day/employee + 1 point of turnover.
  quickWinSavings: number;
}

/** Categorize a turnover rate against the industry median: is 10% good or bad? */
export function categorizeTurnover(turnoverRate: number, median: number): { band: TurnoverBand; ratio: number } {
  const ratio = median > 0 ? turnoverRate / median : 1;
  const band: TurnoverBand =
    ratio <= 0.8 ? "Sain" : ratio <= 1.15 ? "Acceptable" : ratio <= 1.6 ? "Préoccupant" : "Critique";
  return { band, ratio };
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
    burnoutScore >= 75 ? "Sévère" : burnoutScore >= 55 ? "Élevée" : burnoutScore >= 40 ? "Modérée" : "Faible";

  const payroll = Math.max(1, employees * avgSalary);
  const ratio = hiddenAnnualCost / payroll;
  const medianRatio =
    (b.turnover_median / 100) * b.replacement_factor +
    (b.sickdays_median / WORKING_DAYS) * COVERAGE_MULT +
    b.presenteeism_rate;
  const benchmarkMultiple = medianRatio > 0 ? ratio / medianRatio : 1;

  const { band: turnoverBand, ratio: turnoverVsMedian } = categorizeTurnover(turnoverRate, b.turnover_median);

  // Quick win: what reducing 1 sick day/employee + 1 point of turnover saves.
  const oneTurnoverPoint = employees * 0.01 * avgSalary * b.replacement_factor;
  const oneSickDay = employees * 1 * dailySalary * COVERAGE_MULT;
  const quickWinSavings = oneTurnoverPoint + oneSickDay;

  return {
    turnoverCost,
    absenteeismCost,
    productivityLoss,
    hiddenAnnualCost,
    burnoutExposure,
    burnoutScore,
    benchmarkMultiple,
    costPerEmployee: employees > 0 ? hiddenAnnualCost / employees : 0,
    turnoverBand,
    turnoverVsMedian,
    quickWinSavings,
  };
}
