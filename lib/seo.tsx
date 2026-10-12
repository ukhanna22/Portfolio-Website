import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { paper } from "@/content/research";
import { isTodo } from "@/content/todo";

export const siteUrl = profile.url;
export const siteTitle = `${profile.name} — ${profile.role}`;
export const siteDescription =
  "Utkarsh Khanna builds AI systems that turn data into decisions: LLM fine-tuning, retrieval-augmented generation and data pipelines on Azure. Generative AI Data Engineer at Publicis Re:Sources; IEEE SCEECS 2025 author.";

const sameAs = Object.values(profile.links).filter((l) => !isTodo(l) && l !== profile.links.paper);

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    worksFor: {
      "@type": "Organization",
      name: "Publicis Re:Sources",
      parentOrganization: { "@type": "Organization", name: "Publicis Groupe" },
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
      address: education.location,
    },
    address: { "@type": "PostalAddress", addressLocality: "Gurugram", addressCountry: "IN" },
    knowsAbout: [
      "Generative AI",
      "Large language models",
      "LoRA fine-tuning",
      "Retrieval-augmented generation",
      "Data engineering",
      "Microsoft Azure",
    ],
    knowsLanguage: ["en", "hi", "de"],
    sameAs,
  };
}

export function articleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    name: paper.title,
    author: paper.authors.map((a) =>
      a === paper.self
        ? { "@id": `${siteUrl}/#person`, "@type": "Person", name: profile.name }
        : { "@type": "Person", name: a },
    ),
    datePublished: String(paper.year),
    isPartOf: { "@type": "PublicationEvent", name: paper.venue, location: paper.location },
    pagination: paper.pages,
    identifier: { "@type": "PropertyValue", propertyID: "DOI", value: paper.doi },
    sameAs: paper.url,
    url: paper.url,
    abstract: paper.abstract,
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
