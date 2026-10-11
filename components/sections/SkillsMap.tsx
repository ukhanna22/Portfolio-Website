"use client";

import Link from "next/link";
import { useState } from "react";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

/** Hover (or tap) a skill to light up the projects where it was used. */
export function SkillsMap() {
  const [active, setActive] = useState<{ name: string; projects: string[] } | null>(null);
  const [pinned, setPinned] = useState(false);

  const hover = (name: string, list: string[] | undefined) => {
    if (pinned) return;
    setActive({ name, projects: list ?? [] });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-10 lg:col-span-8" onMouseLeave={() => !pinned && setActive(null)}>
        {skillGroups.map((g) => (
          <div
            key={g.id}
            className="border-line grid gap-4 border-t pt-5 md:grid-cols-8"
            data-reveal
          >
            <h3 className="label text-muted md:col-span-2">{g.title}</h3>
            <ul className="flex flex-wrap gap-2 md:col-span-6">
              {g.skills.map((s) => {
                const isActive = active?.name === s.name;
                const linked = (s.projects?.length ?? 0) > 0;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      aria-pressed={pinned && isActive}
                      title={s.note}
                      onMouseEnter={() => hover(s.name, s.projects)}
                      onFocus={() => hover(s.name, s.projects)}
                      onClick={() => {
                        if (pinned && isActive) {
                          setPinned(false);
                          setActive(null);
                        } else {
                          setPinned(true);
                          setActive({ name: s.name, projects: s.projects ?? [] });
                        }
                      }}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-sm transition-all duration-300",
                        isActive
                          ? "border-accent bg-accent text-accent-ink"
                          : active
                            ? "border-line text-muted/60"
                            : "border-line text-fg hover:border-line-strong",
                      )}
                    >
                      {s.name}
                      {s.note && (
                        <span
                          className={cn(
                            "ml-2 font-mono text-[0.68rem]",
                            isActive ? "text-accent-ink/70" : "text-muted",
                          )}
                        >
                          {s.note.length < 18 ? s.note : ""}
                        </span>
                      )}
                      {linked && !isActive && (
                        <span
                          aria-hidden
                          className="bg-accent ml-1.5 inline-block size-1 -translate-y-0.5 rounded-full align-middle"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile: a compact summary pinned to the bottom while a skill is selected */}
      {active && (
        <div
          className="border-accent/50 bg-elevated/95 sticky bottom-20 z-20 -mt-6 rounded-2xl border p-4 shadow-(--shadow) backdrop-blur-xl lg:hidden"
          aria-live="polite"
        >
          <p className="label text-accent">{active.name}</p>
          <p className="text-muted mt-1.5 text-sm">
            {active.projects.length
              ? active.projects.map((slug, i) => {
                  const p = projects.find((x) => x.slug === slug);
                  return p ? (
                    <span key={slug}>
                      {i > 0 && " · "}
                      <Link
                        href={`/work/${slug}`}
                        transitionTypes={["nav-forward"]}
                        className="text-fg underline underline-offset-2"
                      >
                        {p.title}
                      </Link>
                    </span>
                  ) : null;
                })
              : "No case study on this site uses it yet."}
          </p>
        </div>
      )}

      <aside
        className="hidden lg:col-span-4 lg:block"
        aria-label="Projects using the selected skill"
      >
        <div className="border-line bg-surface/70 rounded-2xl border p-5 backdrop-blur-sm lg:sticky lg:top-28">
          <p className="label text-muted" aria-live="polite">
            {active ? (
              <>
                <span className="text-accent">{active.name}</span> · used in{" "}
                {active.projects.length || "no listed"}{" "}
                {active.projects.length === 1 ? "project" : "projects"}
              </>
            ) : (
              "Hover a skill to trace it to the work"
            )}
          </p>
          <ul className="mt-5 space-y-1">
            {projects.map((p) => {
              const on = active?.projects.includes(p.slug);
              return (
                <li key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    transitionTypes={["nav-forward"]}
                    className={cn(
                      "flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 transition-all duration-300",
                      on
                        ? "bg-accent-soft text-fg"
                        : active
                          ? "text-muted/40"
                          : "text-muted hover:text-fg",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-xl transition-transform duration-300",
                        on && "translate-x-1",
                      )}
                    >
                      {p.title}
                    </span>
                    <span className="label shrink-0 text-[0.62rem]">
                      {p.category.split(" · ")[0]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
