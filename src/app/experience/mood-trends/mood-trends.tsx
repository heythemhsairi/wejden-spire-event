"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { generateMoodTrend } from "@/lib/domain/mood-trends";
import { INDUSTRIES, COMPANY_SIZES, type CompanySize, type Industry } from "@/lib/domain/types";
import { TrendChart } from "@/components/ws/trend-chart";
import { Button, Badge, LiveDot, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { riskColor } from "@/lib/utils";
import { t } from "@/lib/i18n";

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
          <Badge color="primary">{t("moodTrends.badge")}</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">{t("moodTrends.title")}</h1>
          <p className="mt-1 text-ws-sage">{t("moodTrends.sub")}</p>
        </div>
        {trend.liveCount > 0 && (
          <div className="flex items-center gap-2">
            <LiveDot label={`${trend.liveCount} ${t("common.live")}`} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap gap-3">
        <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} className="rounded-xl border border-ws-border bg-white px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value as CompanySize)} className="rounded-xl border border-ws-border bg-white px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} {t("dashboard.employeesSuffix")}</option>)}
        </select>
        <Badge color="purple">{t("common.simulated")}</Badge>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-ws-border bg-white p-6 shadow-ws-card">
        <TrendChart points={trend.points} interventionThreshold={trend.interventionThreshold} />
      </div>

      {/* Read-out */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label={t("moodTrends.negNow")} value={now.negative} delta={negDelta} higherIsWorse />
        <Stat label={t("moodTrends.posNow")} value={now.positive} delta={now.positive - first.positive} />
        <div className="rounded-2xl border border-ws-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ws-text-lo">{t("moodTrends.wellbeingIndex")}</p>
          <p className="tnum mt-1 font-display text-3xl font-bold" style={{ color: riskColor(100 - now.wellbeing) }}>{now.wellbeing}</p>
          {inIntervention && <p className="mt-0.5 text-xs font-medium text-ws-red">{t("moodTrends.belowThreshold")}</p>}
        </div>
      </div>

      {/* Narrative */}
      <div className="mt-5 rounded-2xl border border-ws-border bg-ws-cloud p-5 text-sm text-ws-ink">
        Sur ces 10 semaines, <span className="font-semibold text-ws-purple-dark">l&apos;affect négatif a augmenté de {negDelta > 0 ? `+${negDelta}` : negDelta}</span> tandis que l&apos;énergie positive
        {now.positive - first.positive < 0 ? " a reculé" : " s'est maintenue"}. {trend.liveCount > 0
          ? <>Le dernier point inclut <span className="font-semibold text-ws-primary">{trend.liveCount} check-in{trend.liveCount === 1 ? "" : "s"} réel{trend.liveCount === 1 ? "" : "s"}</span> de cet événement — ce point clignotant est en direct.</>
          : <>Ajoutez un check-in d&apos;humeur et regardez un point réel apparaître au bord « Maintenant ».</>}
      </div>

      <ConversionBridge className="mt-6" text={t("moodTrends.bridge")} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("dashboard.getCta")}</Button>
        <Button variant="ghost" onClick={() => router.push("/for-teams")}>{t("moodTrends.giveTeam")}</Button>
        <Button variant="ghost" onClick={() => router.push("/employee")}>{t("moodTrends.addCheckin")}</Button>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Obtenir les tendances d'humeur pour mon entreprise"
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
