"use client";

import { useState, useTransition } from "react";
import { newSession, toggleFreeze, resetSession } from "../actions";
import { Button } from "@/components/ws/ui";

export function PulseControls({ sessionId, sessionName, frozen }: { sessionId: string | null; sessionName: string; frozen: boolean }) {
  const [name, setName] = useState(sessionName || "Event Session");
  const [pending, start] = useTransition();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mt-6 space-y-4">
      {sessionId && (
        <div className="flex flex-wrap gap-3 rounded-xl border border-ws-border bg-white p-5">
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => start(() => toggleFreeze(sessionId, !frozen))}
          >
            {frozen ? "▶ Resume wall" : "⏸ Freeze wall"}
          </Button>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ws-red">Delete all signals for this session?</span>
              <Button variant="ghost" disabled={pending} onClick={() => start(() => { resetSession(sessionId); setConfirmReset(false); })}>Confirm reset</Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>↺ Reset session data</Button>
          )}
        </div>
      )}

      <form
        action={(fd) => start(() => newSession(fd))}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-ws-border bg-white p-5"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-ws-sage">New session name</label>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-ws-border bg-ws-cloud px-3 py-2.5 text-sm text-ws-ink outline-none focus:border-ws-primary" />
        </div>
        <Button type="submit" variant="primary" disabled={pending}>Start new session</Button>
      </form>
      <p className="text-xs text-ws-text-dim">Starting a new session deactivates the current one and gives the wall a fresh, empty pulse.</p>
    </div>
  );
}
