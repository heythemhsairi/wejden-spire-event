import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { MoodTrends } from "./mood-trends";

export const metadata: Metadata = {
  title: "Mood Trends — WejdenSpire",
  description: "Watch a company's emotional affect drift over time — and imagine seeing your own, every week.",
};

export const dynamic = "force-dynamic";

export default async function MoodTrendsPage() {
  // Read real recent check-in averages for the live edge (best-effort).
  let live: { positiveAvg: number | null; negativeAvg: number | null; count: number } | null = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.rpc("checkin_recent_stats");
    const row = data?.[0];
    if (row) live = { positiveAvg: row.positive_avg, negativeAvg: row.negative_avg, count: Number(row.count) };
  } catch {
    live = null;
  }
  return <MoodTrends live={live} />;
}
