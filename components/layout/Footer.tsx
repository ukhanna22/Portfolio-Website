import { profile } from "@/content/profile";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer className="border-line relative z-10 border-t">
      <div className="container-x flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="label text-muted">© 2026 {profile.name} · Built from scratch with Next.js</p>
        <div className="flex items-center gap-5">
          <p className="label text-muted hidden sm:block">
            Press <kbd className="border-line text-fg rounded border px-1.5 py-0.5">`</kbd> for a
            terminal
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
