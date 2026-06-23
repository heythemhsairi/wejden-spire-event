"use client";

import { useMemo, useState } from "react";
import { EMOTIONS, FREQUENCY_OPTIONS, scoreWellbeing } from "@/lib/domain/wellbeing";
import { submitCheckin } from "@/app/actions/employee";
import { RadialGauge } from "@/components/ws/radial-gauge";
import { IconWellbeing, IconHeartPulse, EmotionIcon } from "@/components/ws/icons";

type Phase = "intro" | "questions" | "result";

export function WellbeingTest({ codeId }: { codeId: string }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const total = EMOTIONS.length;
  const emotion = EMOTIONS[step];
  const result = useMemo(() => (phase === "result" ? scoreWellbeing(answers) : null), [phase, answers]);

  function answer(i: number) {
    setAnswers((a) => ({ ...a, [emotion.id]: i }));
    setTimeout(() => {
      if (step + 1 >= total) setPhase("result");
      else setStep((s) => s + 1);
    }, 160);
  }

  if (phase === "result" && result && !saved) {
    setSaved(true);
    submitCheckin({ codeId, kind: "assessment", wellbeingScore: result.score });
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-ws-border bg-white p-8 text-center shadow-ws-card">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ws-soft-purple text-ws-purple-dark">
            <IconHeartPulse size={32} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ws-ink">Bilan bien-être hebdomadaire</h2>
          <p className="mt-3 text-sm leading-relaxed text-ws-sage">
            Un court questionnaire sur les émotions que vous avez pu ressentir récemment. Pour chacune,
            indiquez à quel point vous l&apos;avez ressentie au cours de la semaine passée.
          </p>
          <button onClick={() => setPhase("questions")} className="mt-6 w-full rounded-full bg-ws-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-ws-primary-dark">
            Commencer
          </button>
          <p className="mt-3 text-xs text-ws-text-dim">Environ 2 minutes · {total} questions</p>
        </div>
      </div>
    );
  }

  // ── Questions ──
  if (phase === "questions") {
    const pct = Math.round(((step) / total) * 100);
    const isPositive = emotion.affect === "positive";
    return (
      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
          <span className="text-ws-purple-dark">Question {step + 1} / {total}</span>
          <span className="tnum text-ws-purple-dark">{Math.round(((step + 1) / total) * 100)}%</span>
        </div>
        <div className="mb-10 h-2 overflow-hidden rounded-full bg-ws-cloud">
          <div className="h-full rounded-full bg-ws-purple transition-all" style={{ width: `${pct + 100 / total}%` }} />
        </div>

        <p className="text-center text-sm font-medium text-ws-sage">À quel point l&apos;avez-vous ressenti cette semaine ?</p>

        <div className="mt-6 flex flex-col items-center">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${isPositive ? "bg-ws-soft-green text-ws-primary-dark" : "bg-ws-soft-purple text-ws-purple-dark"}`}>
            {isPositive ? "Affect positif" : "Affect négatif"}
          </span>
          <div className="mt-5 flex items-center gap-3">
            <EmotionIcon name={emotion.icon} size={36} className={isPositive ? "text-ws-primary" : "text-ws-purple-dark"} />
            <span className="font-display text-4xl font-bold text-ws-ink">{emotion.word}</span>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {FREQUENCY_OPTIONS.map((opt, i) => {
            const sel = answers[emotion.id] === i;
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                className={`flex min-h-[64px] items-center justify-center rounded-2xl border px-3 py-3 text-center text-sm transition-all ${
                  sel ? "border-ws-primary bg-ws-soft-green text-ws-ink" : "border-ws-border bg-white text-ws-sage hover:border-ws-primary/40 hover:text-ws-ink"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="mt-8 flex items-center gap-1.5 text-sm text-ws-sage hover:text-ws-ink">
            ← Retour
          </button>
        )}
      </div>
    );
  }

  // ── Result ──
  return (
    <div className="text-center">
      <h2 className="font-display text-2xl font-bold text-ws-ink">Votre instantané de bien-être</h2>
      <div className="mt-6 flex justify-center">
        <RadialGauge value={result!.score} label="/ 100" sublabel={result!.band} invertColor size={180} />
      </div>
      <p className="mx-auto mt-5 max-w-md text-ws-sage">{result!.message}</p>

      {/* Positive vs negative affect */}
      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-ws-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ws-primary-dark">Affect positif</p>
          <p className="tnum mt-1 font-display text-3xl font-bold text-ws-primary">{result!.positiveScore}</p>
        </div>
        <div className="rounded-2xl border border-ws-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ws-purple-dark">Affect négatif</p>
          <p className="tnum mt-1 font-display text-3xl font-bold text-ws-purple-dark">{result!.negativeScore}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-ws-border bg-white p-6 text-left">
        <h3 className="font-display text-base font-bold text-ws-ink">Quelques pistes qui pourraient aider</h3>
        <ul className="mt-3 space-y-2.5">
          {result!.tips.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ws-sage">
              <IconWellbeing size={18} className="mt-0.5 shrink-0 text-ws-primary" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-ws-purple/25 bg-ws-soft-purple px-5 py-4 text-sm text-ws-ink">
        Envie d&apos;en parler ? L&apos;assistant bien-être est là pour vous.
      </div>

      <button onClick={() => { setPhase("intro"); setStep(0); setAnswers({}); setSaved(false); }} className="mt-5 rounded-full border border-ws-border bg-white px-4 py-2 text-sm text-ws-ink hover:bg-ws-cloud">
        Recommencer
      </button>
      <p className="mt-4 text-xs text-ws-text-dim">Privé &amp; anonyme · illustratif, pas une évaluation clinique.</p>
    </div>
  );
}
