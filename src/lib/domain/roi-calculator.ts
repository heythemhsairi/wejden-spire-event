import { BENCHMARKS } from "./benchmarks";
import type { Industry } from "./types";

const WORKING_DAYS = 220;
const COVERAGE_MULT = 1.3;

export interface RoiInputs {
  employees: number;
  avgSalary: number; // DT
  turnoverRate: number; // %
  sickDays: number; // per employee / year
  industry: Industry;
  investment: number; // WejdenSpire annual cost (DT)
  // improvement assumptions (relative %), adjustable
  turnoverReduction: number; // e.g. 0.15
  absenceReduction: number; // e.g. 0.10
  productivityRecovery: number; // e.g. 0.08
}

export interface RoiResult {
  // current annual costs
  turnoverCost: number;
  absenceCost: number;
  productivityLoss: number;
  // savings from improvements
  turnoverSavings: number;
  absenceSavings: number;
  productivitySavings: number;
  annualSavings: number;
  // returns
  netGain: number;
  roiPct: number;
  paybackMonths: number;
  threeYearValue: number;
}

/** Default WejdenSpire investment estimate: a per-employee SaaS-style figure (DT/yr). */
export function defaultInvestment(employees: number): number {
  const perEmployee = 120; // DT per employee per year (illustrative)
  return Math.max(6000, Math.round((employees * perEmployee) / 100) * 100);
}

export function calculateRoi(input: RoiInputs): RoiResult {
  const b = BENCHMARKS[input.industry] ?? BENCHMARKS.Other;
  const employees = Math.max(0, input.employees);
  const salary = Math.max(0, input.avgSalary);
  const turnoverRate = Math.max(0, input.turnoverRate);
  const sickDays = Math.max(0, input.sickDays);
  const investment = Math.max(1, input.investment);

  // Current annual costs (same model family as the Hidden Cost Calculator).
  const leavers = employees * (turnoverRate / 100);
  const turnoverCost = leavers * salary * b.replacement_factor;
  const dailySalary = salary / WORKING_DAYS;
  const absenceCost = employees * sickDays * dailySalary * COVERAGE_MULT;
  const productivityLoss = employees * salary * b.presenteeism_rate;

  // Savings from WejdenSpire-driven improvements.
  const turnoverSavings = turnoverCost * input.turnoverReduction;
  const absenceSavings = absenceCost * input.absenceReduction;
  const productivitySavings = productivityLoss * input.productivityRecovery;
  const annualSavings = turnoverSavings + absenceSavings + productivitySavings;

  const netGain = annualSavings - investment;
  const roiPct = (netGain / investment) * 100;
  const paybackMonths = annualSavings > 0 ? (investment / annualSavings) * 12 : Infinity;
  const threeYearValue = annualSavings * 3 - investment * 3;

  return {
    turnoverCost,
    absenceCost,
    productivityLoss,
    turnoverSavings,
    absenceSavings,
    productivitySavings,
    annualSavings,
    netGain,
    roiPct,
    paybackMonths,
    threeYearValue,
  };
}
