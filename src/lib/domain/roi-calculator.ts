import { BENCHMARKS } from "./benchmarks";
import type { Industry } from "./types";

const WORKING_DAYS = 220;
const COVERAGE_MULT = 1.3;

export interface RoiInputs {
  employees: number;
  avgSalary: number; // DT (employer cost)
  turnoverRate: number; // %
  sickDays: number; // per employee / year
  industry: Industry;
  // improvement assumptions (relative %), adjustable
  turnoverReduction: number; // e.g. 0.15
  absenceReduction: number; // e.g. 0.10
  productivityRecovery: number; // e.g. 0.08
}

export interface RoiResult {
  // current annual hidden costs
  turnoverCost: number;
  absenceCost: number;
  productivityLoss: number;
  totalHiddenCost: number;
  // potential savings from improvements (the client's gain)
  turnoverSavings: number;
  absenceSavings: number;
  productivitySavings: number;
  annualSavings: number;
  savingsRate: number; // annualSavings / totalHiddenCost (0–1)
  threeYearValue: number; // 3-year cumulative savings
  // transparency: the per-employee figures behind the levers
  perEmployeeSaving: number;
}

export function calculateRoi(input: RoiInputs): RoiResult {
  const b = BENCHMARKS[input.industry] ?? BENCHMARKS.Other;
  const employees = Math.max(0, input.employees);
  const salary = Math.max(0, input.avgSalary);
  const turnoverRate = Math.max(0, input.turnoverRate);
  const sickDays = Math.max(0, input.sickDays);

  // Current annual hidden costs (same model family as the Hidden Cost Calculator).
  const leavers = employees * (turnoverRate / 100);
  const turnoverCost = leavers * salary * b.replacement_factor;
  const dailySalary = salary / WORKING_DAYS;
  const absenceCost = employees * sickDays * dailySalary * COVERAGE_MULT;
  const productivityLoss = employees * salary * b.presenteeism_rate;
  const totalHiddenCost = turnoverCost + absenceCost + productivityLoss;

  // Potential savings from sustained improvements.
  const turnoverSavings = turnoverCost * input.turnoverReduction;
  const absenceSavings = absenceCost * input.absenceReduction;
  const productivitySavings = productivityLoss * input.productivityRecovery;
  const annualSavings = turnoverSavings + absenceSavings + productivitySavings;

  return {
    turnoverCost,
    absenceCost,
    productivityLoss,
    totalHiddenCost,
    turnoverSavings,
    absenceSavings,
    productivitySavings,
    annualSavings,
    savingsRate: totalHiddenCost > 0 ? annualSavings / totalHiddenCost : 0,
    threeYearValue: annualSavings * 3,
    perEmployeeSaving: employees > 0 ? annualSavings / employees : 0,
  };
}
