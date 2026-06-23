"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateRoi, defaultInvestment, type RoiInputs } from "@/lib/domain/roi-calculator";
import { INDUSTRIES, type Industry } from "@/lib/domain/types";
import { CountUp } from "@/components/ws/count-up";
import { Button, Badge, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { formatCurrencyCompact, formatCurrencyFull } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function RoiCalculator() {
  const router = useRouter();
  const [employees, setEmployees] = useState(500);
  const [input, setInput] = useState<Omit<RoiInputs, "employees">>({
    avgSalary: 24000,
    turnoverRate: 10,
    sickDays: 6,
    industry: "Manufacturing",
    investment: defaultInvestment(500),
    turnoverReduction: 0.15,
    absenceReduction: 0.1,
    productivityRecovery: 0.08,
  });

  const [leadOpen, setLeadOpen] = useState(false);

  const full: RoiInputs = { employees, ...input };
  const result = useMemo(() => calculateRoi(full), [full]);

  const savingsParts = [
    { label: t("roi.fromTurnover"), value: result.turnoverSavings, color: "#4AAA83" },
    { label: t("roi.fromAbsence"), value: result.absenceSavings, color: "#7FAEDB" },
    { label: t("roi.fromProductivity"), value: result.productivitySavings, color: "#9A8BD6" },
  ];
  const maxBar = Math.max(result.annualSavings, input.investment, 1);

  function setEmp(v: number) {
    setEmployees(v);
    // keep investment in step with size unless user has overridden it heavily
    setInput((s) => ({ ...s, investment: defaultInvestment(v) }));
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-6">
        <Badge color="primary">{t("roi.badge")}</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">{t("roi.title")}</h1>
        <p className="mt-1 text-ws-sage">{t("roi.sub")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Inputs */}
        <div className="space-y-5 rounded-2xl border border-ws-border bg-white p-6">
          <NumberInput label={t("roi.employees")} value={employees} min={1} max={50000} step={10} onChange={setEmp} />
          <NumberInput label={t("roi.avgSalary")} value={input.avgSalary} min={6000} max={200000} step={500} onChange={(v) => setInput({ ...input, avgSalary: v })} fmt={(n) => formatCurrencyFull(n)} />
          <NumberInput label={t("roi.turnover")} value={input.turnoverRate} min={0} max={60} step={0.5} onChange={(v) => setInput({ ...input, turnoverRate: v })} />
          <NumberInput label={t("roi.sickDays")} value={input.sickDays} min={0} max={40} step={0.1} onChange={(v) => setInput({ ...input, sickDays: v })} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ws-sage">{t("cost.industry")}</label>
            <select value={input.industry} onChange={(e) => setInput({ ...input, industry: e.target.value as Industry })} className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <NumberInput label={t("roi.investment")} value={input.investment} min={1000} max={2000000} step={1000} onChange={(v) => setInput({ ...input, investment: v })} fmt={(n) => formatCurrencyFull(n)} />

          {/* Assumptions */}
          <div className="rounded-xl border border-ws-border bg-ws-cloud p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ws-sage">{t("roi.assumptions")}</p>
            <PercentInput label={t("roi.turnoverRed")} value={input.turnoverReduction} onChange={(v) => setInput({ ...input, turnoverReduction: v })} />
            <PercentInput label={t("roi.absenceRed")} value={input.absenceReduction} onChange={(v) => setInput({ ...input, absenceReduction: v })} />
            <PercentInput label={t("roi.productivityRec")} value={input.productivityRecovery} onChange={(v) => setInput({ ...input, productivityRecovery: v })} />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5">
          {/* Hero numbers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ws-border bg-gradient-to-br from-ws-cloud to-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ws-sage">{t("roi.annualSavings")}</p>
              <div className="tnum mt-2 font-display text-5xl font-bold text-ws-primary">
                <CountUp value={result.annualSavings} format={formatCurrencyCompact} />
              </div>
              <p className="tnum mt-1 text-sm text-ws-sage">{formatCurrencyFull(result.annualSavings)}</p>
            </div>
            <div className="rounded-2xl border border-ws-border bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ws-sage">{t("roi.roiPct")}</p>
              <div className="tnum mt-2 font-display text-5xl font-bold text-ws-purple-dark">
                <CountUp value={Math.max(0, result.roiPct)} format={(n) => `${Math.round(n)} %`} />
              </div>
              <p className="tnum mt-1 text-sm text-ws-sage">{t("roi.netGain")}: {formatCurrencyFull(result.netGain)}</p>
            </div>
          </div>

          {/* Payback + 3yr */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Tile label={t("roi.payback")} value={isFinite(result.paybackMonths) ? `${result.paybackMonths.toFixed(1)} ${t("roi.paybackMonths")}` : "—"} />
            <Tile label={t("roi.threeYear")} value={formatCurrencyCompact(result.threeYearValue)} />
          </div>

          {/* Savings vs investment bars */}
          <div className="rounded-2xl border border-ws-border bg-white p-6">
            <h3 className="text-sm font-semibold text-ws-ink">{t("roi.savingsVsInvest")}</h3>
            <div className="mt-4 space-y-3">
              <Bar label={t("roi.savings")} value={result.annualSavings} max={maxBar} color="#4AAA83" />
              <Bar label={t("roi.invest")} value={input.investment} max={maxBar} color="#9A8BD6" />
            </div>
          </div>

          {/* Where savings come from */}
          <div className="rounded-2xl border border-ws-border bg-white p-6">
            <h3 className="text-sm font-semibold text-ws-ink">{t("roi.breakdownTitle")}</h3>
            <div className="mt-4 space-y-3">
              {savingsParts.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ws-sage">{p.label}</span>
                    <span className="tnum font-semibold text-ws-ink">{formatCurrencyCompact(p.value)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ws-cloud">
                    <div className="h-full rounded-full" style={{ width: `${(p.value / Math.max(result.annualSavings, 1)) * 100}%`, backgroundColor: p.color, transition: "width 0.6s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ConversionBridge text={t("roi.bridge")} />

          <p className="rounded-xl border border-ws-border bg-ws-cloud px-4 py-3 text-xs leading-relaxed text-ws-sage">
            {t("cost.disclaimerTun")}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("roi.cta")}</Button>
            <Button variant="ghost" onClick={() => router.push("/experience/cost-calculator")}>{t("cost.title")}</Button>
          </div>
        </div>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title={t("roi.cta")}
        sourceExperience="cost"
        experiencesCompleted={1}
        hiddenCost={result.annualSavings}
        result={{ experience: "roi", inputs: { ...full }, outputs: { ...result } }}
        onSuccess={(token) => { if (token) router.push(`/report/${token}`); }}
      />
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ws-border bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-ws-sage">{label}</p>
      <p className="tnum mt-2 font-display text-3xl font-bold text-ws-ink">{value}</p>
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-ws-sage">{label}</span>
        <span className="tnum font-semibold text-ws-ink">{formatCurrencyCompact(value)}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-ws-cloud">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color, transition: "width 0.6s" }} />
      </div>
    </div>
  );
}

function NumberInput({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (n: number) => string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-ws-sage">{label}</label>
        <span className="tnum text-sm font-semibold text-ws-primary">{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className="w-full accent-ws-primary" style={{ height: 6 }} />
      <input type="number" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="tnum mt-2 w-full rounded-md border border-ws-border bg-ws-cloud px-2.5 py-1.5 text-sm text-ws-ink outline-none focus:border-ws-primary" />
    </div>
  );
}

function PercentInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs text-ws-sage">{label}</label>
        <span className="tnum text-xs font-semibold text-ws-ink">{Math.round(value * 100)} %</span>
      </div>
      <input type="range" min={0} max={0.4} step={0.01} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className="w-full accent-ws-primary" style={{ height: 5 }} />
    </div>
  );
}
