import { todo } from "./todo";

export const profile = {
  name: "Utkarsh Khanna",
  firstName: "Utkarsh",
  lastName: "Khanna",
  initials: "UK",
  role: "Generative AI Data Engineer",
  taglines: [
    "I build AI systems that turn data into decisions.",
    "Fine-tuning models. Engineering pipelines. Shipping things that work.",
  ],
  currently: {
    label: "GenAI Data Engineering @ Publicis Re:Sources",
    next: "Applying for MSc CS/AI in Europe (2027)",
  },
  location: "Gurugram, India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "ukhanna2003@gmail.com",
  url: "https://utkarshkhanna.in",
  links: {
    linkedin: "https://www.linkedin.com/in/utkarsh-khanna-95531623a",
    github: "https://github.com/ukhanna22",
    paper: "https://doi.org/10.1109/SCEECS64059.2025.10940178",
    scholar: todo("Google Scholar profile URL (or remove)"),
  },
  /** Web résumé lives at /resume and prints cleanly to PDF. */
  resume: {
    page: "/resume",
    // The uploaded CV contains date of birth, home address and phone number, so it is not
    // published. Drop a redacted PDF into /public and set the path here.
    pdf: todo("redacted résumé PDF in /public, e.g. /Utkarsh-Khanna-Resume.pdf") as string,
  },
  about: [
    "I'm a Generative AI Data Engineer at Publicis Re:Sources, part of Publicis Groupe. I build the Python pipelines on Microsoft Azure that pull campaign data from nine-plus ad platforms into a single PostgreSQL store, and the transformation, deduplication and metric logic that tells media-buying teams whether a campaign is on pace.",
    "I studied Artificial Intelligence at NMIMS Mumbai (B.Tech, 2025). My capstone, fine-tuning LLaMA 3 8B with LoRA for personalised diet and fitness recommendations, became a peer-reviewed paper at IEEE SCEECS 2025. At Protiviti I fine-tuned LLaMA 3.2 to categorise risk-assessment email and cut manual review by roughly 60%.",
    "I also design and build things end to end: most recently the brand, the website and a full-stack inventory and billing system for a Mumbai fine-jewellery business. Next up is an MSc in Computer Science or AI in Europe, starting 2027.",
  ],
  drive: todo("1–2 lines in your own words on what drives you"),
  /** Only verifiable numbers. Each one is backed by the CV. */
  stats: [
    { value: 1, suffix: "", label: "IEEE publication", note: "SCEECS 2025" },
    { value: 9, suffix: "+", label: "ad platforms unified", note: "into one PostgreSQL store" },
    {
      value: 60,
      suffix: "%",
      prefix: "~",
      label: "less manual email review",
      note: "LLaMA 3.2 classifier",
    },
    { value: 2, suffix: "", label: "clouds in production", note: "Azure · AWS" },
  ],
  availability:
    "Open to AI engineering roles, research collaborations, and conversations about MSc programs.",
  languages: [
    { name: "English", level: "Full professional · IELTS Academic 7.5 (C1)" },
    { name: "Hindi", level: "Native" },
    { name: "German", level: "A1, learning" },
    { name: "French", level: "School level" },
  ],
} as const;

export type Profile = typeof profile;
