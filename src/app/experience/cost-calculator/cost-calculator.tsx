"use client";

import { useMemo, useState } from "react";
import { calculateHiddenCost, type CostInputs } from "@/lib/domain/cost-calculator";
import { INDUSTRIES, type Industry } from "@/lib/domain/types";
import { CountUp } from "@/components/ws/count-up";
import { Button, Badge, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { formatCurrencyCompact, formatCurrencyFull, riskColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import type { TurnoverBand } from "@/lib/domain/cost-calculator";
import { InterpretationGrid } from "@/components/ws/interpretation-grid";
import { COST_COMPONENTS, TURNOVER_ACTIONS } from "@/lib/domain/interpretation-grid";

function turnoverBandColor(band: TurnoverBand): string {
  return band === "Critique" || band === "Risque élevé"
    ? "#E06A5C"
    : band === "Alerte RH"
      ? "#E0843C"
      : band === "Vigilance"
        ? "#E0A23C"
        : "#4AAA83";
}

export function CostCalculator() {
  const router = useRouter();
  const [input, setInput] = useState<CostInputs>({
    employees: 500,
    turnoverRate: 10,
    avgSalary: 24000,
    sickDays: 6,
    industry: "Manufacturing",
  });
  const [leadOpen, setLeadOpen] = useState(false);

  const result = useMemo(() => calculateHiddenCost(input), [input]);

  const breakdown = [
    { label: t("cost.turnoverCost"), value: result.turnoverCost, color: "#E06A5C" },
    { label: t("cost.absenteeism"), value: result.absenteeismCost, color: "#E0843C" },
    { label: t("cost.productivityLoss"), value: result.productivityLoss, color: "#7FAEDB" },
  ];
  const maxBreak = Math.max(...breakdown.map((b) => b.value), 1);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-6">
        <Badge color="primary">{t("cost.badge")}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">{t("cost.title")}</h1>
        <p className="mt-1 text-ws-sage">{t("cost.sub")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Input panel */}
        <div className="space-y-5 rounded-xl border border-ws-border bg-white p-6">
          <NumberInput label={t("cost.employees")} value={input.employees} min={1} max={50000} step={10} onChange={(v) => setInput({ ...input, employees: v })} />
          <NumberInput label={t("cost.turnover")} value={input.turnoverRate} min={0} max={60} step={0.5} onChange={(v) => setInput({ ...input, turnoverRate: v })} />
          <NumberInput label={t("cost.avgSalary")} value={input.avgSalary} min={6000} max={200000} step={500} onChange={(v) => setInput({ ...input, avgSalary: v })} fmt={(n) => formatCurrencyFull(n)} />
          <NumberInput label={t("cost.sickDays")} value={input.sickDays} min={0} max={40} step={0.1} onChange={(v) => setInput({ ...input, sickDays: v })} />
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ws-sage">{t("cost.industry")}</label>
            <select
              value={input.industry}
              onChange={(e) => setInput({ ...input, industry: e.target.value as Industry })}
              className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary"
            >
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Report */}
        <div className="space-y-5">
          <div className="rounded-xl border border-ws-border bg-gradient-to-br from-ws-cloud to-white p-7">
            <p className="text-xs font-medium uppercase tracking-wider text-ws-sage">{t("cost.annualHidden")}</p>
            <div className="tnum mt-2 font-display text-6xl font-bold text-ws-primary sm:text-7xl">
              <CountUp value={result.hiddenAnnualCost} format={formatCurrencyCompact} />
            </div>
            <p className="tnum mt-2 text-sm text-ws-sage">
              {formatCurrencyFull(result.hiddenAnnualCost)} · {formatCurrencyFull(result.costPerEmployee)} {t("cost.perEmployee")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Breakdown */}
            <div className="rounded-xl border border-ws-border bg-white p-6">
              <h3 className="text-sm font-semibold text-ws-ink">{t("cost.breakdown")}</h3>
              <div className="mt-4 space-y-3">
                {breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-ws-sage">{b.label}</span>
                      <span className="tnum font-semibold text-ws-ink">{formatCurrencyCompact(b.value)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ws-cloud">
                      <div className="h-full rounded-full" style={{ width: `${(b.value / maxBreak) * 100}%`, backgroundColor: b.color, transition: "width 0.6s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exposure + benchmark */}
            <div className="rounded-xl border border-ws-border bg-white p-6">
              <h3 className="text-sm font-semibold text-ws-ink">{t("cost.riskIndicators")}</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ws-sage">{t("cost.burnoutExposure")}</p>
                  <p className="tnum mt-1 font-display text-2xl font-bold" style={{ color: riskColor(result.burnoutScore) }}>
                    {result.burnoutExposure}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ws-sage">{t("cost.turnoverStatus")}</p>
                  <p className="tnum mt-1 font-display text-2xl font-bold" style={{ color: turnoverBandColor(result.turnoverBand) }}>
                    {result.turnoverBand}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ws-text-dim">{t("cost.vigilanceNote")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic insight (client feedback) */}
          <div className="rounded-2xl border border-ws-primary/20 bg-ws-soft-green p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ws-primary-dark">{t("cost.insightTitle")}</p>
            <p className="mt-2 text-sm text-ws-ink">{t("cost.insightReduction")}</p>
            <p className="mt-2 text-sm text-ws-ink">
              {t("cost.insightQuickWin", { amount: formatCurrencyFull(result.quickWinSavings) })}
            </p>
          </div>

          <ConversionBridge />

          {/* Tunisian personalization disclaimer (client feedback) */}
          <p className="rounded-xl border border-ws-border bg-ws-cloud px-4 py-3 text-xs leading-relaxed text-ws-sage">
            {t("cost.disclaimerTun")}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("cost.getReport")}</Button>
            <Button variant="ghost" onClick={() => router.push("/experience/risk-scanner")}>{t("cost.runScanner")}</Button>
          </div>
        </div>
      </div>

      {/* What each component covers (client-provided) */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {COST_COMPONENTS.map((c) => (
          <div key={c.component} className="rounded-2xl border border-ws-border bg-white p-5">
            <h4 className="font-display text-sm font-bold text-ws-ink">{c.component}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ws-sage">{c.covers}</p>
          </div>
        ))}
      </div>

      {/* HR interpretation grid (client-provided) */}
      <div className="mt-8">
        <h3 className="font-display text-xl font-bold text-ws-ink">{t("cost.gridTitle")}</h3>
        <p className="mt-1 max-w-3xl text-sm text-ws-sage">{t("cost.gridIntro")}</p>
        <div className="mt-4">
          <InterpretationGrid />
        </div>
      </div>

      {/* Actions if turnover > 10% (client-provided) */}
      {input.turnoverRate >= 10 && (
        <div className="mt-8 rounded-2xl border border-ws-primary/20 bg-ws-soft-green p-6">
          <h3 className="font-display text-lg font-bold text-ws-ink">{t("cost.actionsTitle")}</h3>
          <ol className="mt-3 space-y-2.5">
            {TURNOVER_ACTIONS.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm text-ws-ink">
                <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ws-primary text-xs font-bold text-white">{i + 1}</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        sourceExperience="cost"
        experiencesCompleted={1}
        hiddenCost={result.hiddenAnnualCost}
        result={{
          experience: "cost",
          inputs: { ...input },
          outputs: { ...result },
        }}
        onSuccess={(token) => {
          if (token) router.push(`/report/${token}`);
        }}
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt?: (n: number) => string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-ws-sage">{label}</label>
        <span className="tnum text-sm font-semibold text-ws-primary">{fmt ? fmt(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full accent-ws-primary"
        style={{ height: 6 }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tnum mt-2 w-full rounded-md border border-ws-border bg-ws-cloud px-2.5 py-1.5 text-sm text-ws-ink outline-none focus:border-ws-primary"
      />
    </div>
  );
}
