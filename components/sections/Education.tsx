import { education } from "@/content/education";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Education() {
  return (
    <section
      id="education"
      data-field="rings"
      aria-labelledby="education-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <SectionLabel id="education" />
          <h2 id="education-title" className="font-display text-display-lg mt-8" data-reveal>
            {education.degree}
          </h2>
          <p className="text-muted mt-5" data-reveal>
            {education.school}, {education.location} · {education.start}–{education.end}
          </p>
          <div className="border-accent/40 bg-accent-soft mt-10 rounded-2xl border p-5" data-reveal>
            <p className="label text-accent">Next</p>
            <p className="font-display mt-2 text-2xl leading-snug">{education.next}</p>
            <ul className="text-muted mt-4 space-y-1 text-sm">
              {education.readiness.map((r) => (
                <li key={r.title}>
                  <span className="text-fg">{r.title}</span> · {r.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-24">
          <ul className="divide-line border-line divide-y border-y">
            {education.highlights.map((h, i) => (
              <li
                key={h.title}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                data-reveal
                style={{ "--reveal-delay": `${i * 0.06}s` } as React.CSSProperties}
              >
                <span className="font-display text-2xl">{h.title}</span>
                <span className="label text-muted sm:text-right">{h.detail}</span>
              </li>
            ))}
          </ul>
          <p className="label text-muted mt-10" data-reveal>
            Relevant coursework
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" data-reveal>
            {education.coursework.map((c) => (
              <li key={c}>
                <Chip>{c}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
