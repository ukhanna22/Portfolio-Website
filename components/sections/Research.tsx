import { otherWriting, paper } from "@/content/research";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Text } from "@/components/ui/Todo";
import { Magnetic } from "@/components/effects/Magnetic";
import { ArrowUpRight, Copy } from "@/components/ui/icons";
import { articleJsonLd, JsonLd } from "@/lib/seo";

export function Research() {
  return (
    <section
      id="research"
      data-field="rings"
      aria-labelledby="research-title"
      className="relative py-28 md:py-40"
    >
      <JsonLd data={articleJsonLd()} />
      <div className="container-x">
        <SectionLabel id="research" />
        <h2
          id="research-title"
          className="font-display text-display-lg mt-8 max-w-[18ch]"
          data-reveal
        >
          Research, <em>peer-reviewed</em>.
        </h2>

        <article
          className="border-line bg-elevated/70 relative mt-14 grid overflow-hidden rounded-2xl border backdrop-blur-sm md:grid-cols-12"
          data-reveal
          aria-labelledby="paper-title"
        >
          <div className="border-line flex flex-col justify-between gap-6 border-b p-6 md:col-span-3 md:border-r md:border-b-0 md:p-8">
            <div className="space-y-1">
              <p className="label text-accent">{paper.venueShort}</p>
              <p className="label text-muted">{paper.type}</p>
            </div>
            <dl className="label text-muted grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1">
              <div>
                <dt>Location</dt>
                <dd className="text-fg">{paper.location}</dd>
              </div>
              <div>
                <dt>Pages</dt>
                <dd className="text-fg">{paper.pages}</dd>
              </div>
              <div className="col-span-2 md:col-span-1">
                <dt>DOI</dt>
                <dd className="text-fg break-all">{paper.doi}</dd>
              </div>
            </dl>
          </div>

          <div className="p-6 md:col-span-9 md:p-10 lg:p-12">
            <h3
              id="paper-title"
              className="font-display text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.04]"
            >
              {paper.title}
            </h3>
            <p className="text-muted mt-5 text-[0.95rem]">
              {paper.authors.map((a, i) => (
                <span key={a}>
                  {a === paper.self ? (
                    <strong className="text-fg decoration-accent font-medium underline decoration-2 underline-offset-4">
                      {a}
                    </strong>
                  ) : (
                    a
                  )}
                  {i < paper.authors.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p className="text-muted mt-1 text-sm italic">{paper.venue}</p>

            <div className="border-line mt-8 border-t pt-8">
              <p className="label text-muted mb-3">In plain English</p>
              <p className="max-w-[70ch] text-[1.05rem] leading-relaxed">{paper.abstract}</p>
              <Text as="p" className="mt-3 block">
                {paper.abstractNote}
              </Text>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-fg text-bg inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-opacity hover:opacity-85"
                >
                  Read paper <ArrowUpRight />
                </a>
              </Magnetic>
              <Magnetic>
                <CopyButton
                  text={paper.bibtex}
                  message="BibTeX copied to clipboard"
                  className="border-line-strong hover:border-accent inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors"
                >
                  Cite <Copy />
                </CopyButton>
              </Magnetic>
            </div>
          </div>
        </article>

        <ul className="divide-line border-line mt-8 divide-y border-y">
          {otherWriting.map((w) => (
            <li
              key={w.title}
              className="grid gap-2 py-5 md:grid-cols-12 md:items-baseline"
              data-reveal
            >
              <span className="label text-muted md:col-span-2">{w.kind}</span>
              <span className="font-display text-2xl md:col-span-6">{w.title}</span>
              <span className="text-muted text-sm md:col-span-3">{w.venue}</span>
              <span className="label text-muted md:col-span-1 md:text-right">{w.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
