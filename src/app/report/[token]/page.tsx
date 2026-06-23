import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { Button, Badge, ConversionBridge } from "@/components/ws/ui";
import { formatCurrencyCompact, formatCurrencyFull, riskColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ResultRow {
  experience: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  summary: string | null;
  created_at: string;
}

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experience_results")
    .select("experience, inputs, outputs, summary, created_at")
    .eq("token", token)
    .maybeSingle();

  if (!data) notFound();
  const row = data as ResultRow;

  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="flex items-center justify-between">
          <Badge color="purple">Rapport exécutif</Badge>
          <span className="text-xs text-ws-text-dim">{new Date(row.created_at).toLocaleDateString()}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">
          {row.experience === "cost" && "Rapport de coût caché"}
          {row.experience === "risk" && "Rapport de risque des effectifs"}
          {row.experience === "dashboard" && "Rapport tableau de bord"}
          {row.experience === "roi" && "Rapport d'économies potentielles"}
        </h1>

        <div className="mt-8">
          {row.experience === "cost" && <CostReport outputs={row.outputs} inputs={row.inputs} />}
          {row.experience === "risk" && <RiskReport outputs={row.outputs} />}
          {row.experience === "dashboard" && <DashboardReport outputs={row.outputs} inputs={row.inputs} />}
          {row.experience === "roi" && <RoiReport outputs={row.outputs} />}
        </div>

        {row.summary && (
          <div className="mt-8 rounded-xl border border-ws-border bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ws-ink">Résumé exécutif</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ws-sage">{row.summary}</p>
          </div>
        )}

        <ConversionBridge className="mt-8" />

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/briefing" variant="primary">Réserver un briefing →</Button>
          <Button href="/experience" variant="ghost">Explorer plus d&apos;expériences</Button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function CostReport({ outputs, inputs }: { outputs: Record<string, unknown>; inputs: Record<string, unknown> }) {
  const hidden = Number(outputs.hiddenAnnualCost ?? 0);
  const rows = [
    ["Coût de rotation", Number(outputs.turnoverCost ?? 0)],
    ["Coût d'absentéisme", Number(outputs.absenteeismCost ?? 0)],
    ["Perte de productivité", Number(outputs.productivityLoss ?? 0)],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ws-border bg-gradient-to-br from-ws-cloud to-white p-7">
        <p className="text-xs uppercase tracking-wider text-ws-sage">Coût caché annuel estimé</p>
        <div className="tnum mt-2 font-display text-6xl font-bold text-ws-primary">{formatCurrencyCompact(hidden)}</div>
        <p className="tnum mt-2 text-sm text-ws-sage">{formatCurrencyFull(hidden)}</p>
      </div>
      <div className="rounded-xl border border-ws-border bg-white p-6">
        <p className="text-sm text-ws-sage">
          Profil : {String(inputs.employees ?? "—")} employés · {String(inputs.industry ?? "—")} · {String(inputs.turnoverRate ?? "—")}% rotation
        </p>
        <div className="mt-4 space-y-3">
          {rows.map(([label, v]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-ws-sage">{label}</span>
              <span className="tnum font-semibold text-ws-ink">{formatCurrencyFull(v)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-ws-border pt-3">
          <p className="text-sm">
            Exposition à l&apos;épuisement :{" "}
            <span className="font-semibold" style={{ color: riskColor(Number(outputs.burnoutScore ?? 0)) }}>
              {String(outputs.burnoutExposure ?? "—")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskReport({ outputs }: { outputs: Record<string, unknown> }) {
  const overall = Number(outputs.overall ?? 0);
  const categories = (outputs.categories as { category: string; score: number }[] | undefined) ?? [];
  const recs = (outputs.recommendations as string[] | undefined) ?? [];
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ws-border bg-white p-7 text-center">
        <p className="text-xs uppercase tracking-wider text-ws-sage">Score de risque des effectifs</p>
        <div className="tnum mt-2 font-display text-7xl font-bold" style={{ color: riskColor(100 - overall) }}>{overall}</div>
        <p className="mt-1 text-sm font-medium text-ws-sage">{String(outputs.band ?? "")}</p>
      </div>
      <div className="rounded-xl border border-ws-border bg-white p-6">
        <div className="space-y-2.5">
          {categories.map((c) => (
            <div key={c.category} className="flex justify-between text-sm">
              <span className="text-ws-sage">{c.category}</span>
              <span className="tnum font-semibold" style={{ color: riskColor(100 - c.score) }}>{c.score}</span>
            </div>
          ))}
        </div>
        {recs.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-ws-border pt-4">
            {recs.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-ws-sage"><span className="text-ws-primary">▸</span>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DashboardReport({ outputs, inputs }: { outputs: Record<string, unknown>; inputs: Record<string, unknown> }) {
  const metrics = (outputs.metrics as { label: string; value: number; unit: string }[] | undefined) ?? [];
  return (
    <div className="rounded-xl border border-ws-border bg-white p-6">
      <p className="text-sm text-ws-sage">Simulé pour {String(inputs.industry ?? "—")} · {String(inputs.size ?? "—")} employés</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex justify-between rounded-lg border border-ws-border bg-ws-cloud px-4 py-3 text-sm">
            <span className="text-ws-sage">{m.label}</span>
            <span className="tnum font-semibold" style={{ color: riskColor(Math.abs(m.value) * (m.unit === "percent" ? 4 : 1)) }}>
              {m.unit === "percent" ? `${m.value > 0 ? "+" : ""}${m.value.toFixed(1)}%` : Math.round(m.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoiReport({ outputs }: { outputs: Record<string, unknown> }) {
  const annualSavings = Number(outputs.annualSavings ?? 0);
  const threeYearValue = Number(outputs.threeYearValue ?? 0);
  const perEmployeeSaving = Number(outputs.perEmployeeSaving ?? 0);
  const savingsRate = Number(outputs.savingsRate ?? 0);
  const rows = [
    ["Économies cumulées sur 3 ans", formatCurrencyFull(threeYearValue)],
    ["Part du coût caché évitée", `${Math.round(savingsRate * 100)} %`],
    ["Économie par employé / an", formatCurrencyFull(perEmployeeSaving)],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ws-border bg-gradient-to-br from-ws-cloud to-white p-7">
        <p className="text-xs uppercase tracking-wider text-ws-sage">Économies annuelles potentielles</p>
        <div className="tnum mt-2 font-display text-6xl font-bold text-ws-primary">{formatCurrencyCompact(annualSavings)}</div>
        <p className="tnum mt-2 text-sm text-ws-sage">{formatCurrencyFull(annualSavings)}</p>
      </div>
      <div className="rounded-xl border border-ws-border bg-white p-6">
        <div className="space-y-3">
          {rows.map(([label, v]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-ws-sage">{label}</span>
              <span className="tnum font-semibold text-ws-ink">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
