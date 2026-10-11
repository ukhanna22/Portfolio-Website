"use client";

import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { sections } from "@/content/sections";
import { paper } from "@/content/research";
import { isTodo } from "@/content/todo";
import { scrollToId } from "@/lib/scroll";
import { ui } from "@/lib/store";

export type Command = {
  id: string;
  group: "Navigate" | "Work" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
};

type Router = { push: (href: string, opts?: { scroll?: boolean }) => void };

export const resumeHref = () =>
  isTodo(profile.resume.pdf) ? profile.resume.page : profile.resume.pdf;

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    ui.toast("Email copied to clipboard");
  } catch {
    ui.toast(profile.email);
  }
}

export function goToSection(id: string, router: Router) {
  if (window.location.pathname === "/") scrollToId(id);
  else router.push(id === "top" ? "/" : `/#${id}`);
}

const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

export function buildCommands(router: Router): Command[] {
  return [
    ...sections.map((s) => ({
      id: `nav-${s.id}`,
      group: "Navigate" as const,
      label: s.label,
      hint: s.number,
      keywords: `section go ${s.id}`,
      run: () => goToSection(s.id, router),
    })),
    ...projects.map((p) => ({
      id: `work-${p.slug}`,
      group: "Work" as const,
      label: p.title,
      hint: p.category,
      keywords: `${p.stack.join(" ")} ${p.short} case study`,
      run: () => router.push(`/work/${p.slug}`),
    })),
    {
      id: "chat",
      group: "Actions",
      label: "Ask my portfolio",
      hint: "AI",
      keywords: "chat bot rag question",
      run: () => ui.askChat(),
    },
    {
      id: "theme",
      group: "Actions",
      label: "Toggle theme",
      hint: "light / dark",
      keywords: "dark light mode color",
      run: () => ui.setTheme(ui.get().theme === "dark" ? "light" : "dark"),
    },
    {
      id: "email",
      group: "Actions",
      label: "Copy email",
      hint: profile.email,
      keywords: "contact mail",
      run: copyEmail,
    },
    {
      id: "resume",
      group: "Actions",
      label: "Download résumé",
      hint: "CV",
      keywords: "resume cv pdf",
      run: () => router.push(resumeHref()),
    },
    {
      id: "terminal",
      group: "Actions",
      label: "Open terminal",
      hint: "`",
      keywords: "console shell cli",
      run: () => ui.open("terminal"),
    },
    {
      id: "paper",
      group: "Elsewhere",
      label: "Read the IEEE paper",
      hint: "DOI",
      keywords: "research publication",
      run: () => openExternal(paper.url),
    },
    {
      id: "linkedin",
      group: "Elsewhere",
      label: "LinkedIn",
      keywords: "social profile",
      run: () => openExternal(profile.links.linkedin),
    },
    {
      id: "github",
      group: "Elsewhere",
      label: "GitHub",
      keywords: "code source",
      run: () => openExternal(profile.links.github),
    },
  ];
}

/** Subsequence match with a bonus for word starts and contiguous runs. */
export function score(query: string, text: string) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let ti = 0;
  let s = 0;
  let run = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    run = found === ti ? run + 1 : 0;
    s += 1 + run * 2 + (found === 0 || t[found - 1] === " " ? 3 : 0);
    ti = found + 1;
  }
  return s;
}
