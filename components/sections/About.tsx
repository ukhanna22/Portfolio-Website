import { profile } from "@/content/profile";
import { CountUp } from "@/components/effects/CountUp";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Text } from "@/components/ui/Todo";

export function About() {
  return (
    <section
      id="about"
      data-field="sphere"
      aria-labelledby="about-title"
      className="relative py-28 md:py-40"
    >
      <div className="container-x grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <SectionLabel id="about" />
          <h2
            id="about-title"
            className="font-display text-display-lg mt-8 max-w-[14ch]"
            data-reveal
          >
            Trained in AI. Working in data. <em className="text-accent">Published</em> in between.
          </h2>
          <div className="text-muted mt-10 max-w-[60ch] space-y-5 text-[1.05rem] leading-relaxed md:text-lg">
            {profile.about.map((p, i) => (
              <p
                key={i}
                data-reveal
                style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                {p}
              </p>
            ))}
            <Text as="p" className="text-fg">
              {profile.drive}
            </Text>
          </div>
        </div>

        <aside className="md:col-span-4 md:col-start-9 md:self-end" aria-label="At a glance">
          <dl className="border-line grid grid-cols-2 border-t border-l">
            {profile.stats.map((s, i) => (
              <div
                key={s.label}
                className="border-line flex aspect-[5/4] flex-col justify-between border-r border-b p-4 md:p-5"
                data-reveal
                style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[clamp(2.75rem,5vw,4.25rem)] leading-none">
                  {"prefix" in s && <span className="text-muted">{s.prefix}</span>}
                  <CountUp value={s.value} />
                  <span className="text-accent">{s.suffix}</span>
                </dd>
                <dd className="label text-muted leading-snug">
                  <span className="text-fg block">{s.label}</span>
                  {s.note}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
