"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LiveDot } from "./ui";

interface Stats {
  participant_count: number;
  stress_avg: number | null;
  energy_avg: number | null;
  burnout_exposure: number | null;
  psych_safety_avg: number | null;
}

/** Marquee ticker on the home page that reflects the real live event pulse. */
export function LiveTicker({ sessionId }: { sessionId: string | null }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const supabase = createClient();
    let active = true;

    async function refresh() {
      const { data } = await supabase.rpc("pulse_session_stats", { p_session: sessionId });
      if (active && data && data[0]) setStats(data[0] as Stats);
    }
    refresh();

    const channel = supabase
      .channel(`ticker-${sessionId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pulse_signals", filter: `session_id=eq.${sessionId}` }, refresh)
      .subscribe();

    const interval = setInterval(refresh, 8000);
    return () => {
      active = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const items = stats
    ? [
        `${stats.participant_count} live participants`,
        `Stress index ${stats.stress_avg ?? "—"}`,
        `Energy index ${stats.energy_avg ?? "—"}`,
        `Burnout exposure ${stats.burnout_exposure ?? "—"}`,
        `Psychological safety ${stats.psych_safety_avg ?? "—"}`,
      ]
    : ["Burnout exposure ▲ 32%", "Turnover risk ● 18%", "Emotional overload ▲ 27%", "Engagement risk ● 41%", "Leadership pressure ▲ 23%"];

  const doubled = [...items, ...items];

  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-full border border-ws-border bg-white px-5 py-3 shadow-ws-card">
      <LiveDot label={stats ? "Live" : "Demo"} />
      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-ws-marquee gap-8 whitespace-nowrap">
          {doubled.map((t, i) => (
            <span key={i} className="tnum text-sm font-medium text-ws-sage">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
