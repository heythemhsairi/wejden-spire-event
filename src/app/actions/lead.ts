"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { scoreLead } from "@/lib/domain/lead-scoring";
import { makeToken } from "@/lib/utils";
import type { SourceExperience } from "@/lib/domain/types";

const LeadSchema = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional().default(""),
  role: z.string().max(80).optional().default(""),
  consent: z.boolean(),
  sourceExperience: z.string().optional(),
  experiencesCompleted: z.number().optional(),
  hiddenCost: z.number().optional(),
  // Optional result payload to persist + return a report token.
  result: z
    .object({
      experience: z.string(),
      inputs: z.record(z.any()),
      outputs: z.record(z.any()),
      summary: z.string().optional(),
    })
    .optional(),
});

export type LeadResult =
  | { ok: true; reportToken?: string }
  | { ok: false; error: string };

export async function submitLead(raw: unknown): Promise<LeadResult> {
  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please check your details and try again." };
  const d = parsed.data;
  if (!d.consent) return { ok: false, error: "Consent is required to receive your report." };

  const supabase = createAdminClient();

  const { score, temperature } = scoreLead({
    role: d.role,
    sourceExperience: d.sourceExperience as SourceExperience | undefined,
    experiencesCompleted: d.experiencesCompleted,
    requestedReport: Boolean(d.result),
    hiddenCost: d.hiddenCost,
  });

  // Attach to the active event session if one exists.
  const { data: session } = await supabase
    .from("event_sessions")
    .select("id")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .insert({
      full_name: d.fullName,
      email: d.email,
      company: d.company || null,
      role: d.role || null,
      source_experience: d.sourceExperience || null,
      lead_score: score,
      temperature,
      consent: true,
      consent_at: new Date().toISOString(),
      session_id: session?.id ?? null,
    })
    .select("id")
    .single();

  if (leadErr || !lead) return { ok: false, error: "Could not save your details. Please retry." };

  let reportToken: string | undefined;
  if (d.result) {
    const token = makeToken();
    const { error: resErr } = await supabase.from("experience_results").insert({
      token,
      lead_id: lead.id,
      experience: d.result.experience,
      inputs: d.result.inputs,
      outputs: d.result.outputs,
      summary: d.result.summary ?? null,
    });
    if (!resErr) reportToken = token;
  }

  // NOTE: email delivery (Resend) is wired separately; lead + report are persisted here.
  return { ok: true, reportToken };
}
