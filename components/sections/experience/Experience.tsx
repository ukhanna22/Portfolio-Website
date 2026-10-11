import Link from "next/link";
import { experience } from "@/content/experience";
import { getProject } from "@/content/projects";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Text } from "@/components/ui/Todo";
import { ArrowUpRight } from "@/components/ui/icons";
import { TimelineLine } from "./TimelineLine";

export function Experience() {
  return (
    <section
      id="experience"
      data-field="helix"
      aria-labelledby="experience-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionLabel id="experience" />
            <h2 id="experience-title" className="font-display text-display-lg mt-8" data-reveal>
              Where the work <em>happened</em>.
            </h2>
          </div>
        </div>

        <ol className="relative mt-16 md:mt-24">
          <span
            aria-hidden
            className="bg-line absolute top-2 bottom-0 left-[5px] w-px overflow-hidden md:left-[calc(25%+5px)]"
          >
            <TimelineLine />
          </span>
          {experience.map((job, i) => (
            <li
              key={job.id}
              className="relative grid gap-3 pb-16 pl-8 last:pb-0 md:grid-cols-12 md:gap-8 md:pb-24 md:pl-0"
            >
              <span
                aria-hidden
                className="border-accent bg-bg absolute top-2 left-0 size-[11px] rounded-full border md:left-[25%]"
              />
              <div className="md:col-span-3 md:pr-10 md:text-right" data-reveal>
                <p className="label text-fg">
                  {job.start} — {job.end}
                </p>
                <p className="label text-muted mt-1">
                  {job.kind} · {job.location}
                </p>
              </div>
              <div
                className="md:col-span-8 md:col-start-5"
                data-reveal
                style={{ "--reveal-delay": "0.08s" } as React.CSSProperties}
              >
                <h3 className="font-display text-display-md">
                  {job.company}
                  {job.companyNote && (
                    <span className="text-muted mt-1 block font-sans text-sm sm:mt-0 sm:ml-3 sm:inline sm:align-middle">
                      {job.companyNote}
                    </span>
                  )}
                </h3>
                <p className="text-fg mt-2">{job.role}</p>
                <p className="text-muted mt-4 max-w-[62ch]">{job.summary}</p>
                <ul className="text-muted mt-5 max-w-[66ch] space-y-2.5 text-[0.95rem] leading-relaxed">
                  {job.points.map((pt) => (
                    <Text
                      key={pt}
                      as="li"
                      className="before:bg-accent relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5"
                    >
                      {pt}
                    </Text>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {job.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                  {job.projects?.map((slug) => {
                    const p = getProject(slug);
                    if (!p) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/work/${slug}`}
                        transitionTypes={["nav-forward"]}
                        className="label text-accent ml-1 inline-flex items-center gap-1 underline-offset-4 hover:underline"
                      >
                        {p.short} <ArrowUpRight width={12} height={12} />
                      </Link>
                    );
                  })}
                </div>
              </div>
              {i === 0 && <span className="sr-only">Current role</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
