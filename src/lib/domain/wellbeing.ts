/** Personal employee wellbeing assessment (employee space). */

export interface WellbeingQuestion {
  id: string;
  text: string;
  /** Options worst → best (index 0..4). If reverse, high answer = worse. */
  options: string[];
  reverse?: boolean;
}

export const WELLBEING_QUESTIONS: WellbeingQuestion[] = [
  {
    id: "w1",
    text: "How would you rate your energy at work lately?",
    options: ["Completely drained", "Often tired", "Up and down", "Mostly good", "Energized"],
  },
  {
    id: "w2",
    text: "How manageable is your current workload?",
    options: ["Overwhelming", "Often too much", "Borderline", "Mostly fine", "Comfortable"],
  },
  {
    id: "w3",
    text: "Do you feel safe to speak up or make mistakes on your team?",
    options: ["Not at all", "Rarely", "Sometimes", "Usually", "Always"],
  },
  {
    id: "w4",
    text: "Do you feel supported by your manager and colleagues?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: "w5",
    text: "How often do you feel stressed during the work week?",
    options: ["Calm most days", "Occasionally", "A few times a week", "Most days", "Constantly"],
    reverse: true,
  },
  {
    id: "w6",
    text: "Are you able to disconnect and recover after work?",
    options: ["Never", "Rarely", "Sometimes", "Usually", "Always"],
  },
  {
    id: "w7",
    text: "Do you feel your work is recognized and meaningful?",
    options: ["Not at all", "Rarely", "Somewhat", "Often", "Very much"],
  },
];

export interface WellbeingResult {
  score: number; // 0–100 (higher = better)
  band: "Needs care" | "Under strain" | "Doing okay" | "Thriving";
  message: string;
  tips: string[];
}

export function scoreWellbeing(answers: Record<string, number>): WellbeingResult {
  let total = 0;
  let count = 0;
  for (const q of WELLBEING_QUESTIONS) {
    const a = answers[q.id];
    if (typeof a !== "number") continue;
    const v = q.reverse ? 4 - a : a; // normalize so higher = better
    total += v;
    count++;
  }
  const score = count ? Math.round((total / (count * 4)) * 100) : 0;

  const band =
    score >= 80 ? "Thriving" : score >= 60 ? "Doing okay" : score >= 40 ? "Under strain" : "Needs care";

  const message =
    band === "Thriving"
      ? "You're in a good place. Keep protecting what's working for you."
      : band === "Doing okay"
        ? "You're doing alright, with a few areas worth keeping an eye on."
        : band === "Under strain"
          ? "There are real signs of strain. Small changes now can make a big difference."
          : "You're carrying a lot right now. Please be kind to yourself — and consider reaching out for support.";

  // Tips target the weakest answers.
  const tips: string[] = [];
  if ((answers.w1 ?? 4) <= 1) tips.push("Protect one short recovery break each day — even 10 minutes helps energy.");
  if ((answers.w2 ?? 4) <= 1) tips.push("List your top 3 priorities and flag what you can defer or delegate to your manager.");
  if ((answers.w3 ?? 4) <= 1) tips.push("Psychological safety matters — note one small thing that would help you speak up.");
  if ((answers.w4 ?? 4) <= 1) tips.push("Reach out to one trusted colleague this week — connection buffers stress.");
  if ((answers.w5 ?? 0) >= 3) tips.push("Try a 2-minute breathing reset before high-pressure moments.");
  if ((answers.w6 ?? 4) <= 1) tips.push("Set a clear end-of-day shutdown ritual to help you disconnect.");
  if (tips.length === 0) tips.push("Keep doing what's working — and check in with yourself regularly.");

  return { score, band, message, tips: tips.slice(0, 3) };
}
