/** Shared domain types for WejdenSpire experiences. */

export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Finance",
  "Retail",
  "Energy",
  "Public Sector",
  "Other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const COMPANY_SIZES = [
  "50–200",
  "200–500",
  "500–1000",
  "1000–5000",
  "5000+",
] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const ROLES = [
  "CEO",
  "Managing Director",
  "General Manager",
  "Founder",
  "HR Director",
  "People & Culture",
  "HSE Manager",
  "ESG Manager",
  "Other",
] as const;
export type Role = (typeof ROLES)[number];

export type SourceExperience = "cost" | "risk" | "dashboard" | "pulse" | "advisor";

/** Industry coefficient model (mirrors the industry_benchmarks table). */
export interface IndustryBenchmark {
  industry: Industry;
  replacement_factor: number;
  presenteeism_rate: number;
  turnover_median: number;
  sickdays_median: number;
  dashboard_baselines: {
    burnout: number;
    overload: number;
    turnover: number;
    engagement: number;
    productivity: number;
    leadership: number;
  };
}
