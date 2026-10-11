import { SectionLabel } from "@/components/ui/SectionLabel";
import { SkillsMap } from "./SkillsMap";

export function Skills() {
  return (
    <section
      id="skills"
      data-field="clusters"
      aria-labelledby="skills-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-x">
        <SectionLabel id="skills" />
        <h2
          id="skills-title"
          className="font-display text-display-lg mt-8 max-w-[16ch]"
          data-reveal
        >
          Tools, traced to <em className="text-accent">evidence</em>.
        </h2>
        <p className="text-muted mt-6 max-w-[52ch]" data-reveal>
          Not a logo wall. Every skill with a dot links to the projects where it was actually used.
        </p>
        <div className="mt-14">
          <SkillsMap />
        </div>
      </div>
    </section>
  );
}
