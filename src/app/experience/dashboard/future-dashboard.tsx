"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { generateDashboard, type DashboardSnapshot } from "@/lib/domain/dashboard-generator";
import { INDUSTRIES, COMPANY_SIZES, type CompanySize, type Industry } from "@/lib/domain/types";
import { MetricTile } from "@/components/ws/metric-tile";
import { Heatmap } from "@/components/ws/heatmap";
import { Button, Badge, LiveDot, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { t } from "@/lib/i18n";

export function FutureDashboard() {
  const router = useRouter();
  const [industry, setIndustry] = useState<Industry>("Healthcare");
  const [size, setSize] = useState<CompanySize>("500–1000");
  const [generated, setGenerated] = useState(false);
  const [building, setBuilding] = useState(false);
  const [tick, setTick] = useState(0);
  const [snap, setSnap] = useState<DashboardSnapshot | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const feedRef = useRef<string[]>([]);

  // Live tick once generated.
  useEffect(() => {
    if (!generated) return;
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, [generated]);

  useEffect(() => {
    if (!generated) return;
    const s = generateDashboard(industry, size, tick);
    setSnap(s);
    feedRef.current = [...s.feed, ...feedRef.current].slice(0, 6);
  }, [generated, industry, size, tick]);

  function generate() {
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setGenerated(true);
      setTick(0);
    }, 1400);
  }

  if (!generated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12">
        <Badge color="purple">{t("dashboard.badge")}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">{t("dashboard.genTitle")}</h1>
        <p className="mt-2 text-ws-sage">{t("dashboard.genSub")}</p>

        <div className="mt-8 space-y-4 rounded-xl border border-ws-border bg-white p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ws-sage">{t("dashboard.industry")}</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value as Industry)} className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ws-sage">{t("dashboard.size")}</label>
            <select value={size} onChange={(e) => setSize(e.target.value as CompanySize)} className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
              {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} {t("dashboard.employeesSuffix")}</option>)}
            </select>
          </div>
          <Button variant="primary" className="w-full" onClick={generate} disabled={building}>
            {building ? t("dashboard.building") : t("dashboard.generate")}
          </Button>
        </div>
      </div>
    );
  }

  if (building || !snap) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-5">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-ws-border border-t-ws-primary" />
          <p className="mt-4 text-ws-sage">{t("dashboard.compiling")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      {/* Terminal header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-ws-border bg-ws-cloud px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold tracking-tight text-ws-primary">{t("dashboard.terminal")}</span>
          <span className="text-ws-text-dim">·</span>
          <span className="text-sm text-ws-sage">{industry} · {size}</span>
          <Badge color="purple" className="ml-1">{t("common.simulated")}</Badge>
        </div>
        <LiveDot />
      </div>

      <div className="rounded-b-xl border border-t-0 border-ws-border bg-ws-cloud p-5">
        {/* KPI grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snap.metrics.map((m) => (
            <MetricTile key={m.key} label={m.label} value={m.value} unit={m.unit} delta={m.delta} spark={m.spark} higherIsWorse={m.higherIsWorse} />
          ))}
        </div>

        {/* Heatmap + feed */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-lg border border-ws-border bg-ws-cloud p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ws-ink">{t("dashboard.heatmap")}</h3>
              <span className="text-[11px] text-ws-text-dim">{t("dashboard.heatmapSub")}</span>
            </div>
            <Heatmap data={snap.heatmap} rows={snap.departments} cols={snap.weeks} />
          </div>

          <div className="rounded-lg border border-ws-border bg-ws-cloud p-5">
            <h3 className="mb-3 text-sm font-semibold text-ws-ink">{t("dashboard.feed")}</h3>
            <ul className="space-y-2">
              {feedRef.current.map((f, i) => (
                <li key={`${f}-${i}`} className="flex items-start gap-2 text-xs text-ws-sage animate-ws-rise">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ws-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-ws-purple/25 bg-ws-soft-purple px-5 py-4 text-center">
        <p className="font-display text-lg font-semibold text-ws-ink">{t("dashboard.futureLine")}</p>
        <p className="mt-1 text-sm text-ws-sage">{t("dashboard.futureSub")}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("dashboard.getCta")}</Button>
        <Button variant="ghost" onClick={() => setGenerated(false)}>{t("dashboard.change")}</Button>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Obtenir ce tableau de bord pour mon entreprise"
        sourceExperience="dashboard"
        experiencesCompleted={1}
        result={{ experience: "dashboard", inputs: { industry, size }, outputs: { metrics: snap.metrics } }}
        onSuccess={(token) => { if (token) router.push(`/report/${token}`); }}
      />
    </div>
  );
}
