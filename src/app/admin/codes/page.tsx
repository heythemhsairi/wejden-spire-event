import Link from "next/link";
import { isAdmin } from "../auth";
import { LoginForm } from "../login-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { CodesClient } from "./codes-client";

export const dynamic = "force-dynamic";

interface CodeRow {
  id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
}

export default async function CodesPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("access_codes")
    .select("id, code, label, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // count check-ins per code
  const { data: checkins } = await supabase.from("employee_checkins").select("code_id");
  const counts: Record<string, number> = {};
  for (const c of checkins ?? []) {
    if (c.code_id) counts[c.code_id] = (counts[c.code_id] ?? 0) + 1;
  }

  return (
    <div className="min-h-screen bg-ws-hero">
      <div className="border-b border-ws-border bg-white/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="font-display font-bold text-ws-primary">← Admin</Link>
          <span className="text-sm text-ws-sage">Employee access codes</span>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="font-display text-2xl font-bold text-ws-ink">Employee access codes</h1>
        <p className="mt-1 text-sm text-ws-sage">
          Generate a code, share the link, and an employee can open their private wellbeing space — mood check-in, personal score, and a supportive assistant.
        </p>
        <CodesClient codes={(data ?? []) as CodeRow[]} counts={counts} />
      </div>
    </div>
  );
}
