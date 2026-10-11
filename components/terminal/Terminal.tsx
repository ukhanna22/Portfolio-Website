"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { experience } from "@/content/experience";
import { paper } from "@/content/research";
import { copyEmail, goToSection, resumeHref } from "@/lib/commands";
import { ui, useUI } from "@/lib/store";
import { ease } from "@/lib/motion";
import { Close } from "@/components/ui/icons";

type Line = { id: number; kind: "in" | "out" | "accent" | "muted"; text: string };

const HELP = [
  "whoami            who is this",
  "cat about.txt     the short version",
  "ls projects       selected work",
  "open <project>    read a case study (e.g. open wellness-ai)",
  "experience        where I've worked",
  "skills            what I work with",
  "paper             the IEEE publication",
  "contact           how to reach me",
  "resume            open the résumé",
  "ask <question>    ask the portfolio bot",
  "theme             toggle light / dark",
  "clear             clear the screen",
  "exit              close the terminal",
];

const BANNER = [
  "utkarsh@latent-space ~ % welcome",
  "Type `help` to see what this terminal knows. ↑/↓ for history, Tab to complete.",
];

let nextId = 0;
const mk = (kind: Line["kind"], text: string): Line => ({ id: nextId++, kind, text });

export default function Terminal() {
  const open = useUI((s) => s.overlay === "terminal");
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((t, i) => mk(i ? "muted" : "accent", t)),
  );
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => input.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  /** Prints output lines with a quick typed-out animation. */
  const print = (texts: string[], kind: Line["kind"] = "out") => {
    queue.current = queue.current.then(async () => {
      setTyping(true);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      for (const text of texts) {
        const line = mk(kind, "");
        setLines((l) => [...l, line]);
        if (reduce || text.length === 0) {
          setLines((l) => l.map((x) => (x.id === line.id ? { ...x, text } : x)));
          continue;
        }
        const step = Math.max(2, Math.ceil(text.length / 18));
        for (let i = step; i < text.length + step; i += step) {
          const slice = text.slice(0, i);
          setLines((l) => l.map((x) => (x.id === line.id ? { ...x, text: slice } : x)));
          await new Promise((r) => setTimeout(r, 12));
        }
      }
      setTyping(false);
    });
  };

  const exec = (raw: string) => {
    const cmd = raw.trim();
    // echo through the same queue so output never interleaves with a previous command
    queue.current = queue.current.then(() => setLines((l) => [...l, mk("in", cmd)]));
    if (!cmd) return;
    history.current = [cmd, ...history.current.filter((h) => h !== cmd)].slice(0, 50);
    cursor.current = -1;
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    switch (head.toLowerCase()) {
      case "help":
      case "?":
        return print(HELP);
      case "whoami":
        return print([
          `${profile.name} — ${profile.role}`,
          `${profile.currently.label}`,
          `${profile.location}`,
        ]);
      case "cat":
        if (/about(\.txt)?/.test(arg)) return print(profile.about.flatMap((p) => [p, ""]));
        return print([`cat: ${arg || "<file>"}: No such file. Try \`cat about.txt\`.`], "muted");
      case "ls":
        if (!arg || /projects?|work/.test(arg))
          return print(projects.map((p) => `${p.slug.padEnd(26)} ${p.category}`));
        return print([`ls: ${arg}: Not a directory. Try \`ls projects\`.`], "muted");
      case "open":
      case "cd": {
        const p = projects.find(
          (x) => x.slug === arg || x.title.toLowerCase() === arg.toLowerCase(),
        );
        if (!p) return print([`open: no project named "${arg}". Run \`ls projects\`.`], "muted");
        print([`Opening ${p.title}…`], "accent");
        ui.close();
        return router.push(`/work/${p.slug}`);
      }
      case "experience":
        return print(
          experience.map((e) => `${`${e.start} – ${e.end}`.padEnd(22)} ${e.company} · ${e.role}`),
        );
      case "skills":
        return print(
          skillGroups.map((g) => `${g.title.padEnd(20)} ${g.skills.map((s) => s.name).join(", ")}`),
        );
      case "paper":
      case "research":
        return print([paper.title, `${paper.authors.join(", ")} · ${paper.venueShort}`, paper.url]);
      case "contact":
        void copyEmail();
        return print([
          `email     ${profile.email}  (copied)`,
          `linkedin  ${profile.links.linkedin}`,
          `github    ${profile.links.github}`,
        ]);
      case "resume":
      case "cv":
        print(["Opening résumé…"], "accent");
        ui.close();
        return router.push(resumeHref());
      case "ask":
        ui.askChat(arg || undefined);
        return;
      case "theme":
        ui.setTheme(ui.get().theme === "dark" ? "light" : "dark");
        return print([`theme set to ${ui.get().theme}`], "muted");
      case "goto":
        ui.close();
        return goToSection(arg || "top", router);
      case "clear":
        queue.current = queue.current.then(() => setLines([]));
        return;
      case "exit":
      case "quit":
        return ui.close();
      case "sudo":
        if (/hire\s+utkarsh/i.test(arg))
          return print(
            [
              "[sudo] password for recruiter: ********",
              "Verifying credentials… IEEE paper ✓  pipelines ✓  LoRA ✓",
              "Permission granted. Drafting offer letter → " + profile.email,
              "(Seriously though, email me. I reply fast.)",
            ],
            "accent",
          );
        return print([`${arg || "sudo"}: permission denied. Nice try.`], "muted");
      case "rm":
        return print(["rm: refusing to delete anything from latent space."], "muted");
      default:
        return print([`command not found: ${head}. Type \`help\`.`], "muted");
    }
  };

  const complete = () => {
    const words = [
      "help",
      "whoami",
      "cat about.txt",
      "ls projects",
      "experience",
      "skills",
      "paper",
      "contact",
      "resume",
      "theme",
      "clear",
      "exit",
      "sudo hire utkarsh",
      ...projects.map((p) => `open ${p.slug}`),
    ];
    const match = words.find((w) => w.startsWith(value) && w !== value);
    if (match) setValue(match);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "`" && value === "") {
      e.preventDefault();
      ui.close();
    } else if (e.key === "Enter") {
      e.preventDefault();
      exec(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cursor.current = Math.min(history.current.length - 1, cursor.current + 1);
      setValue(history.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor.current = Math.max(-1, cursor.current - 1);
      setValue(cursor.current === -1 ? "" : history.current[cursor.current]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            className="border-line-strong fixed inset-x-0 top-0 z-[80] border-b bg-[#050608]/95 font-mono text-[0.82rem] text-[#d7dbe0] shadow-(--shadow) backdrop-blur-xl"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: ease.reveal }}
            onClick={() => input.current?.focus()}
            data-lenis-prevent
          >
            <div className="container-x flex items-center justify-between border-b border-white/10 py-2.5">
              <span className="label text-[#8a8f98]">utkarsh@latent-space — zsh</span>
              <button
                type="button"
                onClick={() => ui.close()}
                aria-label="Close terminal"
                className="grid size-7 place-items-center rounded-full text-[#8a8f98] hover:text-white"
              >
                <Close />
              </button>
            </div>
            <div
              ref={scroller}
              className="container-x h-[min(52vh,30rem)] overflow-y-auto py-4"
              aria-live="polite"
              aria-busy={typing}
            >
              {lines.map((l) => (
                <p
                  key={l.id}
                  className={
                    l.kind === "in"
                      ? "text-white"
                      : l.kind === "accent"
                        ? "text-[#4ff0d2]"
                        : l.kind === "muted"
                          ? "text-[#8a8f98]"
                          : "whitespace-pre-wrap text-[#c5cad1]"
                  }
                >
                  {l.kind === "in" && <span className="mr-2 text-[#4ff0d2]">❯</span>}
                  {l.text || " "}
                </p>
              ))}
              <div className="flex items-center">
                <span className="mr-2 text-[#4ff0d2]">❯</span>
                <label htmlFor="terminal-input" className="sr-only">
                  Terminal command
                </label>
                <input
                  id="terminal-input"
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKey}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-white caret-[#4ff0d2] outline-none"
                />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
