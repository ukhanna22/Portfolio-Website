"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scrollToId } from "@/lib/scroll";

/** Links to a home-page section: smooth-scrolls on the home page, navigates elsewhere. */
export function SectionLink({
  id,
  children,
  className,
  onNavigate,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const href = id === "top" ? "/" : `/#${id}`;
  return (
    <Link
      href={href}
      className={className}
      transitionTypes={pathname === "/" ? undefined : ["nav-back"]}
      onClick={(e) => {
        onNavigate?.();
        if (pathname !== "/") return;
        e.preventDefault();
        scrollToId(id);
      }}
    >
      {children}
    </Link>
  );
}
