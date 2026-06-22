"use client";

import { useRef, useState } from "react";
import { IconTalk } from "@/components/ws/icons";

interface Msg { role: "user" | "assistant"; content: string }

const CHIPS = [
  "I'm feeling stressed",
  "I'm exhausted lately",
  "How do I set boundaries?",
  "I feel unappreciated",
];

export function EmployeeAssistant() {
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
        body: JSON.stringify({ messages: next, mode: "employee" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "The assistant is resting right now. Please try again in a moment.");
        setMessages(next);
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
      setError("Connection hiccup. Please try again.");
      setMessages(next);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ws-ink">
        <IconTalk size={24} className="text-ws-purple-dark" /> Talk it through
      </h2>
      <p className="mt-1 text-sm text-ws-sage">A warm, private space. Share whatever&apos;s on your mind.</p>

      <div ref={scrollRef} className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-ws-border bg-white p-5">
        {messages.length === 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ws-text-dim">You could start with…</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => send(c)} className="rounded-full border border-ws-border bg-ws-cloud px-3.5 py-2 text-sm text-ws-sage transition hover:border-ws-primary/50 hover:text-ws-ink">{c}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-ws-primary text-white" : "border border-ws-border bg-ws-cloud text-ws-ink"}`}>
              {m.content || (streaming && i === messages.length - 1 ? <span className="animate-ws-pulse text-ws-sage">…</span> : m.content)}
            </div>
          </div>
        ))}
        {error && <div className="rounded-xl border border-ws-purple/25 bg-ws-soft-purple px-4 py-3 text-sm text-ws-ink">{error}</div>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type how you're feeling…" className="flex-1 rounded-full border border-ws-border bg-white px-4 py-3 text-sm text-ws-ink outline-none focus:border-ws-primary" />
        <button type="submit" disabled={streaming || !input.trim()} className="rounded-full bg-ws-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-ws-primary-dark disabled:opacity-50">Send</button>
      </form>
      <p className="mt-2 text-center text-[11px] text-ws-text-dim">Supportive, not a medical service. In a crisis, please reach out to someone you trust or a professional.</p>
    </div>
  );
}
