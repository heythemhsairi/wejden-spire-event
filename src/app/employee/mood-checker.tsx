"use client";

import { useState } from "react";
import { submitCheckin } from "@/app/actions/employee";
import { SignalSlider } from "@/components/ws/signal-slider";

const MOODS = [
  { v: 10, e: "😞", l: "Rough" },
  { v: 30, e: "😕", l: "Low" },
  { v: 50, e: "😐", l: "Okay" },
  { v: 70, e: "🙂", l: "Good" },
  { v: 90, e: "😄", l: "Great" },
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
    const m = MOODS.reduce((a, b) => (Math.abs(b.v - mood) < Math.abs(a.v - mood) ? b : a));
    return (
      <div className="rounded-2xl border border-ws-border bg-white p-8 text-center shadow-ws-card">
        <div className="text-5xl">{m.e}</div>
        <h2 className="mt-3 font-display text-2xl font-bold text-ws-ink">Thanks for checking in.</h2>
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

      {/* Mood emoji picker */}
      <div className="mt-6 flex justify-between gap-2">
        {MOODS.map((m) => (
          <button
            key={m.v}
            onClick={() => setMood(m.v)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-4 transition-all ${
              Math.abs(mood - m.v) < 10 ? "border-ws-primary bg-ws-soft-green" : "border-ws-border bg-white hover:border-ws-primary/40"
            }`}
          >
            <span className="text-3xl">{m.e}</span>
            <span className="text-xs font-medium text-ws-sage">{m.l}</span>
          </button>
        ))}
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
