import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { otherWriting, paper } from "@/content/research";
import { education } from "@/content/education";
import { skillGroups } from "@/content/skills";
import { isTodo } from "@/content/todo";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.role}.`,
  alternates: { canonical: "/resume" },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="label border-line text-accent mb-4 border-b pb-2 print:text-black">{children}</h2>
);

export default function Resume() {
  const real = (xs: readonly string[]) => xs.filter((x) => !isTodo(x));
  return (
    <main id="main" className="relative pt-[calc(var(--header-h)+2rem)] print:pt-0">
      <article className="container-x max-w-4xl pb-24 print:max-w-none print:px-0 print:pb-0 print:text-[10.5pt]">
        <header className="border-line flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-display-lg print:text-[34pt]">{profile.name}</h1>
            <p className="mt-2 text-lg">{profile.role}</p>
            <p className="label text-muted mt-3 print:text-black">
              {profile.location} · <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{" "}
              {profile.url.replace("https://", "")}
            </p>
            <p className="label text-muted mt-1 print:text-black">
              linkedin.com/in/utkarsh-khanna-95531623a · github.com/ukhanna22
            </p>
          </div>
          <PrintButton />
        </header>

        <section className="mt-10">
          <H>Summary</H>
          <p className="leading-relaxed">{profile.about[0]}</p>
        </section>

        <section className="mt-10">
          <H>Experience</H>
          <div className="space-y-7">
            {experience.map((j) => (
              <div key={j.id} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium">
                    {j.role} · {j.company}
                  </h3>
                  <span className="label text-muted print:text-black">
                    {j.start} – {j.end}
                  </span>
                </div>
                <ul className="text-muted marker:text-accent mt-2 list-disc space-y-1 pl-5 text-[0.95rem] print:text-black">
                  {real(j.points).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <H>Selected projects</H>
          <ul className="space-y-3 text-[0.95rem]">
            {projects.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <span className="font-medium">{p.title}</span>{" "}
                <span className="text-muted print:text-black">({p.period})</span> — {p.hook}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <H>Publications</H>
          <ul className="space-y-2 text-[0.95rem]">
            <li>
              {paper.authors.join(", ")}, “{paper.title},” {paper.venue}, {paper.location},{" "}
              {paper.year}, pp. {paper.pages}. DOI: {paper.doi}
            </li>
            {otherWriting.map((w) => (
              <li key={w.title}>
                U. Khanna, “{w.title},” in {w.venue}, {w.year}. {w.note}.
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <H>Education</H>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">
              {education.degree} · {education.school}, {education.location}
            </h3>
            <span className="label text-muted print:text-black">
              {education.start} – {education.end}
            </span>
          </div>
          <ul className="text-muted marker:text-accent mt-2 list-disc space-y-1 pl-5 text-[0.95rem] print:text-black">
            {education.highlights.map((h) => (
              <li key={h.title}>
                {h.title} — {h.detail}
              </li>
            ))}
            {education.readiness.map((h) => (
              <li key={h.title}>
                {h.title} — {h.detail}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <H>Skills</H>
          <dl className="space-y-2 text-[0.95rem]">
            {skillGroups.map((g) => (
              <div key={g.id} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
                <dt className="font-medium">{g.title}</dt>
                <dd className="text-muted print:text-black">
                  {g.skills
                    .map((s) => (s.note && g.id === "languages" ? `${s.name} (${s.note})` : s.name))
                    .join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </main>
  );
}
