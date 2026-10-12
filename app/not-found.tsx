import Link from "next/link";
import { projects } from "@/content/projects";

export const metadata = { title: "404 · Vector not found" };

export default function NotFound() {
  const neighbours = projects.slice(0, 3);
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] items-center pt-(--header-h)"
      data-field="noise"
    >
      <div className="container-x grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="label text-accent">Error 404 · cosine similarity 0.00</p>
          <h1 className="font-display text-display-xl mt-6">
            This vector doesn&apos;t exist in my <em className="text-accent">latent space</em>.
          </h1>
          <p className="text-lede text-muted mt-8 max-w-[46ch]">
            The page you asked for was never embedded. Here are its nearest neighbours instead.
          </p>
        </div>
        <nav aria-label="Nearest neighbours" className="self-end md:col-span-4">
          <ol className="divide-line border-line divide-y border-y">
            <li>
              <Link href="/" className="hover:text-accent flex items-baseline justify-between py-4">
                <span className="text-lg">Home</span>
                <span className="label text-muted">0.94</span>
              </Link>
            </li>
            <li>
              <Link
                href="/#work"
                className="hover:text-accent flex items-baseline justify-between py-4"
              >
                <span className="text-lg">Selected work</span>
                <span className="label text-muted">0.91</span>
              </Link>
            </li>
            {neighbours.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="hover:text-accent flex items-baseline justify-between py-4"
                >
                  <span className="text-lg">{p.title}</span>
                  <span className="label text-muted">{(0.87 - i * 0.04).toFixed(2)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </main>
  );
}
