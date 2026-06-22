"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { validateCode } from "@/app/actions/employee";
import { BrandMark } from "@/components/ws/brand-logo";
import { IconMood, IconWellbeing, IconTalk, IconWave, IconArrowRight } from "@/components/ws/icons";
import { MoodChecker } from "./mood-checker";
import { WellbeingTest } from "./wellbeing-test";
import { EmployeeAssistant } from "./employee-assistant";

type Tool = "home" | "mood" | "score" | "assistant";

export function EmployeeSpace() {
  const params = useSearchParams();
  const [codeId, setCodeId] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("home");

  // Auto-validate a ?code= in the URL.
  useEffect(() => {
    const c = params.get("code");
    if (c) tryCode(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tryCode(code: string) {
    setChecking(true);
    setError(null);
    const res = await validateCode(code);
    setChecking(false);
    if (res.ok) {
      setCodeId(res.codeId);
      setLabel(res.label);
    } else {
      setError("That code isn't valid or has been turned off. Check with your organizer.");
    }
  }

  // ── Gate ──
  if (!codeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ws-hero px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex justify-center"><BrandMark size={48} /></div>
          <h1 className="font-display text-2xl font-bold text-ws-ink">Your wellbeing space</h1>
          <p className="mt-2 text-sm text-ws-sage">Enter the access code you were given to open your private space.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); tryCode(input); }}
            className="mt-6 rounded-2xl border border-ws-border bg-white p-6 shadow-ws-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="tnum w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-3 text-center font-mono text-lg tracking-widest text-ws-ink outline-none focus:border-ws-primary"
              autoFocus
            />
            {error && <p className="mt-3 text-xs text-ws-red">{error}</p>}
            <button type="submit" disabled={checking || !input.trim()} className="mt-4 w-full rounded-full bg-ws-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-ws-primary-dark disabled:opacity-50">
              {checking ? "Checking…" : "Enter →"}
            </button>
          </form>
          <p className="mt-4 text-xs text-ws-text-dim">Private &amp; anonymous. We don&apos;t store your name.</p>
        </div>
      </div>
    );
  }

  // ── In a tool ──
  if (tool !== "home") {
    return (
      <div className="min-h-screen bg-ws-hero">
        <EmployeeHeader label={label} onHome={() => setTool("home")} />
        <div className="mx-auto max-w-2xl px-5 py-8">
          {tool === "mood" && <MoodChecker codeId={codeId} />}
          {tool === "score" && <WellbeingTest codeId={codeId} />}
          {tool === "assistant" && <EmployeeAssistant />}
        </div>
      </div>
    );
  }

  // ── Hub ──
  return (
    <div className="min-h-screen bg-ws-hero">
      <EmployeeHeader label={label} />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ws-ink">
          Hi there <IconWave size={28} className="text-ws-primary" />
        </h1>
        <p className="mt-2 text-ws-sage">This space is just for you. Private, anonymous, no pressure. What would you like to do?</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <ToolCard icon={<IconMood size={24} />} iconColor="text-ws-blue-dark" title="Mood check-in" desc="Log how you're feeling today in 20 seconds." onClick={() => setTool("mood")} bg="bg-ws-soft-blue" />
          <ToolCard icon={<IconWellbeing size={24} />} iconColor="text-ws-primary" title="Wellbeing score" desc="A short check to understand how you're really doing." onClick={() => setTool("score")} bg="bg-ws-soft-green" />
          <ToolCard icon={<IconTalk size={24} />} iconColor="text-ws-purple-dark" title="Talk it through" desc="A warm assistant here to listen and support you." onClick={() => setTool("assistant")} bg="bg-ws-soft-purple" />
        </div>

        <div className="mt-8 rounded-2xl border border-ws-border bg-white p-5 text-sm text-ws-sage">
          Everything here is illustrative support for the event — not a medical service. If you&apos;re going through something serious, please reach out to someone you trust or a professional.
        </div>
      </div>
    </div>
  );
}

function EmployeeHeader({ label, onHome }: { label: string | null; onHome?: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ws-border/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <div className="leading-none">
            <div className="font-display text-sm font-extrabold text-ws-ink">Your Wellbeing Space</div>
            {label && <div className="text-[10px] uppercase tracking-wider text-ws-text-dim">{label}</div>}
          </div>
        </div>
        {onHome ? (
          <button onClick={onHome} className="rounded-full border border-ws-border bg-white px-4 py-2 text-sm font-medium text-ws-ink hover:bg-ws-cloud">← Back</button>
        ) : (
          <Link href="/" className="text-sm text-ws-sage hover:text-ws-ink">Exit</Link>
        )}
      </div>
    </header>
  );
}

function ToolCard({ icon, iconColor, title, desc, onClick, bg }: { icon: React.ReactNode; iconColor: string; title: string; desc: string; onClick: () => void; bg: string }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-start rounded-2xl border border-ws-border bg-white p-5 text-left shadow-ws-card transition-all hover:-translate-y-1 hover:shadow-ws-lift">
      <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${iconColor}`}>{icon}</span>
      <h3 className="font-display text-base font-bold text-ws-ink">{title}</h3>
      <p className="mt-1 text-sm text-ws-sage">{desc}</p>
      <IconArrowRight size={18} className="mt-3 text-ws-primary transition-transform group-hover:translate-x-1" />
    </button>
  );
}
