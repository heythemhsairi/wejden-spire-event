"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, setAdminCookie, clearAdminCookie } from "./auth";

export async function login(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await setAdminCookie(password);
  if (!ok) return { error: "Incorrect password." };
  revalidatePath("/admin");
  return { error: null };
}

export async function logout() {
  await clearAdminCookie();
  revalidatePath("/admin");
}

export async function newSession(formData: FormData) {
  if (!(await isAdmin())) return;
  const name = String(formData.get("name") ?? "Event Session").slice(0, 120);
  const supabase = createAdminClient();
  await supabase.from("event_sessions").update({ is_active: false }).eq("is_active", true);
  await supabase.from("event_sessions").insert({ name, is_active: true, is_frozen: false });
  revalidatePath("/admin/pulse");
  revalidatePath("/admin");
}

export async function toggleFreeze(sessionId: string, frozen: boolean) {
  if (!(await isAdmin())) return;
  const supabase = createAdminClient();
  await supabase.from("event_sessions").update({ is_frozen: frozen }).eq("id", sessionId);
  revalidatePath("/admin/pulse");
}

export async function resetSession(sessionId: string) {
  if (!(await isAdmin())) return;
  const supabase = createAdminClient();
  // Clears the wall for the current session by deleting its signals.
  await supabase.from("pulse_signals").delete().eq("session_id", sessionId);
  revalidatePath("/admin/pulse");
}
