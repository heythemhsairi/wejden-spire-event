import Link from "next/link";
import { isAdmin } from "../auth";
import { LoginForm } from "../login-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ws/ui";

export const dynamic = "force-dynamic";

interface Lead {
  id: string;
  full_name: string | null;
  email: string;
  company: string | null;
  role: string | null;
  source_experience: string | null;
  lead_score: number;
  temperature: string;
  created_at: string;
}

export default async function LeadsPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("leads")
    .select("id, full_name, email, company, role, source_experience, lead_score, temperature, created_at")
    .order("lead_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);

  const leads = (data ?? []) as Lead[];
  const tempColor = (t: string) => (t === "hot" ? "red" : t === "warm" ? "purple" : "primary") as "red" | "purple" | "primary";

  return (
    <div className="min-h-screen bg-ws-hero">
      <div className="border-b border-ws-border bg-white/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="font-display font-bold text-ws-primary">← Admin</Link>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(toCsv(leads))}`}
            download="wejdenspire-leads.csv"
            className="rounded-lg border border-ws-border bg-ws-cloud px-4 py-2 text-sm text-ws-ink hover:border-ws-primary/60"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-2xl font-bold text-ws-ink">Lead pipeline <span className="tnum text-ws-text-dim">({leads.length})</span></h1>
        <div className="mt-5 overflow-x-auto rounded-xl border border-ws-border">
          <table className="w-full text-sm">
            <thead className="bg-ws-cloud text-left text-xs uppercase tracking-wider text-ws-text-dim">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Temp</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-ws-border hover:bg-ws-cloud">
                  <td className="px-4 py-3">
                    <div className="text-ws-ink">{l.full_name ?? "—"}</div>
                    <div className="text-xs text-ws-text-dim">{l.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ws-sage">{l.company ?? "—"}</td>
                  <td className="px-4 py-3 text-ws-sage">{l.role ?? "—"}</td>
                  <td className="px-4 py-3 text-ws-sage">{l.source_experience ?? "—"}</td>
                  <td className="tnum px-4 py-3 font-semibold text-ws-ink">{l.lead_score}</td>
                  <td className="px-4 py-3"><Badge color={tempColor(l.temperature)}>{l.temperature}</Badge></td>
                  <td className="px-4 py-3 text-xs text-ws-text-dim">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-ws-sage">No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function toCsv(leads: Lead[]): string {
  const header = "name,email,company,role,source,score,temperature,created_at";
  const rows = leads.map((l) =>
    [l.full_name, l.email, l.company, l.role, l.source_experience, l.lead_score, l.temperature, l.created_at]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
