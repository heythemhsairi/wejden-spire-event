"use client";

import { useState } from "react";
import Link from "next/link";
import { submitPulse } from "@/app/actions/pulse";
import { SignalSlider } from "@/components/ws/signal-slider";
import { Button, Badge } from "@/components/ws/ui";
import { LeadModal } from "@/components/ws/lead-modal";

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
        <h1 className="mt-4 font-display text-2xl font-bold text-ws-ink">Signal added.</h1>
        <p className="tnum mt-2 text-lg text-ws-sage">
          You&apos;re participant <span className="font-bold text-ws-primary">#{submitted}</span> of the live pulse.
        </p>
        <p className="mt-4 text-ws-sage">Imagine having this visibility inside your organization — every day.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" onClick={() => setLeadOpen(true)}>Want this in my org →</Button>
          <Link href="/pulse/live" className="text-sm text-ws-primary underline">See the live wall</Link>
        </div>
        <LeadModal
          open={leadOpen}
          onClose={() => setLeadOpen(false)}
          title="Bring this visibility to my organization"
          sourceExperience="pulse"
          experiencesCompleted={1}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <Badge color="primary">Experience 05</Badge>
      <h1 className="mt-3 font-display text-2xl font-bold text-ws-ink">30 seconds. 5 signals.</h1>
      <p className="mt-1 text-ws-sage">Anonymous. Your input joins the live workforce pulse of the room.</p>

      <div className="mt-8 space-y-6 rounded-xl border border-ws-border bg-white p-6">
        <SignalSlider label="Energy level" value={signals.energy} onChange={(v) => setSignals({ ...signals, energy: v })} leftLabel="Depleted" rightLabel="Energized" />
        <SignalSlider label="Workload pressure" value={signals.workload} higherIsWorse onChange={(v) => setSignals({ ...signals, workload: v })} leftLabel="Manageable" rightLabel="Overwhelming" />
        <SignalSlider label="Psychological safety" value={signals.psychSafety} onChange={(v) => setSignals({ ...signals, psychSafety: v })} leftLabel="Low" rightLabel="High" />
        <SignalSlider label="Support" value={signals.support} onChange={(v) => setSignals({ ...signals, support: v })} leftLabel="Unsupported" rightLabel="Well supported" />
        <SignalSlider label="Stress level" value={signals.stress} higherIsWorse onChange={(v) => setSignals({ ...signals, stress: v })} leftLabel="Calm" rightLabel="High stress" />
      </div>

      {error && <p className="mt-3 text-sm text-ws-red">{error}</p>}

      <Button variant="primary" className="mt-5 w-full" onClick={submit} disabled={busy}>
        {busy ? "Adding…" : "Add my signal ▸"}
      </Button>
    </div>
  );
}
