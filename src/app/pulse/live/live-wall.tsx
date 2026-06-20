"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CountUp } from "@/components/ws/count-up";
import { RadialGauge } from "@/components/ws/radial-gauge";
import { LiveDot } from "@/components/ws/ui";
import { BrandMark } from "@/components/ws/brand-logo";
import { FullscreenButton } from "@/components/ws/fullscreen-button";
import { riskColor } from "@/lib/utils";

interface Stats {
  participant_count: number;
  stress_avg: number | null;
  energy_avg: number | null;
  workload_avg: number | null;
  support_avg: number | null;
  psych_safety_avg: number | null;
  burnout_exposure: number | null;
}

const EMPTY: Stats = {
  participant_count: 0,
  stress_avg: null,
  energy_avg: null,
  workload_avg: null,
  support_avg: null,
  psych_safety_avg: null,
  burnout_exposure: null,
};

export function LiveWall({ sessionId }: { sessionId: string | null }) {
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [flash, setFlash] = useState(false);

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
      .channel(`wall-${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pulse_signals", filter: `session_id=eq.${sessionId}` },
        () => {
          setFlash(true);
          setTimeout(() => setFlash(false), 600);
          refresh();
        },
      )
      .subscribe();

    const interval = setInterval(refresh, 6000);
    return () => {
      active = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const stress = stats.stress_avg ?? 0;
  const energy = stats.energy_avg ?? 0;
  const safety = stats.psych_safety_avg ?? 0;
  const burnout = stats.burnout_exposure ?? 0;
  const hasData = stats.participant_count > 0;

  return (
    <div className="flex min-h-screen flex-col bg-ws-hero p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark size={40} />
          <div>
            <div className="font-display text-xl font-extrabold tracking-tight text-ws-ink">EVENT WORKFORCE PULSE</div>
            <div className="text-xs font-medium uppercase tracking-wider text-ws-text-dim">Live signal · WejdenSpire</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-ws-text-dim">Participants</div>
            <div className="tnum font-display text-4xl font-bold text-ws-primary">
              <CountUp value={stats.participant_count} />
            </div>
          </div>
          <LiveDot />
          <FullscreenButton label />
        </div>
      </div>

      {!sessionId && (
        <div className="mt-20 text-center text-ws-sage">No active session. Start one from the admin console.</div>
      )}

      {/* Big indices */}
      <div className={`mt-8 grid flex-1 grid-cols-1 gap-5 lg:grid-cols-3 ${flash ? "transition-all" : ""}`}>
        <BigStat label="Stress Index" value={stress} higherIsWorse hasData={hasData} />
        <BigStat label="Energy Index" value={energy} hasData={hasData} />
        <BigStat label="Psychological Safety" value={safety} hasData={hasData} />
      </div>

      {/* Burnout gauge + secondary */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <SecondaryStat label="Workload pressure" value={stats.workload_avg} higherIsWorse />
        <div className="flex flex-col items-center rounded-xl border border-ws-border bg-white px-10 py-6">
          <span className="mb-2 text-xs uppercase tracking-wider text-ws-text-dim">Burnout exposure</span>
          <RadialGauge value={hasData ? burnout : 0} size={200} label="exposure" />
        </div>
        <SecondaryStat label="Support" value={stats.support_avg} />
      </div>

      {/* Closer */}
      <div className="mt-8 rounded-xl border border-ws-purple/25 bg-ws-soft-purple px-6 py-5 text-center">
        <p className="font-display text-2xl font-semibold text-ws-ink">
          Imagine having this visibility inside your organization — <span className="text-ws-primary">every day.</span>
        </p>
        <a href="https://wejdenspire.com/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-ws-primary hover:text-ws-primary-dark">
          wejdenspire.com ↗
        </a>
      </div>
    </div>
  );
}

function BigStat({ label, value, higherIsWorse = false, hasData }: { label: string; value: number; higherIsWorse?: boolean; hasData: boolean }) {
  const color = higherIsWorse ? riskColor(value) : riskColor(100 - value);
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-ws-border bg-white py-10">
      <span className="text-sm uppercase tracking-wider text-ws-text-dim">{label}</span>
      <span className="tnum mt-3 font-display text-8xl font-bold" style={{ color: hasData ? color : "#9AA6A8" }}>
        {hasData ? <CountUp value={value} format={(n) => Math.round(n).toString()} /> : "—"}
      </span>
    </div>
  );
}

function SecondaryStat({ label, value, higherIsWorse = false }: { label: string; value: number | null; higherIsWorse?: boolean }) {
  const v = value ?? 0;
  const color = higherIsWorse ? riskColor(v) : riskColor(100 - v);
  return (
    <div className="rounded-xl border border-ws-border bg-white px-6 py-5 text-center">
      <span className="text-xs uppercase tracking-wider text-ws-text-dim">{label}</span>
      <div className="tnum mt-1 font-display text-5xl font-bold" style={{ color: value !== null ? color : "#9AA6A8" }}>
        {value !== null ? Math.round(v) : "—"}
      </div>
    </div>
  );
}
