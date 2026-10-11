"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { profile } from "@/content/profile";
import { ui, useUI } from "@/lib/store";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Close, Send, Spark } from "@/components/ui/icons";

type Source = { n: number; label: string; href: string };
type Msg = {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  error?: string;
  pending?: boolean;
};

const STARTERS = [
  "What did Utkarsh publish at IEEE?",
  "What does Utkarsh do at Publicis Re:Sources?",
  "Which projects used RAG or LLM fine-tuning?",
];

const ERRORS: Record<string, string> = {
  rate_limited:
    "That's a lot of questions in a short time. Give it a minute, or email Utkarsh directly:",
  busy: "The model is busy right now. Try again in a moment, or email Utkarsh directly:",
  quota: "The bot has hit its usage limit for now. Email Utkarsh instead:",
  unavailable: "The bot is offline at the moment. Email Utkarsh instead:",
  refusal: "That's not something I can answer here. For anything else, email:",
  network: "Couldn't reach the server. You can always email:",
  bad_request: "Something about that message didn't go through. Try rephrasing, or email:",
};

const MAX = 500;
let uid = 0;

/** Renders [n] markers as links to the cited section. */
function withCitations(text: string, sources: Source[] = []) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((p, i) => {
    const match = p.match(/^\[(\d+)\]$/);
    const src = match && sources.find((s) => s.n === Number(match[1]));
    if (!src) return <span key={i}>{p}</span>;
    return (
      <Link
        key={i}
        href={src.href}
        onClick={() => ui.close()}
        className="bg-accent-soft text-accent hover:bg-accent hover:text-accent-ink mx-0.5 inline-grid size-4 place-items-center rounded-full align-[0.15em] font-mono text-[0.6rem] no-underline"
        title={`See: ${src.label}`}
      >
        {src.n}
      </Link>
    );
  });
}

function Answer({ msg }: { msg: Msg }) {
  const lines = msg.content.split(/\n+/).filter(Boolean);
  const cited = (msg.sources ?? []).filter((s) => msg.content.includes(`[${s.n}]`));
  const seen = new Set<string>();
  const unique = cited.filter((s) =>
    seen.has(s.href + s.label) ? false : (seen.add(s.href + s.label), true),
  );
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const bullet = /^\s*[-*•]\s+/.test(line);
        const text = line.replace(/^\s*[-*•]\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1");
        return (
          <p
            key={i}
            className={cn(
              bullet &&
                "before:bg-accent relative pl-4 before:absolute before:top-[0.65em] before:left-0 before:size-1 before:rounded-full",
            )}
          >
            {withCitations(text, msg.sources)}
          </p>
        );
      })}
      {!msg.pending && unique.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {unique.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              onClick={() => ui.close()}
              className="label border-line text-muted hover:border-accent hover:text-accent rounded-full border px-2 py-1 text-[0.6rem] transition-colors"
            >
              See: {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatPanel() {
  const open = useUI((s) => s.overlay === "chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    // Full-screen sheet on phones: keep the page behind it from scrolling.
    const lock = window.matchMedia("(max-width: 639px)").matches;
    if (lock) document.documentElement.style.overflow = "hidden";
    return () => {
      if (lock) document.documentElement.style.overflow = "";
      cancelAnimationFrame(id);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim().slice(0, MAX);
      if (!q || busy) return;
      setInput("");
      setBusy(true);
      const user: Msg = { id: uid++, role: "user", content: q };
      const reply: Msg = { id: uid++, role: "assistant", content: "", pending: true };
      const history = [...messages, user]
        .filter((m) => !m.error)
        .map(({ role, content }) => ({ role, content }));
      setMessages((ms) => [...ms, user, reply]);
      const patch = (fn: (m: Msg) => Msg) =>
        setMessages((ms) => ms.map((m) => (m.id === reply.id ? fn(m) : m)));

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          patch((m) => ({ ...m, pending: false, error: err.error ?? "unavailable" }));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const rows = buffer.split("\n");
          buffer = rows.pop() ?? "";
          for (const row of rows) {
            if (!row) continue;
            const ev = JSON.parse(row) as {
              type: string;
              text?: string;
              sources?: Source[];
              error?: string;
            };
            if (ev.type === "sources") patch((m) => ({ ...m, sources: ev.sources }));
            else if (ev.type === "delta") patch((m) => ({ ...m, content: m.content + ev.text }));
            else if (ev.type === "error")
              patch((m) => ({
                ...m,
                error: ev.error,
                content: ev.error === "refusal" ? "" : m.content,
              }));
          }
        }
        patch((m) => ({ ...m, pending: false }));
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          patch((m) => ({ ...m, pending: false, error: "network" }));
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages],
  );

  // Questions handed over from the palette or terminal arrive through the UI store.
  const askRef = useRef(ask);
  useEffect(() => {
    askRef.current = ask;
  }, [ask]);
  useEffect(() => {
    const check = () => {
      const { overlay, chatSeed } = ui.get();
      if (overlay === "chat" && chatSeed) {
        ui.set({ chatSeed: null });
        void askRef.current(chatSeed);
      }
    };
    queueMicrotask(check);
    return ui.subscribe(check);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            className="border-line-strong bg-elevated fixed inset-0 z-[78] flex flex-col overflow-hidden shadow-(--shadow) sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(40rem,calc(100dvh-3rem))] sm:w-[25rem] sm:rounded-2xl sm:border"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: ease.out }}
            onKeyDown={(e) => e.key === "Escape" && ui.close()}
            data-lenis-prevent
          >
            <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2
                  id="chat-title"
                  className="font-display flex items-center gap-2 text-2xl leading-none"
                >
                  <span className="bg-accent text-accent-ink grid size-6 place-items-center rounded-full">
                    <Spark width={13} height={13} />
                  </span>
                  Ask my portfolio
                </h2>
                <p className="label text-muted mt-2 text-[0.6rem]">
                  Answers only from this site ·{" "}
                  <Link
                    href="/work/ask-my-portfolio"
                    className="text-fg hover:text-accent underline underline-offset-2"
                    onClick={() => ui.close()}
                  >
                    How this works
                  </Link>
                </p>
              </div>
              <button
                type="button"
                onClick={() => ui.close()}
                className="border-line text-muted hover:text-fg grid size-8 place-items-center rounded-full border"
                aria-label="Close chat"
              >
                <Close />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-[0.92rem] leading-relaxed"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-muted">
                    Hi, I&apos;m a small retrieval-augmented model grounded in {profile.firstName}
                    &apos;s own content. Ask about experience, projects, research or skills. If it
                    isn&apos;t on this site, I&apos;ll say so.
                  </p>
                  <ul className="space-y-2">
                    {STARTERS.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => ask(q)}
                          className="border-line text-fg hover:border-accent w-full rounded-xl border px-3.5 py-2.5 text-left transition-colors"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <p className="bg-accent text-accent-ink max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2">
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div key={msg.id} className="max-w-[95%]">
                    {msg.pending && !msg.content && !msg.error && (
                      <span className="inline-flex gap-1 py-2" aria-label="Thinking">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="bg-accent size-1.5 animate-pulse rounded-full"
                            style={{ animationDelay: `${i * 0.18}s` }}
                          />
                        ))}
                      </span>
                    )}
                    {msg.content && <Answer msg={msg} />}
                    {msg.error && (
                      <p className="border-line bg-surface text-muted mt-2 rounded-xl border px-3.5 py-2.5">
                        {ERRORS[msg.error] ?? ERRORS.unavailable}{" "}
                        <a
                          href={`mailto:${profile.email}`}
                          className="text-accent underline underline-offset-2"
                        >
                          {profile.email}
                        </a>
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>

            <form
              className="border-line border-t p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
            >
              <div className="border-line bg-bg focus-within:border-accent flex items-end gap-2 rounded-xl border px-3 py-2">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void ask(input);
                    }
                  }}
                  placeholder="Ask about Utkarsh…"
                  className="text-fg placeholder:text-muted [field-sizing:content] max-h-28 min-h-6 flex-1 resize-none bg-transparent py-1 text-[0.92rem] outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="bg-accent text-accent-ink grid size-8 shrink-0 place-items-center rounded-lg transition-opacity disabled:opacity-30"
                  aria-label="Send question"
                >
                  <Send />
                </button>
              </div>
              <p className="label text-muted mt-2 flex justify-between px-1 text-[0.58rem]">
                <span>Grounded answers · may be imperfect</span>
                <span className="tabular-nums">
                  {input.length}/{MAX}
                </span>
              </p>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
