"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

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
