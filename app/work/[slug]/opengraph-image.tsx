import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { ogSize, renderOg } from "@/lib/og/render";

export const alt = "Case study by Utkarsh Khanna";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: `Case study · ${p?.category ?? "Work"}`,
    title: p?.title ?? "Work",
    footer: profile.name,
  });
}
