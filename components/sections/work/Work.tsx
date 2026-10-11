import { archive, projects } from "@/content/projects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HorizontalGallery } from "./HorizontalGallery";

export function Work() {
  const header = (
    <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <SectionLabel id="work" />
        <h2 id="work-title" className="font-display text-display-xl mt-6" data-reveal>
          Selected <em className="text-accent">work</em>
        </h2>
      </div>
      <p className="label text-muted max-w-xs md:text-right" data-reveal>
        {String(projects.length).padStart(2, "0")} case studies · research, client builds,
        enterprise data and applied AI
        <span className="text-fg mt-2 hidden lg:block">Scroll or drag →</span>
      </p>
    </div>
  );

  return (
    <section
      id="work"
      data-field="grid"
      aria-labelledby="work-title"
      className="relative py-28 lg:py-0"
    >
      <HorizontalGallery header={header}>
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className="lg:h-[min(66vh,620px)] lg:w-[min(30rem,36vw)] lg:shrink-0"
            data-reveal
            style={{ "--reveal-delay": `${(i % 2) * 0.08}s` } as React.CSSProperties}
          >
            <ProjectCard
              project={{
                slug: p.slug,
                title: p.title,
                category: p.category,
                hook: p.hook,
                stack: p.stack,
                art: p.art,
              }}
              index={i}
            />
          </div>
        ))}
        <aside
          className="border-line-strong flex flex-col justify-between rounded-2xl border border-dashed p-6 sm:col-span-2 lg:h-[min(66vh,620px)] lg:w-[min(24rem,30vw)] lg:shrink-0"
          aria-label="Also built"
        >
          <p className="label text-muted">Also built</p>
          <ul className="mt-6 space-y-6">
            {archive.map((a) => (
              <li key={a.title}>
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-2xl">{a.title}</span>
                  <span className="label text-muted">{a.year}</span>
                </p>
                <p className="text-muted mt-2 text-sm leading-relaxed">{a.detail}</p>
              </li>
            ))}
          </ul>
          <p className="label text-muted mt-8">
            More on{" "}
            <a
              className="text-fg hover:text-accent underline underline-offset-4"
              href="https://github.com/ukhanna22"
            >
              GitHub
            </a>
          </p>
        </aside>
      </HorizontalGallery>
    </section>
  );
}
