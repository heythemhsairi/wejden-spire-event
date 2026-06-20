/** Workforce Risk Scanner (Experience 2): 10 questions, 5 categories. */

export type RiskCategory =
  | "Burnout Risk"
  | "Turnover Risk"
  | "Organizational Visibility"
  | "Workforce Intelligence Maturity"
  | "Leadership Readiness";

export interface ScanQuestion {
  id: string;
  category: RiskCategory;
  text: string;
  /** Options ordered worst → best; index maps to a 0–4 maturity score. */
  options: string[];
}

export const SCAN_QUESTIONS: ScanQuestion[] = [
  {
    id: "q1",
    category: "Burnout Risk",
    text: "Can your leadership see burnout building before someone resigns?",
    options: ["No — we find out when they quit", "Anecdotally, manager by manager", "We run periodic surveys", "We track leading indicators", "We have real-time burnout exposure signals"],
  },
  {
    id: "q2",
    category: "Burnout Risk",
    text: "How do you currently detect chronic workload overload across teams?",
    options: ["We don't", "Complaints reach us informally", "Annual engagement survey", "Quarterly pulse + manager check-ins", "Continuous workload & overload indices"],
  },
  {
    id: "q3",
    category: "Turnover Risk",
    text: "How far in advance can you predict regretted attrition?",
    options: ["We can't predict it", "We react after resignations", "Exit interviews tell us why", "We model flight-risk by team", "We forecast attrition with leading signals"],
  },
  {
    id: "q4",
    category: "Turnover Risk",
    text: "Do you know which teams are at highest turnover risk right now?",
    options: ["No visibility", "Gut feel from managers", "Last year's turnover report", "A current risk register", "Live, ranked turnover-risk by unit"],
  },
  {
    id: "q5",
    category: "Organizational Visibility",
    text: "How visible are psychosocial risks to your executive team?",
    options: ["Invisible", "Only when there's a crisis", "Summarized once a year", "Reviewed each quarter", "On the executive dashboard continuously"],
  },
  {
    id: "q6",
    category: "Organizational Visibility",
    text: "Can you compare wellbeing & risk signals across departments?",
    options: ["No", "Only headcount/cost", "Some HR metrics", "Cross-department engagement data", "Normalized risk indices per department"],
  },
  {
    id: "q7",
    category: "Workforce Intelligence Maturity",
    text: "How data-driven are your people decisions today?",
    options: ["Mostly intuition", "Basic HR reporting", "Dashboards for lagging metrics", "Some predictive analytics", "Decision support from leading indicators"],
  },
  {
    id: "q8",
    category: "Workforce Intelligence Maturity",
    text: "Do you quantify the business cost of psychosocial risk?",
    options: ["Never", "We assume it's small", "We've estimated it once", "We track it annually", "We monitor it as a live business metric"],
  },
  {
    id: "q9",
    category: "Leadership Readiness",
    text: "How equipped are managers to act on early risk signals?",
    options: ["Not at all", "Reactive only", "Trained but no data", "Data + playbooks", "Real-time signals + guided actions"],
  },
  {
    id: "q10",
    category: "Leadership Readiness",
    text: "Is workforce wellbeing tied to executive accountability & KPIs?",
    options: ["No", "Mentioned in values", "Tracked informally", "A board-level topic", "A KPI with owners and targets"],
  },
];

const CATEGORIES: RiskCategory[] = [
  "Burnout Risk",
  "Turnover Risk",
  "Organizational Visibility",
  "Workforce Intelligence Maturity",
  "Leadership Readiness",
];

// Visibility & Maturity weighted higher — they predict capacity to act.
const WEIGHTS: Record<RiskCategory, number> = {
  "Burnout Risk": 1,
  "Turnover Risk": 1,
  "Organizational Visibility": 1.25,
  "Workforce Intelligence Maturity": 1.25,
  "Leadership Readiness": 1.15,
};

export interface ScanResult {
  overall: number; // 0–100 (higher = more mature / lower risk)
  band: "Critical" | "Elevated" | "Developing" | "Mature";
  categories: { category: RiskCategory; score: number }[];
  weakest: RiskCategory[];
  recommendations: string[];
}

const RECOMMENDATIONS: Record<RiskCategory, string> = {
  "Burnout Risk":
    "Stand up continuous burnout-exposure signals so you see overload building weeks before resignations — not after.",
  "Turnover Risk":
    "Move from exit interviews to leading flight-risk indicators, ranked by team, so retention action is proactive.",
  "Organizational Visibility":
    "Put normalized psychosocial-risk indices on the executive dashboard so risk is visible at board altitude, continuously.",
  "Workforce Intelligence Maturity":
    "Quantify the business cost of psychosocial risk as a live metric to anchor people decisions in financial impact.",
  "Leadership Readiness":
    "Equip managers with real-time signals and guided next actions, and tie wellbeing to executive KPIs with named owners.",
};

export function scoreScan(answers: Record<string, number>): ScanResult {
  const byCat: Record<RiskCategory, number[]> = {
    "Burnout Risk": [],
    "Turnover Risk": [],
    "Organizational Visibility": [],
    "Workforce Intelligence Maturity": [],
    "Leadership Readiness": [],
  };
  for (const q of SCAN_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") byCat[q.category].push(v);
  }

  const categories = CATEGORIES.map((category) => {
    const vals = byCat[category];
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; // 0–4
    return { category, score: Math.round((avg / 4) * 100) };
  });

  const totalWeight = CATEGORIES.reduce((s, c) => s + WEIGHTS[c], 0);
  const overall = Math.round(
    categories.reduce((s, c) => s + c.score * WEIGHTS[c.category], 0) / totalWeight,
  );

  const band =
    overall >= 80 ? "Mature" : overall >= 60 ? "Developing" : overall >= 40 ? "Elevated" : "Critical";

  const weakest = [...categories]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((c) => c.category);

  return {
    overall,
    band,
    categories,
    weakest,
    recommendations: weakest.map((c) => RECOMMENDATIONS[c]),
  };
}
