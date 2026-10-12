import { profile } from "@/content/profile";
import { ogSize, renderOg } from "@/lib/og/render";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: profile.role,
    title: profile.name,
    footer: "LLMs · RAG · Data pipelines",
  });
}
