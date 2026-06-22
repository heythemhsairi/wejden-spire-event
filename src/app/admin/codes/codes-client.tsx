"use client";

import { useState, useTransition } from "react";
import { createCode, toggleCode } from "./actions";
import { Button, Card, Badge } from "@/components/ws/ui";

interface CodeRow {
  id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
}

export function CodesClient({ codes, counts }: { codes: CodeRow[]; counts: Record<string, number> }) {
  const [label, setLabel] = useState("");
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function copyLink(code: string) {
    const url = `${origin}/employee?code=${code}`;
    navigator.clipboard?.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mt-6 space-y-6">
      <form action={(fd) => start(() => createCode(fd))} className="flex flex-wrap items-end gap-3 rounded-xl border border-ws-border bg-white p-5">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ws-sage">Label (optional — company / team)</label>
          <input name="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Acme Corp" className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary" />
        </div>
        <Button type="submit" variant="primary" disabled={pending}>Generate code</Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-ws-border">
        <table className="w-full text-sm">
          <thead className="bg-ws-cloud text-left text-xs uppercase tracking-wider text-ws-text-dim">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Check-ins</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="border-t border-ws-border">
                <td className="px-4 py-3"><span className="tnum font-mono font-bold text-ws-ink">{c.code}</span></td>
                <td className="px-4 py-3 text-ws-sage">{c.label ?? "—"}</td>
                <td className="tnum px-4 py-3 font-semibold text-ws-ink">{counts[c.id] ?? 0}</td>
                <td className="px-4 py-3">{c.is_active ? <Badge color="primary">Active</Badge> : <Badge color="red">Off</Badge>}</td>
                <td className="px-4 py-3">
                  <button onClick={() => copyLink(c.code)} className="text-ws-primary hover:underline">
                    {copied === c.code ? "Copied!" : "Copy link"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <ToggleBtn id={c.id} active={c.is_active} />
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ws-sage">No codes yet. Generate one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Card className="p-5">
        <p className="text-sm text-ws-sage">
          Share the <strong className="text-ws-ink">copied link</strong> (or just the 6-character code) with an employee. They open it, no login needed, and reach their private space.
        </p>
      </Card>
    </div>
  );
}

function ToggleBtn({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="ghost" className="px-3 py-1.5 text-xs" disabled={pending} onClick={() => start(() => toggleCode(id, !active))}>
      {active ? "Disable" : "Enable"}
    </Button>
  );
}
