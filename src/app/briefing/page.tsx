"use client";

import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/ws/site-nav";
import { Button, Card } from "@/components/ws/ui";
import { ROLES } from "@/lib/domain/types";
import { submitLead } from "@/app/actions/lead";

export default function BriefingPage() {
  const [form, setForm] = useState({ fullName: "", email: "", company: "", role: "" });
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await submitLead({ ...form, consent, sourceExperience: "advisor" });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  return (
    <div className="min-h-screen bg-ws-hero">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="font-display text-4xl font-bold text-ws-ink">Book an intelligence briefing</h1>
        <p className="mt-3 text-lg text-ws-sage">
          A 30-minute executive walkthrough of what continuous workforce-risk visibility looks like
          inside an organization like yours.
        </p>

        <Card className="mt-8 p-6">
          {done ? (
            <div className="py-8 text-center">
              <div className="text-3xl">✓</div>
              <h2 className="mt-3 font-display text-xl font-semibold text-ws-ink">Request received.</h2>
              <p className="mt-1 text-ws-sage">We&apos;ll reach out to {form.email} to schedule your briefing.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Input label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Input label="Work email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Input label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ws-sage">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary">
                  <option value="">Select…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <label className="flex items-start gap-2 text-xs text-ws-sage">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-ws-primary" />
                <span>I agree to be contacted by WejdenSpire. (GDPR consent)</span>
              </label>
              {error && <p className="text-xs text-ws-red">{error}</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy ? "Sending…" : "Request briefing →"}</Button>
            </form>
          )}
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ws-sage">{label}</label>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary" />
    </div>
  );
}
