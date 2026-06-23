"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateMoodTrend } from "@/lib/domain/mood-trends";
import { INDUSTRIES, COMPANY_SIZES, type CompanySize, type Industry } from "@/lib/domain/types";
import { TrendChart } from "@/components/ws/trend-chart";
import { Button, Badge, LiveDot, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { riskColor } from "@/lib/utils";

interface Props {
  live: { positiveAvg: number | null; negativeAvg: number | null; count: number } | null;
}

export function MoodTrends({ live }: Props) {
  const router = useRouter();
  const [industry, setIndustry] = useState<Industry>("Technology");
  const [size, setSize] = useState<CompanySize>("500–1000");
  const [leadOpen, setLeadOpen] = useState(false);

  const trend = useMemo(() => generateMoodTrend(industry, size, live ?? undefined), [industry, size, live]);
  const now = trend.points[trend.points.length - 1];
  const first = trend.points[0];
  const negDelta = now.negative - first.negative;
  const inIntervention = now.wellbeing < trend.interventionThreshold;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge color="primary">Experience 06</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">Mood Trends</h1>
          <p className="mt-1 text-ws-sage">How a workforce&apos;s emotional affect drifts over 10 weeks — the early warning before attrition.</p>
        </div>
        {trend.liveCount > 0 && (
          <div className="flex items-center gap-2">
            <LiveDot label={`${trend.liveCount} live`} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap gap-3">
        <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} className="rounded-xl border border-ws-border bg-white px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value as CompanySize)} className="rounded-xl border border-ws-border bg-white px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
        </select>
        <Badge color="purple">simulated</Badge>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-ws-border bg-white p-6 shadow-ws-card">
        <TrendChart points={trend.points} interventionThreshold={trend.interventionThreshold} />
      </div>

      {/* Read-out */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Negative affect (now)" value={now.negative} delta={negDelta} higherIsWorse />
        <Stat label="Positive affect (now)" value={now.positive} delta={now.positive - first.positive} />
        <div className="rounded-2xl border border-ws-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Wellbeing index</p>
          <p className="tnum mt-1 font-display text-3xl font-bold" style={{ color: riskColor(100 - now.wellbeing) }}>{now.wellbeing}</p>
          {inIntervention && <p className="mt-0.5 text-xs font-medium text-ws-red">Below intervention threshold</p>}
        </div>
      </div>

      {/* Narrative */}
      <div className="mt-5 rounded-2xl border border-ws-border bg-ws-cloud p-5 text-sm text-ws-ink">
        Over these 10 weeks, <span className="font-semibold text-ws-purple-dark">negative affect rose {negDelta > 0 ? `+${negDelta}` : negDelta}</span> while positive energy
        {now.positive - first.positive < 0 ? " slipped" : " held"}. {trend.liveCount > 0
          ? <>The final point includes <span className="font-semibold text-ws-primary">{trend.liveCount} real check-in{trend.liveCount === 1 ? "" : "s"}</span> from this event — that pulsing dot is live.</>
          : <>Add a mood check-in and watch a real point land on the &quot;Now&quot; edge.</>}
      </div>

      <ConversionBridge className="mt-6" text="This is a simulation. Imagine seeing your real workforce — every week, before strain becomes attrition." />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setLeadOpen(true)}>Get this for my company →</Button>
        <Button variant="ghost" onClick={() => router.push("/for-teams")}>Give my team a wellbeing space</Button>
        <Button variant="ghost" onClick={() => router.push("/employee")}>Add a mood check-in</Button>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Get mood trends for my company"
        sourceExperience="dashboard"
        experiencesCompleted={1}
        result={{ experience: "dashboard", inputs: { industry, size }, outputs: { now } }}
        onSuccess={(token) => { if (token) router.push(`/report/${token}`); }}
      />
    </div>
  );
}

function Stat({ label, value, delta, higherIsWorse = false }: { label: string; value: number; delta: number; higherIsWorse?: boolean }) {
  const deltaBad = higherIsWorse ? delta > 0 : delta < 0;
  return (
    <div className="rounded-2xl border border-ws-border bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ws-text-lo">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="tnum font-display text-3xl font-bold text-ws-ink">{value}</p>
        {delta !== 0 && (
          <span className={`tnum text-xs font-semibold ${deltaBad ? "text-ws-red" : "text-ws-primary"}`}>
            {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
          </span>
        )}
      </div>
    </div>
  );
}
