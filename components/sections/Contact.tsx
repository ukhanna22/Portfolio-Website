import Link from "next/link";
import { profile } from "@/content/profile";
import { isTodo } from "@/content/todo";
import { ReactiveHeadline } from "@/components/effects/ReactiveHeadline";
import { Magnetic } from "@/components/effects/Magnetic";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowUpRight, Copy } from "@/components/ui/icons";

const links = [
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
  { label: "IEEE paper", href: profile.links.paper },
  { label: "Google Scholar", href: profile.links.scholar },
].filter((l) => !isTodo(l.href));

export function Contact() {
  const resumeHref = isTodo(profile.resume.pdf) ? profile.resume.page : profile.resume.pdf;
  return (
    <section
      id="contact"
      data-field="point"
      aria-labelledby="contact-title"
      className="relative overflow-hidden pt-28 pb-16 md:pt-40"
    >
      <div className="container-x">
        <SectionLabel id="contact" />
        <ReactiveHeadline
          id="contact-title"
          text="Let's build something intelligent."
          className="font-display text-display-xl mt-10 max-w-[12ch] cursor-default md:max-w-[19ch]"
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="label text-muted">Email</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="font-display decoration-line-strong hover:text-accent hover:decoration-accent text-[clamp(1.6rem,4.2vw,3rem)] leading-tight underline decoration-1 underline-offset-[0.18em] transition-colors"
              >
                {profile.email}
              </a>
              <Magnetic>
                <CopyButton
                  text={profile.email}
                  message="Email copied to clipboard"
                  label="Copy email address"
                  className="border-line-strong hover:border-accent hover:text-accent grid size-11 place-items-center rounded-full border transition-colors"
                >
                  <Copy />
                </CopyButton>
              </Magnetic>
            </div>
            <p className="text-muted mt-8 max-w-[46ch] text-lg leading-relaxed">
              {profile.availability}
            </p>
          </div>

          <nav aria-label="Elsewhere" className="md:col-span-4 md:col-start-9">
            <ul className="divide-line border-line divide-y border-y">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:text-accent flex items-center justify-between py-4 transition-colors"
                  >
                    <span className="text-lg">{l.label}</span>
                    <ArrowUpRight className="text-muted group-hover:text-accent transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={resumeHref}
                  className="group hover:text-accent flex items-center justify-between py-4 transition-colors"
                >
                  <span className="text-lg">Résumé</span>
                  <span className="label text-muted group-hover:text-accent">
                    {isTodo(profile.resume.pdf) ? "View / print" : "PDF"}
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
