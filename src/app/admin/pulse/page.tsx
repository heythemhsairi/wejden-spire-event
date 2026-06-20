import Link from "next/link";
import { isAdmin } from "../auth";
import { LoginForm } from "../login-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { PulseControls } from "./pulse-controls";
import { Card } from "@/components/ws/ui";

export const dynamic = "force-dynamic";

export default async function AdminPulsePage() {
  if (!(await isAdmin())) return <LoginForm />;

  const supabase = createAdminClient();
  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, name, is_frozen")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  let stats: { participant_count: number; stress_avg: number | null; burnout_exposure: number | null } | null = null;
  if (session) {
    const { data } = await supabase.rpc("pulse_session_stats", { p_session: session.id });
    stats = data?.[0] ?? null;
  }

  return (
    <div className="min-h-screen bg-ws-hero">
      <div className="border-b border-ws-border bg-white/85">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="font-display font-bold text-ws-primary">← Admin</Link>
          <Link href="/pulse/live" target="_blank" className="text-sm text-ws-sage hover:text-ws-ink">Open live wall ↗</Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="font-display text-2xl font-bold text-ws-ink">Live pulse control</h1>

        {session ? (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-ws-sage">Participants</p>
                <p className="tnum mt-2 font-display text-4xl font-bold text-ws-primary">{stats?.participant_count ?? 0}</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-ws-sage">Stress index</p>
                <p className="tnum mt-2 font-display text-4xl font-bold text-ws-ink">{stats?.stress_avg ?? "—"}</p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-ws-sage">Burnout exposure</p>
                <p className="tnum mt-2 font-display text-4xl font-bold text-ws-ink">{(stats?.participant_count ?? 0) > 0 ? stats?.burnout_exposure : "—"}</p>
              </Card>
            </div>
            <PulseControls sessionId={session.id} sessionName={session.name} frozen={session.is_frozen} />
          </>
        ) : (
          <Card className="mt-5 p-6">
            <p className="text-ws-sage">No active session. Start one to begin collecting live signals.</p>
            <PulseControls sessionId={null} sessionName="" frozen={false} />
          </Card>
        )}
      </div>
    </div>
  );
}
