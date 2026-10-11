import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { getProject, projects } from "@/content/projects";
import { isTodo, SHOW_TODOS, visible } from "@/content/todo";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { ProjectArt } from "@/components/work/ProjectArt";
import { Chip } from "@/components/ui/Chip";
import { Text } from "@/components/ui/Todo";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { ChatLink } from "@/components/work/ChatLink";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.hook,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.hook, url: `/work/${p.slug}`, type: "article" },
    twitter: { title: p.title, description: p.hook },
  };
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-line grid gap-6 border-t py-14 md:grid-cols-12 md:gap-8 md:py-20">
      <h2 className="label text-muted flex items-baseline gap-3 md:col-span-3" data-reveal>
        <span className="text-accent">{n}</span> {title}
      </h2>
      <div className="md:col-span-9" data-reveal>
        {children}
      </div>
    </section>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const links = project.links.filter((l) => SHOW_TODOS || !isTodo(l.href));
  const results = visible(project.results);
  const learnings = visible(project.learnings);
  const media = visible(project.media ?? []);
  const stack = visible(project.stack);
  const blocks: { title: string; body: React.ReactNode }[] = [
    { title: "Problem", body: <p className="text-lede max-w-[60ch]">{project.problem}</p> },
    {
      title: "Approach",
      body: (
        <ol className="max-w-[66ch] space-y-4">
          {project.approach.map((a, i) => (
            <li
              key={i}
              className="text-muted grid grid-cols-[2.5rem_1fr] text-[1.02rem] leading-relaxed"
            >
              <span className="label text-accent pt-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-fg/90">{a}</span>
            </li>
          ))}
        </ol>
      ),
    },
    { title: "Architecture", body: <ArchitectureDiagram architecture={project.architecture} /> },
  ];
  if (results.length)
    blocks.push({
      title: "Results",
      body: (
        <ul className="border-line bg-line grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
          {results.map((r) => (
            <li key={r} className="bg-bg p-5">
              <Text as="p" className="font-display text-2xl leading-snug">
                {r}
              </Text>
            </li>
          ))}
        </ul>
      ),
    });
  if (learnings.length)
    blocks.push({
      title: "Learnings",
      body: (
        <ul className="max-w-[62ch] space-y-3">
          {learnings.map((l) => (
            <Text key={l} as="li" className="text-lg leading-relaxed">
              {l}
            </Text>
          ))}
        </ul>
      ),
    });
  if (media.length)
    blocks.push({
      title: "Gallery",
      body: (
        <ul className="space-y-3">
          {media.map((m) => (
            <Text key={m} as="li">
              {m}
            </Text>
          ))}
        </ul>
      ),
    });

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main" className="relative pt-[calc(var(--header-h)+2rem)]" data-field="clusters">
        <article className="container-x">
          <Link
            href="/#work"
            transitionTypes={["nav-back"]}
            className="label text-muted hover:text-fg inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft /> All work
          </Link>

          <header className="grid gap-10 pt-10 pb-14 md:grid-cols-12 md:gap-8 md:pt-16 md:pb-20">
            <div className="md:col-span-8">
              <p className="label text-muted flex items-center gap-3">
                <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden className="bg-line-strong h-px w-8" />
                {project.category}
              </p>
              <ViewTransition name={`title-${project.slug}`} share="morph" default="none">
                <h1 className="font-display text-display-xl mt-6">{project.title}</h1>
              </ViewTransition>
              <p className="text-lede text-muted mt-8 max-w-[52ch]">{project.hook}</p>
            </div>
            <dl className="grid grid-cols-2 gap-6 self-end md:col-span-4 md:grid-cols-1">
              <div>
                <dt className="label text-muted">Period</dt>
                <dd className="mt-1">{project.period}</dd>
              </div>
              <div>
                <dt className="label text-muted">Role</dt>
                <dd className="mt-1">{project.role}</dd>
              </div>
              <div className="col-span-2 md:col-span-1">
                <dt className="label text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {stack.map((s) =>
                    isTodo(s) ? <Text key={s}>{s}</Text> : <Chip key={s}>{s}</Chip>,
                  )}
                </dd>
              </div>
              {links.length > 0 && (
                <div className="col-span-2 md:col-span-1">
                  <dt className="label text-muted">Links</dt>
                  <dd className="mt-2 flex flex-col gap-1.5">
                    {links.map((l) =>
                      isTodo(l.href) ? (
                        <Text key={l.label}>{`${l.label}: ${l.href}`}</Text>
                      ) : l.href === "#ask" ? (
                        <ChatLink key={l.label} label={l.label} />
                      ) : (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                        >
                          {l.label} <ArrowUpRight />
                        </a>
                      ),
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </header>

          <div
            className="border-line bg-surface relative aspect-[16/9] overflow-hidden rounded-2xl border md:aspect-[21/9]"
            data-reveal="mask"
          >
            <ProjectArt variant={project.art} className="absolute inset-0 h-full w-full" />
          </div>

          <div className="mt-10">
            {blocks.map((b, i) => (
              <Block key={b.title} n={String(i + 1).padStart(2, "0")} title={b.title}>
                {b.body}
              </Block>
            ))}
          </div>

          <nav aria-label="Next project" className="border-line border-t py-16 md:py-24">
            <Link
              href={`/work/${next.slug}`}
              transitionTypes={["nav-forward"]}
              className="group block"
              data-cursor="Next"
            >
              <span className="label text-muted">Next project</span>
              <span className="font-display text-display-lg group-hover:text-accent mt-4 flex items-center gap-6 transition-colors">
                {next.title}
                <ArrowRight className="size-[0.5em] shrink-0 transition-transform duration-500 group-hover:translate-x-2" />
              </span>
            </Link>
          </nav>
        </article>
      </main>
    </ViewTransition>
  );
}
