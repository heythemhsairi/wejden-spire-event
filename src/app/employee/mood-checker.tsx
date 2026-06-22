"use client";

import { useState } from "react";
import { submitCheckin } from "@/app/actions/employee";
import { SignalSlider } from "@/components/ws/signal-slider";
import { IconCheck } from "@/components/ws/icons";
import { riskColor } from "@/lib/utils";

const MOODS = [
  { v: 10, l: "Rough" },
  { v: 30, l: "Low" },
  { v: 50, l: "Okay" },
  { v: 70, l: "Good" },
  { v: 90, l: "Great" },
];

export function MoodChecker({ codeId }: { codeId: string }) {
  const [mood, setMood] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [stress, setStress] = useState(50);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    await submitCheckin({ codeId, kind: "mood", mood, energy, stress });
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-ws-border bg-white p-8 text-center shadow-ws-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ws-soft-green text-ws-primary">
          <IconCheck size={30} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-ws-ink">Thanks for checking in.</h2>
        <p className="mt-2 text-ws-sage">
          {mood >= 60
            ? "Glad you're doing well today. A good moment to notice what's helping."
            : mood >= 40
              ? "Some days are just okay — that's completely normal. Be gentle with yourself."
              : "Sounds like a heavy day. You showed up and checked in — that counts. Consider a small break or reaching out to someone you trust."}
        </p>
        <p className="mt-4 text-sm text-ws-text-dim">Your check-in is private and anonymous.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ws-ink">How are you today?</h2>
      <p className="mt-1 text-ws-sage">Just a quick check-in. No right answers.</p>

      {/* Mood scale — brand-colored dots, no emoji */}
      <div className="mt-6 flex justify-between gap-2">
        {MOODS.map((m) => {
          const selected = Math.abs(mood - m.v) < 10;
          const dot = riskColor(100 - m.v); // green at high mood → red at low
          return (
            <button
              key={m.v}
              onClick={() => setMood(m.v)}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border py-4 transition-all ${
                selected ? "border-ws-primary bg-ws-soft-green" : "border-ws-border bg-white hover:border-ws-primary/40"
              }`}
            >
              <span
                className="rounded-full transition-all"
                style={{
                  width: selected ? 22 : 16,
                  height: selected ? 22 : 16,
                  backgroundColor: dot,
                  opacity: selected ? 1 : 0.55,
                }}
              />
              <span className={`text-xs font-medium ${selected ? "text-ws-ink" : "text-ws-sage"}`}>{m.l}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-6 rounded-2xl border border-ws-border bg-white p-6">
        <SignalSlider label="Energy" value={energy} onChange={setEnergy} leftLabel="Drained" rightLabel="Energized" />
        <SignalSlider label="Stress" value={stress} higherIsWorse onChange={setStress} leftLabel="Calm" rightLabel="High" />
      </div>

      <button onClick={submit} disabled={busy} className="mt-6 w-full rounded-full bg-ws-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-ws-primary-dark disabled:opacity-50">
        {busy ? "Saving…" : "Check in →"}
      </button>
    </div>
  );
}
