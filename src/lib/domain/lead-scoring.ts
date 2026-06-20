import type { Role, SourceExperience } from "./types";

export interface LeadScoreInput {
  role?: string;
  sourceExperience?: SourceExperience;
  experiencesCompleted?: number;
  requestedReport?: boolean;
  hiddenCost?: number; // from cost calc, if any
}

const EXECUTIVE_ROLES: Role[] = ["CEO", "Managing Director", "General Manager", "Founder"];

export function scoreLead(input: LeadScoreInput): { score: number; temperature: "hot" | "warm" | "cold" } {
  let score = 0;
  if (input.role && EXECUTIVE_ROLES.includes(input.role as Role)) score += 40;
  else if (input.role && input.role !== "Other") score += 20; // HR/HSE/ESG
  if ((input.experiencesCompleted ?? 0) >= 2) score += 20;
  if (input.requestedReport) score += 15;
  if ((input.hiddenCost ?? 0) >= 1_000_000) score += 10;
  if (input.sourceExperience === "advisor") score += 5;
  else if (input.sourceExperience === "pulse") score += 5;

  const temperature = score >= 55 ? "hot" : score >= 30 ? "warm" : "cold";
  return { score, temperature };
}
