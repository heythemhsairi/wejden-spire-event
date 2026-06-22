"use client";

import { useMemo, useState } from "react";
import { WELLBEING_QUESTIONS, scoreWellbeing } from "@/lib/domain/wellbeing";
import { submitCheckin } from "@/app/actions/employee";
import { RadialGauge } from "@/components/ws/radial-gauge";

export function WellbeingTest({ codeId }: { codeId: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const total = WELLBEING_QUESTIONS.length;
  const done = step >= total;
  const q = done ? null : WELLBEING_QUESTIONS[step];
  const result = useMemo(() => (done ? scoreWellbeing(answers) : null), [done, answers]);

  function answer(i: number) {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
    setTimeout(() => setStep((s) => s + 1), 160);
  }

  // Save once when we reach the result.
  if (done && result && !saved) {
    setSaved(true);
    submitCheckin({ codeId, kind: "assessment", wellbeingScore: result.score });
  }

  if (!done && q) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ws-ink">A quick check on how you&apos;re doing</h2>
          <span className="tnum text-sm text-ws-sage">{step + 1}/{total}</span>
        </div>
        <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-ws-cloud">
          <div className="h-full rounded-full bg-ws-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <p className="font-display text-lg font-semibold text-ws-ink">{q.text}</p>
        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                answers[q.id] === i ? "border-ws-primary bg-ws-soft-green text-ws-ink" : "border-ws-border bg-white text-ws-sage hover:border-ws-primary/40 hover:text-ws-ink"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="mt-5 rounded-full border border-ws-border bg-white px-4 py-2 text-sm text-ws-ink hover:bg-ws-cloud">← Back</button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold text-ws-ink">Your wellbeing snapshot</h2>
      <div className="mt-6 flex justify-center">
        <RadialGauge value={result!.score} label="/ 100" sublabel={result!.band} invertColor size={180} />
      </div>
      <p className="mx-auto mt-5 max-w-md text-ws-sage">{result!.message}</p>

      <div className="mt-7 rounded-2xl border border-ws-border bg-white p-6 text-left">
        <h3 className="font-display text-base font-bold text-ws-ink">A few things that might help</h3>
        <ul className="mt-3 space-y-2.5">
          {result!.tips.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ws-sage"><span className="text-ws-primary">🌱</span>{t}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-ws-purple/25 bg-ws-soft-purple px-5 py-4 text-sm text-ws-ink">
        Want to talk any of this through? The wellbeing assistant is here for you.
      </div>

      <button onClick={() => { setStep(0); setAnswers({}); setSaved(false); }} className="mt-5 rounded-full border border-ws-border bg-white px-4 py-2 text-sm text-ws-ink hover:bg-ws-cloud">Retake</button>
      <p className="mt-4 text-xs text-ws-text-dim">Private &amp; anonymous · illustrative, not a clinical assessment.</p>
    </div>
  );
}
