"use client";

import { useState } from "react";
import Link from "next/link";
import { submitPulse } from "@/app/actions/pulse";
import { SignalSlider } from "@/components/ws/signal-slider";
import { Button, Badge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";
import { t } from "@/lib/i18n";

export function PulseInput() {
  const [signals, setSignals] = useState({ energy: 50, workload: 50, psychSafety: 50, support: 50, stress: 50 });
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await submitPulse(signals);
    setBusy(false);
    if (res.ok) setSubmitted(res.participantNumber);
    else setError(res.error);
  }

  if (submitted !== null) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <div className="text-4xl">✓</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-ws-ink">{t("pulse.addedTitle")}</h1>
        <p className="tnum mt-2 text-lg text-ws-sage">
          {t("pulse.participant")} <span className="font-bold text-ws-primary">#{submitted}</span> {t("pulse.ofPulse")}
        </p>
        <p className="mt-4 text-ws-sage">{t("pulse.imagine")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" onClick={() => setLeadOpen(true)}>{t("pulse.wantOrg")}</Button>
          <Link href="/pulse/live" className="text-sm text-ws-primary underline">{t("pulse.seeWall")}</Link>
        </div>
        <LeadModal
          open={leadOpen}
          onClose={() => setLeadOpen(false)}
          title="Apporter cette visibilité à mon organisation"
          sourceExperience="pulse"
          experiencesCompleted={1}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <Badge color="primary">{t("pulse.badge")}</Badge>
      <h1 className="mt-3 font-display text-2xl font-bold text-ws-ink">{t("pulse.title")}</h1>
      <p className="mt-1 text-ws-sage">{t("pulse.sub")}</p>

      <div className="mt-8 space-y-6 rounded-xl border border-ws-border bg-white p-6">
        <SignalSlider label={t("pulse.energy")} value={signals.energy} onChange={(v) => setSignals({ ...signals, energy: v })} leftLabel={t("pulse.energyL")} rightLabel={t("pulse.energyR")} />
        <SignalSlider label={t("pulse.workload")} value={signals.workload} higherIsWorse onChange={(v) => setSignals({ ...signals, workload: v })} leftLabel={t("pulse.workloadL")} rightLabel={t("pulse.workloadR")} />
        <SignalSlider label={t("pulse.safety")} value={signals.psychSafety} onChange={(v) => setSignals({ ...signals, psychSafety: v })} leftLabel={t("pulse.safetyL")} rightLabel={t("pulse.safetyR")} />
        <SignalSlider label={t("pulse.support")} value={signals.support} onChange={(v) => setSignals({ ...signals, support: v })} leftLabel={t("pulse.supportL")} rightLabel={t("pulse.supportR")} />
        <SignalSlider label={t("pulse.stress")} value={signals.stress} higherIsWorse onChange={(v) => setSignals({ ...signals, stress: v })} leftLabel={t("pulse.stressL")} rightLabel={t("pulse.stressR")} />
      </div>

      {error && <p className="mt-3 text-sm text-ws-red">{error}</p>}

      <Button variant="primary" className="mt-5 w-full" onClick={submit} disabled={busy}>
        {busy ? t("pulse.adding") : t("pulse.add")}
      </Button>
    </div>
  );
}
