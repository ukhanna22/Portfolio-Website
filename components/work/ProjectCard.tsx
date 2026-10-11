"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import type { Project } from "@/content/projects";

export type CardData = Pick<Project, "slug" | "title" | "category" | "hook" | "stack" | "art">;
import { isTodo } from "@/content/todo";
import { ProjectArt } from "./ProjectArt";
import { ArrowUpRight } from "@/components/ui/icons";
import { isFinePointer, prefersReducedMotion } from "@/lib/utils";

/** Gallery card: tilts in 3D on hover, reveals the stack, scales the art inside its mask. */
export function ProjectCard({ project, index }: { project: CardData; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !isFinePointer() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const stack = project.stack.filter((s) => !isTodo(s));

  return (
    <Link
      ref={ref}
      href={`/work/${project.slug}`}
      transitionTypes={["nav-forward"]}
      data-cursor="View"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group border-line bg-surface/80 hover:border-line-strong relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-[transform,border-color] duration-500 ease-out will-change-transform"
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="label text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="label text-muted">{project.category}</span>
      </div>
      <div className="border-line bg-bg relative mx-5 mt-4 aspect-[4/3] overflow-hidden rounded-xl border lg:aspect-auto lg:min-h-0 lg:flex-1">
        <ProjectArt
          variant={project.art}
          className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-col gap-3 p-5 pt-5">
        <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
          <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.02]">
            {project.title}
          </h3>
        </ViewTransition>
        <p className="text-muted line-clamp-3 text-[0.95rem] leading-relaxed">{project.hook}</p>
        <div className="flex items-end justify-between gap-4 pt-1">
          <ul className="flex flex-wrap gap-1.5 transition-all duration-500 ease-out lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
            {stack.slice(0, 4).map((s) => (
              <li
                key={s}
                className="border-line text-muted rounded-full border px-2 py-0.5 font-mono text-[0.68rem]"
              >
                {s}
              </li>
            ))}
          </ul>
          <span className="border-line text-fg group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500">
            <ArrowUpRight />
            <span className="sr-only">Read the {project.title} case study</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
