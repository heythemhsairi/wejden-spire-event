"use client";

import { useState } from "react";
import { ROLES } from "@/lib/domain/types";
import { submitLead } from "@/app/actions/lead";
import { Button } from "./ui";

export interface LeadResultPayload {
  experience: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  summary?: string;
}

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  sourceExperience: string;
  experiencesCompleted?: number;
  hiddenCost?: number;
  result?: LeadResultPayload;
  onSuccess?: (reportToken?: string) => void;
}

export function LeadModal({
  open,
  onClose,
  title = "Send me my executive report",
  sourceExperience,
  experiencesCompleted,
  hiddenCost,
  result,
  onSuccess,
}: LeadModalProps) {
  const [form, setForm] = useState({ fullName: "", email: "", company: "", role: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await submitLead({
      ...form,
      consent,
      sourceExperience,
      experiencesCompleted,
      hiddenCost,
      result,
    });
    setBusy(false);
    if (res.ok) {
      onSuccess?.(res.reportToken);
      onClose();
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ws-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-ws-rise rounded-2xl border border-ws-border bg-white p-6 shadow-ws-lift">
        <h2 className="font-display text-xl font-bold text-ws-ink">{title}</h2>
        <p className="mt-1 text-sm text-ws-sage">No password. Delivered instantly.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Field label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
          <Field label="Work email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary"
            >
              <option value="">Select…</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <label className="flex items-start gap-2 text-xs text-ws-sage">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-ws-primary" />
            <span>I agree to be contacted by WejdenSpire about workforce intelligence. (GDPR consent)</span>
          </label>
          {error && <p className="text-xs text-ws-red">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={busy}>
            {busy ? "Sending…" : "Send my report →"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-text-lo">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary"
      />
    </div>
  );
}
