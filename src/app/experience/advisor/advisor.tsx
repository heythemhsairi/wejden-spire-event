"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ws/ui";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const CHIPS = [
  "Why are employees leaving?",
  "How much does burnout cost?",
  "What are psychosocial risks?",
  "How can we detect disengagement early?",
  "What should leaders measure?",
];

export function Advisor() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "The advisor is unavailable right now.");
        setMessages(next); // drop the empty assistant bubble
        setStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch {
      setError("Connection interrupted. Please try again.");
      setMessages(next);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-5 py-6">
      <div className="mb-4">
        <Badge color="primary">Experience 04</Badge>
        <h1 className="mt-2 font-display text-2xl font-bold text-ws-ink">AI Workforce Advisor</h1>
        <p className="text-sm text-ws-sage">Consulting-grade. Ask anything about workforce risk, cost, and action.</p>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-ws-border bg-ws-cloud p-5">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-ws-text-dim">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => send(c)} className="rounded-full border border-ws-border bg-ws-cloud px-3.5 py-2 text-sm text-ws-sage transition-colors hover:border-ws-primary/60 hover:text-ws-ink">
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-ws-primary text-white" : "border border-ws-border bg-ws-cloud text-ws-ink"}`}>
              {m.content || (streaming && i === messages.length - 1 ? <span className="animate-ws-pulse text-ws-sage">Thinking…</span> : m.content)}
            </div>
          </div>
        ))}
        {error && (
          <div className="rounded-lg border border-ws-red/30 bg-ws-red/5 px-4 py-3 text-sm text-ws-sage">
            {error}{" "}
            <Link href="/briefing" className="font-medium text-ws-primary underline">Book a briefing instead →</Link>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about workforce risk…"
          className="flex-1 rounded-lg border border-ws-border bg-ws-cloud px-4 py-3 text-sm text-ws-ink outline-none focus:border-ws-primary"
        />
        <Button type="submit" variant="primary" disabled={streaming || !input.trim()}>➤</Button>
      </form>
      <p className="mt-2 text-center text-[11px] text-ws-text-dim">
        Insights are illustrative, not diagnostic. WejdenSpire measures the real signals.{" "}
        <Link href="/briefing" className="text-ws-primary">Book a briefing</Link>
      </p>
    </div>
  );
}
