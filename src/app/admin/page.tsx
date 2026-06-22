import Link from "next/link";
import { isAdmin } from "./auth";
import { logout } from "./actions";
import { LoginForm } from "./login-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, Badge, Button } from "@/components/ws/ui";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) return <LoginForm />;

  const supabase = createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [{ data: session }, leadsToday, hot, pulseToday, reports] = await Promise.all([
    supabase.from("event_sessions").select("id").eq("is_active", true).limit(1).maybeSingle(),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("temperature", "hot"),
    supabase.from("pulse_signals").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("experience_results").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);

  const stats = [
    { label: "Pulses (24h)", value: pulseToday.count ?? 0 },
    { label: "Leads (24h)", value: leadsToday.count ?? 0 },
    { label: "Reports (24h)", value: reports.count ?? 0 },
    { label: "Hot leads", value: hot.count ?? 0, accent: true },
  ];

  return (
    <div className="min-h-screen bg-ws-hero">
      <div className="border-b border-ws-border bg-white/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-ws-primary">WejdenSpire Admin</span>
            <Badge color="primary">Console</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button href="/admin/leads" variant="ghost" className="px-3 py-2 text-sm">Leads</Button>
            <Button href="/admin/pulse" variant="ghost" className="px-3 py-2 text-sm">Pulse</Button>
            <Button href="/admin/codes" variant="ghost" className="px-3 py-2 text-sm">Employee codes</Button>
            <form action={logout}>
              <Button type="submit" variant="ghost" className="px-3 py-2 text-sm">Sign out</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <p className="text-xs uppercase tracking-wider text-ws-sage">{s.label}</p>
              <p className={`tnum mt-2 font-display text-4xl font-bold ${s.accent ? "text-ws-primary" : "text-ws-ink"}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-ws-ink">Lead pipeline</h3>
            <p className="mt-1 text-sm text-ws-sage">Review, filter, and export captured leads.</p>
            <Link href="/admin/leads" className="mt-4 inline-block text-sm font-medium text-ws-primary">Open leads →</Link>
          </Card>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-ws-ink">Live pulse control</h3>
            <p className="mt-1 text-sm text-ws-sage">Reset, freeze, or start a new event session. {session ? "" : "No active session."}</p>
            <Link href="/admin/pulse" className="mt-4 inline-block text-sm font-medium text-ws-primary">Open pulse →</Link>
          </Card>
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-ws-ink">Employee access codes</h3>
            <p className="mt-1 text-sm text-ws-sage">Generate codes that give employees a private wellbeing space (mood, score, assistant).</p>
            <Link href="/admin/codes" className="mt-4 inline-block text-sm font-medium text-ws-primary">Manage codes →</Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
