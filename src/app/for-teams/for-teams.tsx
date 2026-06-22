"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { requestTeamCode } from "@/app/actions/employee";
import { ROLES } from "@/lib/domain/types";
import { Button, Badge } from "@/components/ws/ui";
import { IconMood, IconWellbeing, IconTalk, IconCheck } from "@/components/ws/icons";

export function ForTeams() {
  const [form, setForm] = useState({ fullName: "", email: "", company: "", role: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await requestTeamCode({ ...form, consent });
    setBusy(false);
    if (res.ok) setCode(res.code);
    else setError(res.error);
  }

  if (code) return <Result code={code} company={form.company} onAgain={() => { setCode(null); setForm({ fullName: "", email: "", company: "", role: "" }); setConsent(false); }} />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Pitch */}
        <div>
          <Badge color="primary">For CEOs &amp; People leaders</Badge>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ws-ink">
            Give your team a private wellbeing space.
          </h1>
          <p className="mt-4 text-lg text-ws-sage">
            Generate a secure link in seconds and share it with your employees. Each person gets a private,
            anonymous space — no signup needed.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { icon: <IconMood size={20} />, t: "Daily mood check-in" },
              { icon: <IconWellbeing size={20} />, t: "Weekly wellbeing assessment" },
              { icon: <IconTalk size={20} />, t: "A supportive AI companion" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3 text-ws-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ws-soft-green text-ws-primary">{f.icon}</span>
                {f.t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ws-text-dim">Anonymous by design — you see wellbeing trends, never individual names.</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-ws-border bg-white p-7 shadow-ws-card">
          <h2 className="font-display text-xl font-bold text-ws-ink">Create your team link</h2>
          <p className="mt-1 text-sm text-ws-sage">Tell us who you are and we&apos;ll generate your code instantly.</p>
          <form onSubmit={submit} className="mt-5 space-y-3.5">
            <Field label="Your name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Field label="Work email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} required />
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
                <option value="">Select…</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <label className="flex items-start gap-2 text-xs text-ws-sage">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-ws-primary" />
              <span>I agree to be contacted by WejdenSpire. (GDPR consent)</span>
            </label>
            {error && <p className="text-xs text-ws-red">{error}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={busy}>
              {busy ? "Generating…" : "Generate my team link →"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Result({ code, company, onAgain }: { code: string; company: string; onAgain: () => void }) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "msg" | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://wejden-spire-event.vercel.app";
  const link = `${origin}/employee?code=${code}`;
  const shareMsg = `Hi team — we've set up a private, anonymous wellbeing space for you with WejdenSpire. Take a moment to check in: ${link} (or use code ${code}). It's confidential and just for you.`;

  useEffect(() => {
    QRCode.toDataURL(link, { width: 320, margin: 1, color: { dark: "#1F2A2E", light: "#FFFFFF" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [link]);

  function copy(text: string, which: "link" | "msg") {
    navigator.clipboard?.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="rounded-2xl border border-ws-border bg-white p-8 shadow-ws-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ws-soft-green text-ws-primary"><IconCheck size={26} /></span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ws-ink">Your team link is ready</h1>
            <p className="text-sm text-ws-sage">For {company}</p>
          </div>
        </div>

        {/* QR */}
        <div className="mt-7 flex flex-col items-center">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code to the team wellbeing space" className="h-48 w-48 rounded-2xl border border-ws-border" />
          ) : (
            <div className="h-48 w-48 animate-ws-pulse rounded-2xl bg-ws-cloud" />
          )}
          <p className="mt-3 text-sm text-ws-sage">Scan to open, or share the link below.</p>
        </div>

        {/* Code */}
        <div className="mt-6 rounded-xl border border-ws-border bg-ws-cloud px-5 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Access code</p>
          <p className="tnum mt-1 font-mono text-3xl font-bold tracking-widest text-ws-ink">{code}</p>
        </div>

        {/* Link */}
        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Direct link</label>
          <div className="flex gap-2">
            <input readOnly value={link} className="flex-1 rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink" />
            <Button variant="primary" className="shrink-0 px-4 py-2.5" onClick={() => copy(link, "link")}>{copied === "link" ? "Copied!" : "Copy"}</Button>
          </div>
        </div>

        {/* Ready-made share message */}
        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Ready-to-send message</label>
          <textarea readOnly value={shareMsg} rows={4} className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink" />
          <button onClick={() => copy(shareMsg, "msg")} className="mt-2 text-sm font-medium text-ws-primary hover:underline">{copied === "msg" ? "Copied!" : "Copy message"}</button>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={`/employee?code=${code}`} variant="primary">Preview the employee space →</Button>
          <Button variant="ghost" onClick={onAgain}>Create another</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">{label}</label>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary" />
    </div>
  );
}
