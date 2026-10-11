"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { sections } from "@/content/sections";
import { profile } from "@/content/profile";
import { ui, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useModKey } from "@/lib/platform";
import { SectionLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });

const navItems = sections.filter((s) => s.nav);

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = useUI((s) => s.overlay);
  const mod = useModKey();
  const isMac = mod === "⌘";

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuOpen = overlay === "menu";
  const [menuLoaded, setMenuLoaded] = useState(false);
  if (menuOpen && !menuLoaded) setMenuLoaded(true);

  return (
    <>
      <header
        className={cn(
          "no-print fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out",
          hidden && !menuOpen && "-translate-y-full",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 border-b transition-all duration-500",
            scrolled && !menuOpen ? "border-line bg-bg/70 backdrop-blur-xl" : "border-transparent",
          )}
        />
        <nav
          aria-label="Primary"
          className="container-x flex h-(--header-h) items-center justify-between"
        >
          <SectionLink
            id="top"
            className="group relative z-10 flex items-center gap-3"
            onNavigate={() => ui.close()}
          >
            <span className="font-display text-[1.65rem] leading-none tracking-tight">
              U<span className="text-accent">K</span>
            </span>
            <span className="sr-only">{profile.name}, home</span>
            <span
              aria-hidden
              className="label text-muted group-hover:text-fg hidden transition-colors md:inline"
            >
              {profile.role}
            </span>
          </SectionLink>

          <div className="flex items-center gap-1 md:gap-2">
            <ul className="mr-2 hidden items-center gap-1 lg:flex">
              {navItems.map((s) => (
                <li key={s.id}>
                  <SectionLink
                    id={s.id}
                    className="label text-muted hover:text-fg rounded-full px-3 py-2 transition-colors"
                  >
                    <span className="text-accent/80">{s.number}</span> {s.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => ui.open("palette")}
              className="label border-line text-muted hover:border-line-strong hover:text-fg hidden h-9 items-center gap-2 rounded-full border px-3 transition-colors sm:flex"
              aria-label="Open command palette"
              aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
            >
              <kbd className="font-mono">{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd className="font-mono">K</kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="border-line relative z-10 ml-1 grid size-9 place-items-center rounded-full border lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => ui.toggle("menu")}
            >
              <span className="relative block h-2.5 w-4">
                <span
                  className={cn(
                    "bg-fg ease-reveal absolute top-0 left-0 h-px w-4 transition-transform duration-500",
                    menuOpen && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "bg-fg ease-reveal absolute bottom-0 left-0 h-px w-4 transition-transform duration-500",
                    menuOpen && "-translate-y-[4px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>
      {menuLoaded && <MobileMenu />}
    </>
  );
}
