"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { buildCommands, score, type Command } from "@/lib/commands";
import { ui, useUI } from "@/lib/store";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Search } from "@/components/ui/icons";

export default function CommandPalette() {
  const open = useUI((s) => s.overlay === "palette");
  const router = useRouter();
  const commands = useMemo(() => buildCommands(router), [router]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const listId = useId();

  const results = useMemo(() => {
    return commands
      .map((c) => ({
        c,
        s: Math.max(
          score(query, c.label) * 2,
          score(query, `${c.label} ${c.keywords ?? ""} ${c.group}`),
        ),
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => (query ? b.s - a.s : 0))
      .map((r) => r.c);
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => input.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      restore.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    ui.close();
    setQuery("");
    setActive(0);
    // let the dialog close (and focus restore) before scrolling or navigating
    requestAnimationFrame(() => c.run());
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            className="bg-bg/60 fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseDown={(e) => e.target === e.currentTarget && ui.close()}
            data-lenis-prevent
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="border-line-strong bg-elevated w-full max-w-xl overflow-hidden rounded-2xl border shadow-(--shadow)"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: ease.out }}
            >
              <div className="border-line flex items-center gap-3 border-b px-4">
                <Search className="text-muted" />
                <input
                  ref={input}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKey}
                  placeholder="Jump to a section, project or action…"
                  className="text-fg placeholder:text-muted h-14 w-full bg-transparent text-[0.95rem] outline-none"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={
                    results[active] ? `${listId}-${results[active].id}` : undefined
                  }
                  aria-autocomplete="list"
                  aria-label="Search commands"
                />
                <kbd className="label border-line text-muted rounded border px-1.5 py-0.5">Esc</kbd>
              </div>
              <ul
                ref={list}
                id={listId}
                role="listbox"
                aria-label="Commands"
                className="max-h-[min(60vh,26rem)] overflow-y-auto p-2"
              >
                {results.length === 0 && (
                  <li className="text-muted px-3 py-8 text-center text-sm">
                    Nothing in this corner of latent space.
                  </li>
                )}
                {results.map((c, i) => {
                  const header =
                    !query && (i === 0 || results[i - 1].group !== c.group) ? c.group : null;
                  return (
                    <li key={c.id} role="presentation">
                      {header && <p className="label text-muted/80 px-3 pt-3 pb-1.5">{header}</p>}
                      <div
                        id={`${listId}-${c.id}`}
                        role="option"
                        aria-selected={i === active}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => run(c)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          i === active ? "bg-accent-soft text-fg" : "text-muted",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={cn(
                              "size-1.5 rounded-full",
                              i === active ? "bg-accent" : "bg-line-strong",
                            )}
                          />
                          {c.label}
                        </span>
                        {c.hint && (
                          <span className="label text-muted truncate text-[0.62rem]">{c.hint}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="label border-line text-muted flex items-center justify-between border-t px-4 py-2.5 text-[0.62rem]">
                <span>↑↓ to move · ↵ to run</span>
                <span>` opens the terminal</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
