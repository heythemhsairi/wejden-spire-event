import { ADVISOR_SYSTEM_PROMPT } from "@/lib/advisor-knowledge";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Resolve which provider to use based on which key is set.
 * Supports Google Gemini (free tier) and Vercel AI Gateway (Claude), both via
 * their OpenAI-compatible /chat/completions endpoints (same SSE stream format).
 */
function resolveProvider() {
  // Groq — free, no card, fast. https://console.groq.com/keys
  const groq = process.env.GROQ_API_KEY;
  if (groq) {
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: groq,
      model: process.env.ADVISOR_MODEL || "llama-3.3-70b-versatile",
    };
  }
  // OpenRouter — many models, some free. https://openrouter.ai/keys
  const openrouter = process.env.OPENROUTER_API_KEY;
  if (openrouter) {
    return {
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: openrouter,
      model: process.env.ADVISOR_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
    };
  }
  // Google Gemini — free tier is region-restricted (may be unavailable). https://aistudio.google.com/apikey
  const gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (gemini) {
    return {
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: gemini,
      model: process.env.ADVISOR_MODEL || "gemini-2.0-flash",
    };
  }
  // Vercel AI Gateway — Claude. https://vercel.com (AI Gateway)
  const gateway = process.env.AI_GATEWAY_API_KEY;
  if (gateway) {
    return {
      url: "https://ai-gateway.vercel.sh/v1/chat/completions",
      apiKey: gateway,
      model: process.env.ADVISOR_MODEL || "anthropic/claude-opus-4-8",
    };
  }
  return null;
}

/**
 * AI Workforce Advisor streaming endpoint.
 * Set GEMINI_API_KEY (free, https://aistudio.google.com/apikey) or AI_GATEWAY_API_KEY.
 * Streams plain text chunks. Returns 503 with a friendly message when no key is set.
 */
export async function POST(req: Request) {
  const provider = resolveProvider();
  if (!provider) {
    return new Response(
      JSON.stringify({ error: "advisor_unconfigured", message: "The AI Advisor is not configured yet. Add GEMINI_API_KEY (free) or AI_GATEWAY_API_KEY to enable it." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12) // cap context
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0) return new Response("No messages", { status: 400 });

  // OpenAI-compatible streaming request (works for both Gemini and the Gateway).
  const upstream = await fetch(provider.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      stream: true,
      max_tokens: 900,
      messages: [{ role: "system", content: ADVISOR_SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: "advisor_upstream", message: "The advisor is busy. Please try again.", detail: text.slice(0, 300) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  // Transform OpenAI SSE chunks into a plain text stream for the client.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore non-JSON keepalive lines
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
