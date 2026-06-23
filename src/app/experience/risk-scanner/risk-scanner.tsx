"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SCAN_QUESTIONS, scoreScan } from "@/lib/domain/risk-scanner";
import { RadialGauge } from "@/components/ws/radial-gauge";
import { RiskBar } from "@/components/ws/risk-bar";
import { Button, Badge, ConversionBridge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { t } from "@/lib/i18n";

export function RiskScanner() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..9 questions, 10 = result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [leadOpen, setLeadOpen] = useState(false);

  const total = SCAN_QUESTIONS.length;
  const done = step >= total;
  const q = done ? null : SCAN_QUESTIONS[step];
  const result = useMemo(() => (done ? scoreScan(answers) : null), [done, answers]);

  function answer(optionIndex: number) {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: optionIndex }));
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  if (!done && q) {
    const current = answers[q.id];
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Badge color="primary">{t("risk.badge")}</Badge>
          <span className="tnum text-sm text-ws-sage">{t("risk.questionOf", { n: step + 1, total })}</span>
        </div>
        <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-ws-cloud">
          <div className="h-full rounded-full bg-ws-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-ws-primary">{q.category}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold leading-snug text-ws-ink">{q.text}</h1>

        <div className="mt-6 space-y-2.5">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3.5 text-left text-sm transition-all ${
                current === i
                  ? "border-ws-primary bg-ws-primary/10 text-ws-ink"
                  : "border-ws-border bg-white text-ws-sage hover:border-ws-primary/50 hover:text-ws-ink"
              }`}
            >
              <span>{opt}</span>
              <span className="text-ws-text-dim">{i === 0 ? t("risk.lowest") : i === 4 ? t("risk.highest") : ""}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>← {t("common.back")}</Button>
          )}
        </div>
      </div>
    );
  }

  // Result
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Badge color="primary">{t("risk.resultBadge")}</Badge>
      <h1 className="mt-3 font-display text-3xl font-bold text-ws-ink">{t("risk.title")}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex flex-col items-center">
          <RadialGauge value={result!.overall} label="/ 100" sublabel={result!.band} invertColor />
          <p className="mt-3 max-w-[200px] text-center text-xs text-ws-sage">
            {t("risk.higherBetter")}
          </p>
        </div>
        <div className="space-y-3.5">
          {result!.categories.map((c) => (
            <RiskBar key={c.category} label={c.category} value={c.score} maturity />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-ws-border bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-ws-ink">{t("risk.recommendations")}</h3>
        <ul className="mt-3 space-y-2.5">
          {result!.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-ws-sage">
              <span className="tnum font-display font-bold text-ws-primary">0{i + 1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <ConversionBridge className="mt-6" text={t("risk.bridge")} />

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("risk.download")}</Button>
        <Button variant="ghost" onClick={() => { setStep(0); setAnswers({}); }}>{t("common.retake")}</Button>
        <Button variant="ghost" onClick={() => router.push("/experience/dashboard")}>{t("risk.seeDashboard")}</Button>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        sourceExperience="risk"
        experiencesCompleted={1}
        result={{ experience: "risk", inputs: { answers }, outputs: { ...result } }}
        onSuccess={(token) => { if (token) router.push(`/report/${token}`); }}
      />
    </div>
  );
}
