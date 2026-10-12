"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";

const START_MS = 1300; // after the name reveal begins
const CHAR_MS = 30;
const HOLD_MS = 4200;

/**
 * Types the taglines in after the name, then rotates between them.
 * Without JS (or with reduced motion) the first line is simply shown.
 */
export function TypeRotator({ lines }: { lines: readonly string[] }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const html = document.documentElement;
    let timer = 0;
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));

    const type = async (line: string) => {
      for (let i = 1; i <= line.length && !cancelled; i++) {
        setText(line.slice(0, i));
        await wait(CHAR_MS + (line[i - 1] === "." ? 180 : 0));
      }
    };
    const erase = async (line: string) => {
      for (let i = line.length; i >= 0 && !cancelled; i--) {
        setText(line.slice(0, i));
        await wait(12);
      }
    };

    const run = async () => {
      await wait(START_MS);
      if (cancelled) return;
      setText("");
      let index = 0;
      await type(lines[0]);
      while (!cancelled && lines.length > 1) {
        await wait(HOLD_MS);
        await erase(lines[index]);
        index = (index + 1) % lines.length;
        await wait(220);
        await type(lines[index]);
      }
    };

    if (html.classList.contains("reveal")) void run();
    const mo = new MutationObserver(() => {
      if (html.classList.contains("reveal")) {
        mo.disconnect();
        void run();
      }
    });
    if (!html.classList.contains("reveal"))
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelled = true;
      mo.disconnect();
      clearTimeout(timer);
    };
  }, [lines]);

  return (
    <p className="text-lede text-muted min-h-[3em] max-w-xl">
      <span className="sr-only">{lines[0]}</span>
      <span aria-hidden className="tagline" data-state={text === null ? "idle" : "typing"}>
        {text ?? lines[0]}
        <span className="caret" />
      </span>
    </p>
  );
}
