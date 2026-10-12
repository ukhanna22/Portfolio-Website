import { profile } from "@/content/profile";
import { HeroCtas } from "./HeroCtas";
import { LiveClock } from "./LiveClock";
import { TypeRotator } from "./TypeRotator";

function SplitWord({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="char-mask" aria-hidden>
      {Array.from(word).map((c, i) => (
        <span key={i} className="char" style={{ "--i": offset + i } as React.CSSProperties}>
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      data-field="noise"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-between pt-[calc(var(--header-h)+1.5rem)] pb-6"
    >
      <div className="container-x">
        <p
          className="fade-up label border-line bg-bg/40 text-muted inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full border px-3.5 py-2 backdrop-blur-sm"
          style={{ "--d": "0.9s" } as React.CSSProperties}
        >
          <span>
            <span className="pulse-dot mr-3 align-middle" aria-hidden />
            <span className="text-fg">Currently</span> — {profile.currently.label}
          </span>
          <span aria-hidden className="text-line-strong hidden sm:inline">
            ·
          </span>
          <span>{profile.currently.next}</span>
        </p>
      </div>

      <div className="container-x py-10">
        <p
          className="fade-up label text-muted mb-6 flex items-center gap-3"
          style={{ "--d": "0.7s" } as React.CSSProperties}
        >
          <span className="text-accent">00</span>
          <span aria-hidden className="bg-line-strong h-px w-8" />
          {profile.role}
        </p>
        <h1 className="font-display text-hero" aria-label={profile.name}>
          <span className="block">
            <SplitWord word={profile.firstName} offset={0} />
          </span>
          <span className="block pl-[0.6em] italic md:pl-[1.4em]">
            <SplitWord word={profile.lastName} offset={profile.firstName.length} />
            <span className="char-mask" aria-hidden>
              <span
                className="char text-accent"
                style={{ "--i": profile.name.length } as React.CSSProperties}
              >
                .
              </span>
            </span>
          </span>
        </h1>
        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <TypeRotator lines={profile.taglines} />
          </div>
          <div
            className="fade-up md:col-span-5 md:flex md:justify-end"
            style={{ "--d": "1.4s" } as React.CSSProperties}
          >
            <HeroCtas />
          </div>
        </div>
      </div>

      <div
        className="container-x fade-up relative flex items-end justify-between gap-4"
        style={{ "--d": "1.6s" } as React.CSSProperties}
      >
        <p className="label text-muted">
          <span className="block sm:inline">{profile.location}</span>
          <span aria-hidden className="hidden sm:inline">
            {" "}
            ·{" "}
          </span>
          <LiveClock />
        </p>
        <a
          href="#about"
          className="label group text-muted hover:text-fg absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 transition-colors sm:flex"
        >
          <span className="hidden sm:inline">Scroll</span>
          <span aria-hidden className="bg-line relative block h-12 w-px overflow-hidden">
            <span className="scroll-cue__line bg-accent absolute inset-0 block" />
          </span>
          <span className="sr-only">Scroll to About</span>
        </a>
      </div>
    </section>
  );
}
