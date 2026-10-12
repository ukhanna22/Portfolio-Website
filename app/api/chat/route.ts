import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/rag/retrieve";
import { rateLimit } from "@/lib/rag/rate-limit";
import { SYSTEM_PROMPT, contextBlock } from "@/lib/rag/prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
// Server-side refusal fallback is available on these models; Haiku has none.
const SUPPORTS_FALLBACK = /^claude-(opus-5|fable-5|sonnet-5-5)/.test(MODEL);
const MAX_QUESTION = 500;
const MAX_TURNS = 8;

type Turn = { role: "user" | "assistant"; content: string };

const json = (status: number, body: object, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

function parse(body: unknown): Turn[] | null {
  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { messages?: unknown }).messages)
  )
    return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const turns: Turn[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    turns.push({ role, content: content.slice(0, role === "user" ? MAX_QUESTION : 1500) });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

export async function POST(req: Request) {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return json(
      429,
      { error: "rate_limited", retryAfter: limit.retryAfter },
      { "retry-after": String(limit.retryAfter) },
    );
  }

  let turns: Turn[] | null = null;
  try {
    turns = parse(await req.json());
  } catch {}
  if (!turns) return json(400, { error: "bad_request" });

  const question = turns[turns.length - 1].content.trim();
  if (!question) return json(400, { error: "empty" });
  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: "unavailable" });

  // Retrieval uses the latest question plus the previous one, so follow-ups ("and the stack?") still match.
  const previous = turns.filter((t) => t.role === "user").slice(-2, -1)[0]?.content ?? "";
  const sources = await retrieve(`${question} ${previous}`.trim());

  const messages: Anthropic.Beta.BetaMessageParam[] = turns
    .slice(0, -1)
    .map((t) => ({ role: t.role, content: t.content }));
  messages.push({
    role: "user",
    content: `<context>\n${contextBlock(sources)}\n</context>\n\nQuestion: ${question}`,
  });

  const client = new Anthropic({ maxRetries: 1, timeout: 25_000 });
  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, data: object) =>
    controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

  const stream = new ReadableStream({
    async start(controller) {
      send(controller, {
        type: "sources",
        sources: sources.map((s, i) => ({ n: i + 1, label: s.label, href: s.href })),
      });
      try {
        const response = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 2048,
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages,
            output_config: { effort: "low" },
            ...(SUPPORTS_FALLBACK
              ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
              : {}),
          },
          { signal: req.signal },
        );
        response.on("text", (delta) => send(controller, { type: "delta", text: delta }));
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal") send(controller, { type: "error", error: "refusal" });
        send(controller, { type: "done" });
      } catch (err) {
        const code =
          err instanceof Anthropic.RateLimitError
            ? "busy"
            : err instanceof Anthropic.APIError && (err.status === 402 || err.status === 403)
              ? "quota"
              : "unavailable";
        if (!(err instanceof Anthropic.APIUserAbortError))
          console.error("[chat]", err instanceof Error ? err.message : err);
        send(controller, { type: "error", error: code });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
