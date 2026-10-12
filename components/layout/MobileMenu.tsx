"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { sections } from "@/content/sections";
import { profile } from "@/content/profile";
import { ui, useUI } from "@/lib/store";
import { ease } from "@/lib/motion";
import { SectionLink } from "./NavLink";

const items = sections.filter((s) => s.id !== "top");

export default function MobileMenu() {
  const open = useUI((s) => s.overlay === "menu");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ui.close();
      if (e.key !== "Tab" || !ref.current) return;
      const focusables = ref.current.querySelectorAll<HTMLElement>("a, button");
      const a = focusables[0];
      const z = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            ref={ref}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="bg-bg fixed inset-0 z-40 flex flex-col pt-(--header-h) lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: ease.reveal }}
          >
            <nav aria-label="Sections" className="container-x flex-1 overflow-y-auto py-6">
              <ul className="flex flex-col">
                {items.map((s, i) => (
                  <li key={s.id} className="border-line overflow-hidden border-b">
                    <m.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, ease: ease.reveal, delay: 0.15 + i * 0.05 }}
                    >
                      <SectionLink
                        id={s.id}
                        onNavigate={() => ui.close()}
                        className="flex items-baseline gap-4 py-3"
                      >
                        <span className="label text-accent">{s.number}</span>
                        <span className="font-display text-[clamp(2.25rem,10vw,3.5rem)] leading-none">
                          {s.label}
                        </span>
                      </SectionLink>
                    </m.div>
                  </li>
                ))}
              </ul>
            </nav>
            <m.div
              className="container-x border-line flex flex-wrap items-center justify-between gap-4 border-t py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <a href={`mailto:${profile.email}`} className="label text-muted">
                {profile.email}
              </a>
              <button
                type="button"
                className="label border-line text-fg rounded-full border px-3 py-2"
                onClick={() => ui.askChat()}
              >
                Ask my portfolio
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
