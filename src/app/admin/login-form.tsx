"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ws/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: null });
  return (
    <div className="flex min-h-screen items-center justify-center bg-ws-hero px-5">
      <form action={action} className="w-full max-w-sm rounded-xl border border-ws-border bg-ws-cloud p-6">
        <h1 className="font-display text-xl font-semibold text-ws-ink">WejdenSpire Admin</h1>
        <p className="mt-1 text-sm text-ws-sage">Event operations console.</p>
        <input
          type="password"
          name="password"
          placeholder="Admin password"
          className="mt-5 w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary"
          autoFocus
        />
        {state?.error && <p className="mt-2 text-xs text-ws-red">{state.error}</p>}
        <Button type="submit" variant="primary" className="mt-4 w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
