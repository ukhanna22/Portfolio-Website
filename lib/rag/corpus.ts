import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { archive, projects } from "@/content/projects";
import { otherWriting, paper } from "@/content/research";
import { skillGroups } from "@/content/skills";
import { education } from "@/content/education";
import { beyond } from "@/content/beyond";
import { isTodo } from "@/content/todo";

/** A citable piece of the site. `label` is what the chat shows as "See: …". */
export type Chunk = { id: string; label: string; href: string; text: string };

const clean = (parts: (string | undefined | null | false)[]) =>
  parts.filter((p): p is string => typeof p === "string" && p.length > 0 && !isTodo(p)).join("\n");

/**
 * Turns the content files into retrieval chunks. Placeholders are dropped, so the bot can
 * only ever say what the site itself says.
 */
export function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];
  const add = (
    id: string,
    label: string,
    href: string,
    parts: (string | undefined | null | false)[],
  ) => {
    const text = clean(parts);
    if (text) chunks.push({ id, label, href, text });
  };

  add("profile", "About → Overview", "/#about", [
    `${profile.name} is a ${profile.role}, based in ${profile.location}.`,
    `Currently: ${profile.currently.label}. ${profile.currently.next}.`,
    profile.availability,
    `Languages: ${profile.languages.map((l) => `${l.name} (${l.level})`).join("; ")}.`,
  ]);
  profile.about.forEach((p, i) => add(`about-${i}`, "About", "/#about", [p]));
  add("about-drive", "About", "/#about", [profile.drive]);
  add("stats", "About → At a glance", "/#about", [
    "Verified numbers: " +
      profile.stats
        .map((s) => `${"prefix" in s ? s.prefix : ""}${s.value}${s.suffix} ${s.label} (${s.note})`)
        .join("; ") +
      ".",
  ]);
  add("contact", "Contact", "/#contact", [
    `Email: ${profile.email}.`,
    `LinkedIn: ${profile.links.linkedin}.`,
    `GitHub: ${profile.links.github}.`,
    `Résumé: ${profile.url}${profile.resume.page}.`,
    profile.availability,
  ]);

  for (const job of experience) {
    add(`exp-${job.id}`, `Experience → ${job.company}`, "/#experience", [
      `${job.role} at ${job.company}${job.companyNote ? ` (${job.companyNote})` : ""}, ${job.start} – ${job.end}, ${job.kind}, ${job.location}.`,
      job.summary,
      ...job.points,
      `Stack: ${job.stack.join(", ")}.`,
    ]);
  }

  for (const p of projects) {
    const href = `/work/${p.slug}`;
    const label = `Projects → ${p.title}`;
    add(`proj-${p.slug}`, label, href, [
      `${p.title} (${p.category}, ${p.period}). Role: ${p.role}.`,
      p.hook,
      `Stack: ${p.stack.filter((s) => !isTodo(s)).join(", ")}.`,
      ...p.links
        .filter((l) => !isTodo(l.href) && !l.href.startsWith("#"))
        .map((l) => `${l.label}: ${l.href}`),
    ]);
    add(`proj-${p.slug}-approach`, label, href, [
      `Problem: ${p.problem}`,
      "Approach:",
      ...p.approach,
    ]);
    add(`proj-${p.slug}-results`, label, href, [
      `Architecture: ${p.architecture.main.map((s) => s.label).join(" → ")}.`,
      p.results.some((r) => !isTodo(r)) && "Results:",
      ...p.results,
      ...p.learnings,
    ]);
  }
  add(
    "archive",
    "Projects → Also built",
    "/#work",
    archive.map((a) => `${a.title} (${a.year}): ${a.detail}`),
  );

  add("paper", "Research → Wellness AI paper", "/#research", [
    `Publication: "${paper.title}" by ${paper.authors.join(", ")} (${profile.name} is the second author).`,
    `${paper.venue}, ${paper.location}, ${paper.year}, pp. ${paper.pages}. ${paper.type}. DOI: ${paper.doi} (${paper.url}).`,
    `Plain-English summary: ${paper.abstract}`,
  ]);
  add(
    "writing",
    "Research → Other writing",
    "/#research",
    otherWriting.map((w) => `${w.kind}: "${w.title}", ${w.venue}, ${w.year} (${w.note}).`),
  );

  for (const g of skillGroups) {
    add(`skills-${g.id}`, `Skills → ${g.title}`, "/#skills", [
      `${g.title} skills:`,
      ...g.skills.map((s) => {
        const used = (s.projects ?? [])
          .map((slug) => projects.find((p) => p.slug === slug)?.title)
          .filter(Boolean);
        return `${s.name}${s.note ? ` (${s.note})` : ""}${used.length ? `, used in ${used.join(", ")}` : ""}`;
      }),
    ]);
  }

  add("education", "Education", "/#education", [
    `${education.degree}, ${education.school}, ${education.location}, ${education.start}–${education.end}.`,
    ...education.highlights.map((h) => `${h.title}: ${h.detail}.`),
    `Relevant coursework: ${education.coursework.join(", ")}.`,
  ]);
  add("education-next", "Education → Next", "/#education", [
    education.next,
    ...education.readiness.map((r) => `${r.title}: ${r.detail}.`),
  ]);
  add(
    "beyond",
    "Beyond the code",
    "/#beyond",
    beyond.map((b) => b.line),
  );

  return chunks;
}
