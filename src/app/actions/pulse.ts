"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const PulseSchema = z.object({
  energy: z.number().min(0).max(100),
  workload: z.number().min(0).max(100),
  psychSafety: z.number().min(0).max(100),
  support: z.number().min(0).max(100),
  stress: z.number().min(0).max(100),
});

export type PulseResult = { ok: true; participantNumber: number } | { ok: false; error: string };

export async function submitPulse(raw: unknown): Promise<PulseResult> {
  const parsed = PulseSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Invalid signal values." };

  const supabase = createAdminClient();

  // Soft anti-spam: one submit per 5 min per device cookie.
  const cookieStore = await cookies();
  const last = cookieStore.get("ws_pulse_at")?.value;
  if (last && Date.now() - Number(last) < 5 * 60 * 1000) {
    return { ok: false, error: "You've already added a signal recently. Thank you!" };
  }

  const { data: session } = await supabase
    .from("event_sessions")
    .select("id, is_frozen")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!session) return { ok: false, error: "No active event session." };
  if (session.is_frozen) return { ok: false, error: "The live wall is currently paused." };

  const d = parsed.data;
  const { error } = await supabase.from("pulse_signals").insert({
    session_id: session.id,
    energy: Math.round(d.energy),
    workload: Math.round(d.workload),
    psych_safety: Math.round(d.psychSafety),
    support: Math.round(d.support),
    stress: Math.round(d.stress),
  });
  if (error) return { ok: false, error: "Could not record your signal. Please retry." };

  cookieStore.set("ws_pulse_at", String(Date.now()), { maxAge: 600, httpOnly: true, sameSite: "lax" });

  const { data: stats } = await supabase.rpc("pulse_session_stats", { p_session: session.id });
  const count = stats?.[0]?.participant_count ?? 1;

  return { ok: true, participantNumber: Number(count) };
}
