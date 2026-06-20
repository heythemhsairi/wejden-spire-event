"use client";

import { useMemo, useState } from "react";
import { calculateHiddenCost, type CostInputs } from "@/lib/domain/cost-calculator";
import { INDUSTRIES, type Industry } from "@/lib/domain/types";
import { CountUp } from "@/components/ws/count-up";
import { Button, Badge, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { formatCurrencyCompact, formatCurrencyFull, riskColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CostCalculator() {
  const router = useRouter();
  const [input, setInput] = useState<CostInputs>({
    employees: 250,
    turnoverRate: 14,
    avgSalary: 48000,
    sickDays: 9.2,
    industry: "Manufacturing",
  });
  const [leadOpen, setLeadOpen] = useState(false);

  const result = useMemo(() => calculateHiddenCost(input), [input]);

  const breakdown = [
    { label: "Turnover cost", value: result.turnoverCost, color: "#E06A5C" },
    { label: "Absenteeism", value: result.absenteeismCost, color: "#E0843C" },
    { label: "Productivity loss", value: result.productivityLoss, color: "#7FAEDB" },
  ];
  const maxBreak = Math.max(...breakdown.map((b) => b.value), 1);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-6">
        <Badge color="primary">Experience 01</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">Hidden Cost Calculator</h1>
        <p className="mt-1 text-ws-sage">Adjust the inputs. The report recalculates live.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Input panel */}
        <div className="space-y-5 rounded-xl border border-ws-border bg-white p-6">
          <NumberInput label="Number of employees" value={input.employees} min={1} max={50000} step={10} onChange={(v) => setInput({ ...input, employees: v })} />
          <NumberInput label="Turnover rate (%)" value={input.turnoverRate} min={0} max={60} step={0.5} onChange={(v) => setInput({ ...input, turnoverRate: v })} />
          <NumberInput label="Average salary (€)" value={input.avgSalary} min={10000} max={250000} step={1000} onChange={(v) => setInput({ ...input, avgSalary: v })} fmt={(n) => `€${n.toLocaleString()}`} />
          <NumberInput label="Sick leave days / employee / yr" value={input.sickDays} min={0} max={40} step={0.1} onChange={(v) => setInput({ ...input, sickDays: v })} />
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ws-sage">Industry</label>
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
            <p className="text-xs font-medium uppercase tracking-wider text-ws-sage">Estimated annual hidden cost</p>
            <div className="tnum mt-2 font-display text-6xl font-bold text-ws-primary sm:text-7xl">
              <CountUp value={result.hiddenAnnualCost} format={formatCurrencyCompact} />
            </div>
            <p className="tnum mt-2 text-sm text-ws-sage">
              {formatCurrencyFull(result.hiddenAnnualCost)} · {formatCurrencyFull(result.costPerEmployee)} per employee
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Breakdown */}
            <div className="rounded-xl border border-ws-border bg-white p-6">
              <h3 className="text-sm font-semibold text-ws-ink">Cost breakdown</h3>
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
              <h3 className="text-sm font-semibold text-ws-ink">Risk indicators</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ws-sage">Burnout exposure</p>
                  <p className="tnum mt-1 font-display text-2xl font-bold" style={{ color: riskColor(result.burnoutScore) }}>
                    {result.burnoutExposure}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ws-sage">vs industry median</p>
                  <p className="tnum mt-1 font-display text-2xl font-bold text-ws-ink">
                    {result.benchmarkMultiple >= 1 ? "▲" : "▼"} {result.benchmarkMultiple.toFixed(2)}×
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ConversionBridge />

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setLeadOpen(true)}>Get the full report →</Button>
            <Button variant="ghost" onClick={() => router.push("/experience/risk-scanner")}>Run the Risk Scanner</Button>
          </div>
        </div>
      </div>

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
