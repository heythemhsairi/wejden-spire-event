"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "../auth";

/** Generate a short, readable access code (no ambiguous chars). */
function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function createCode(formData: FormData) {
  if (!(await isAdmin())) return;
  const label = String(formData.get("label") ?? "").slice(0, 120) || null;
  const supabase = createAdminClient();

  // attach to active session if any
  const { data: session } = await supabase.from("event_sessions").select("id").eq("is_active", true).limit(1).maybeSingle();

  // retry on the rare collision
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = genCode();
    const { error } = await supabase.from("access_codes").insert({ code, label, session_id: session?.id ?? null, is_active: true });
    if (!error) break;
  }
  revalidatePath("/admin/codes");
}

export async function toggleCode(id: string, active: boolean) {
  if (!(await isAdmin())) return;
  const supabase = createAdminClient();
  await supabase.from("access_codes").update({ is_active: active }).eq("id", id);
  revalidatePath("/admin/codes");
}
