"use client";

import { useState } from "react";
import { submitCheckin } from "@/app/actions/employee";
import { SignalSlider } from "@/components/ws/signal-slider";
import { IconCheck } from "@/components/ws/icons";
import { riskColor } from "@/lib/utils";

const MOODS = [
  { v: 10, l: "Difficile" },
  { v: 30, l: "Bas" },
  { v: 50, l: "Correct" },
  { v: 70, l: "Bien" },
  { v: 90, l: "Excellent" },
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
        <h2 className="mt-4 font-display text-2xl font-bold text-ws-ink">Merci pour votre check-in.</h2>
        <p className="mt-2 text-ws-sage">
          {mood >= 60
            ? "Content que vous alliez bien aujourd'hui. Un bon moment pour remarquer ce qui vous aide."
            : mood >= 40
              ? "Certains jours sont juste corrects — c'est tout à fait normal. Soyez doux(ce) avec vous-même."
              : "On dirait une journée pesante. Vous êtes venu(e) et avez pris le temps de faire le point — ça compte. Pensez à une petite pause ou à parler à une personne de confiance."}
        </p>
        <p className="mt-4 text-sm text-ws-text-dim">Votre check-in est privé et anonyme.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ws-ink">Comment vous sentez-vous aujourd&apos;hui ?</h2>
      <p className="mt-1 text-ws-sage">Juste un petit point. Pas de bonne réponse.</p>

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
        <SignalSlider label="Énergie" value={energy} onChange={setEnergy} leftLabel="Épuisé" rightLabel="Plein d'énergie" />
        <SignalSlider label="Stress" value={stress} higherIsWorse onChange={setStress} leftLabel="Calme" rightLabel="Élevé" />
      </div>

      <button onClick={submit} disabled={busy} className="mt-6 w-full rounded-full bg-ws-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-ws-primary-dark disabled:opacity-50">
        {busy ? "Enregistrement…" : "Valider →"}
      </button>
    </div>
  );
}
