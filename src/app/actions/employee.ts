"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreLead } from "@/lib/domain/lead-scoring";

/** Generate a short, readable access code (no ambiguous chars). */
function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const TeamRequestSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email().max(160),
  company: z.string().min(1).max(160),
  role: z.string().max(80).optional().default(""),
  consent: z.boolean(),
});

export type TeamCodeResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Public (no admin auth): a CEO/HR leader requests an employee access code.
 * Captures them as a lead AND mints an access code tied to their company.
 */
export async function requestTeamCode(raw: unknown): Promise<TeamCodeResult> {
  const parsed = TeamRequestSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please check your details and try again." };
  const d = parsed.data;
  if (!d.consent) return { ok: false, error: "Please accept to continue." };

  const supabase = createAdminClient();

  // Capture as a lead (high intent — they're rolling this out to staff).
  const { score, temperature } = scoreLead({ role: d.role, sourceExperience: "advisor", requestedReport: true });
  const { data: session } = await supabase.from("event_sessions").select("id").eq("is_active", true).limit(1).maybeSingle();
  const { data: lead } = await supabase
    .from("leads")
    .insert({
      full_name: d.fullName,
      email: d.email,
      company: d.company,
      role: d.role || null,
      source_experience: "team-codes",
      lead_score: score + 15, // bonus: deploying to their team is strong intent
      temperature: temperature === "cold" ? "warm" : temperature,
      consent: true,
      consent_at: new Date().toISOString(),
      session_id: session?.id ?? null,
    })
    .select("id")
    .maybeSingle();

  // Mint an access code labelled with their company.
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = genCode();
    const { error } = await supabase.from("access_codes").insert({
      code,
      label: d.company,
      session_id: session?.id ?? null,
      is_active: true,
    });
    if (!error) return { ok: true, code };
  }
  return { ok: false, error: "Could not generate a code. Please try again." };
}

/** Validate an access code. Returns the code id + label if active. */
export async function validateCode(code: string): Promise<{ ok: true; codeId: string; label: string | null } | { ok: false }> {
  const clean = code.trim().toUpperCase();
  if (!clean) return { ok: false };
  const supabase = createAdminClient();
  const { data } = await supabase.rpc("validate_access_code", { p_code: clean });
  const row = data?.[0];
  if (!row || !row.is_active) return { ok: false };
  return { ok: true, codeId: row.id, label: row.label ?? null };
}

const CheckinSchema = z.object({
  codeId: z.string().uuid().optional(),
  kind: z.enum(["mood", "assessment"]),
  mood: z.number().min(0).max(100).optional(),
  energy: z.number().min(0).max(100).optional(),
  stress: z.number().min(0).max(100).optional(),
  wellbeingScore: z.number().min(0).max(100).optional(),
  note: z.string().max(500).optional(),
});

export async function submitCheckin(raw: unknown): Promise<{ ok: boolean }> {
  const parsed = CheckinSchema.safeParse(raw);
  if (!parsed.success) return { ok: false };
  const d = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase.from("employee_checkins").insert({
    code_id: d.codeId ?? null,
    kind: d.kind,
    mood: d.mood ?? null,
    energy: d.energy ?? null,
    stress: d.stress ?? null,
    wellbeing_score: d.wellbeingScore ?? null,
    note: d.note ?? null,
  });
  return { ok: !error };
}
