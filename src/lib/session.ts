import "server-only";
import { createServerSupabase } from "./supabase/server";

/** Returns the active event session id, or null. Cached per request. */
export async function getActiveSessionId(): Promise<string | null> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("event_sessions")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    return data?.id ?? null;
  } catch {
    return null;
  }
}
