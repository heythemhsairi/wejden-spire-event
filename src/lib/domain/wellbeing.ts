/**
 * Weekly Wellbeing Check — PANAS-style affect assessment (employee space).
 * 10 emotions: 5 positive affect + 5 negative affect.
 * Each rated 0–4 on a frequency scale over the past week.
 */

export type AffectType = "positive" | "negative";

export interface EmotionItem {
  id: string;
  word: string;
  icon: string; // icon key from the emotion icon set
  affect: AffectType;
}

/** The 5-point frequency scale (index 0..4). */
export const FREQUENCY_OPTIONS = ["Never", "A little", "Moderately", "Often", "Always"];

export const EMOTIONS: EmotionItem[] = [
  { id: "e1", word: "Interested", icon: "interested", affect: "positive" },
  { id: "e2", word: "Enthusiastic", icon: "enthusiastic", affect: "positive" },
  { id: "e3", word: "Strong", icon: "strong", affect: "positive" },
  { id: "e4", word: "Inspired", icon: "inspired", affect: "positive" },
  { id: "e5", word: "Determined", icon: "determined", affect: "positive" },
  { id: "e6", word: "Stressed", icon: "stressed", affect: "negative" },
  { id: "e7", word: "Anxious", icon: "anxious", affect: "negative" },
  { id: "e8", word: "Irritable", icon: "irritable", affect: "negative" },
  { id: "e9", word: "Exhausted", icon: "exhausted", affect: "negative" },
  { id: "e10", word: "Discouraged", icon: "discouraged", affect: "negative" },
];

export interface WellbeingResult {
  /** Overall wellbeing 0–100 (higher = better): high positive + low negative affect. */
  score: number;
  positiveScore: number; // 0–100
  negativeScore: number; // 0–100 (higher = more negative affect = worse)
  band: "Needs care" | "Under strain" | "Doing okay" | "Thriving";
  message: string;
  tips: string[];
}

const POSITIVE_TIPS = [
  "Protect what's fuelling your positive energy — note one thing that lifted you this week.",
  "Share momentum: a quick win shared with a colleague compounds positive affect.",
];
const NEGATIVE_TIPS: Record<string, string> = {
  e6: "When stress spikes, try a 2-minute breathing reset before the next task.",
  e7: "Name the worry, then write the smallest next step — anxiety shrinks when it's concrete.",
  e8: "Irritability is often a signal of overload — protect one short recovery break today.",
  e9: "Exhaustion needs recovery, not push — set a clear shutdown time tonight.",
  e10: "Feeling discouraged? Reconnect with one part of your work that still feels meaningful, and reach out to someone you trust.",
};

export function scoreWellbeing(answers: Record<string, number>): WellbeingResult {
  const pos = EMOTIONS.filter((e) => e.affect === "positive");
  const neg = EMOTIONS.filter((e) => e.affect === "negative");

  const avg = (items: EmotionItem[]) => {
    const vals = items.map((e) => answers[e.id]).filter((v): v is number => typeof v === "number");
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length; // 0..4
  };

  const posAvg = avg(pos); // 0..4
  const negAvg = avg(neg); // 0..4
  const positiveScore = Math.round((posAvg / 4) * 100);
  const negativeScore = Math.round((negAvg / 4) * 100);

  // Overall wellbeing: balance of positive minus negative, mapped to 0–100.
  const balance = (posAvg - negAvg + 4) / 8; // 0..1
  const score = Math.round(balance * 100);

  const band =
    score >= 75 ? "Thriving" : score >= 55 ? "Doing okay" : score >= 38 ? "Under strain" : "Needs care";

  const message =
    band === "Thriving"
      ? "You're in a strong place — positive energy clearly outweighs the strain. Keep protecting what works."
      : band === "Doing okay"
        ? "A reasonable balance, with a few areas worth keeping an eye on this week."
        : band === "Under strain"
          ? "Negative feelings are weighing on your positive energy. Small, intentional changes can shift this."
          : "You're carrying a heavy emotional load right now. Please be gentle with yourself — and consider reaching out for support.";

  // Tips: surface the strongest negative emotions first, then a positive reinforcement.
  const tips: string[] = [];
  const strongestNeg = [...neg]
    .filter((e) => (answers[e.id] ?? 0) >= 2)
    .sort((a, b) => (answers[b.id] ?? 0) - (answers[a.id] ?? 0));
  for (const e of strongestNeg.slice(0, 2)) {
    if (NEGATIVE_TIPS[e.id]) tips.push(NEGATIVE_TIPS[e.id]);
  }
  if (tips.length < 3) tips.push(positiveScore >= 50 ? POSITIVE_TIPS[0] : POSITIVE_TIPS[1]);

  return { score, positiveScore, negativeScore, band, message, tips: tips.slice(0, 3) };
}
