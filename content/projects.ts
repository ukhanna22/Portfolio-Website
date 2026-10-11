import { todo, type Todo } from "./todo";

export type ArtVariant =
  "attention" | "ledger" | "facets" | "flow" | "constellation" | "pages" | "scan";

export type ArchStage = { label: string; detail?: string };

export type Project = {
  slug: string;
  title: string;
  /** Short name used in the skills map, chatbot citations and terminal. */
  short: string;
  category: string;
  hook: string;
  period: string;
  role: string;
  stack: string[];
  art: ArtVariant;
  links: { label: string; href: string | Todo }[];
  problem: string;
  approach: string[];
  /** Left-to-right data flow; `branch` stages render beneath the main line. */
  architecture: { main: ArchStage[]; branch?: { from: number; stages: ArchStage[] } };
  results: (string | Todo)[];
  learnings: (string | Todo)[];
  media?: (string | Todo)[];
};

export const projects: Project[] = [
  {
    slug: "wellness-ai",
    title: "Wellness AI",
    short: "Wellness AI",
    category: "Published Research",
    hook: "LLaMA 3 8B, fine-tuned with LoRA and quantised to run on a phone, turning live biometric data into personal diet and fitness advice.",
    period: "Jul – Dec 2024",
    role: "B.Tech capstone team project · second author",
    stack: ["Python", "PyTorch", "LLaMA 3 8B", "LoRA", "Quantisation", "Apple HealthKit"],
    art: "attention",
    links: [
      { label: "Read the paper (IEEE)", href: "https://doi.org/10.1109/SCEECS64059.2025.10940178" },
      { label: "Source code", href: todo("GitHub link if public, else remove") },
    ],
    problem:
      "Most diet and fitness apps hand everyone the same advice. Wellness AI set out to ground recommendations in the person actually holding the phone: their own biometric data, read in real time.",
    approach: [
      "Fine-tuned Meta's LLaMA 3 8B with Low-Rank Adaptation (LoRA), training a small set of adapter weights instead of the full model.",
      "Quantised the fine-tuned model for on-device inference on mobile.",
      "Integrated real-time biometric data from Apple HealthKit as context for each recommendation.",
      "Designed the end-to-end architecture: data pipeline, fine-tuning, evaluation and mobile deployment.",
    ],
    architecture: {
      main: [
        { label: "Apple HealthKit", detail: "real-time biometrics" },
        { label: "Data pipeline", detail: "cleaning · prompts" },
        { label: "LLaMA 3 8B + LoRA", detail: "fine-tuning" },
        { label: "Evaluation" },
        { label: "Quantised model", detail: "on-device" },
        { label: "Mobile app", detail: "recommendations" },
      ],
    },
    results: [
      "Peer-reviewed paper at IEEE SCEECS 2025, Bhopal (second author).",
      "Capstone graded A; supervised by Prof. Sapna Shah.",
      todo("headline evaluation result from the paper (only if reported there)"),
    ],
    learnings: [todo("1–3 learnings from Wellness AI, in your words")],
  },
  {
    slug: "maahiraa-inventory",
    title: "Maahiraa Inventory & Billing",
    short: "Inventory & Billing",
    category: "Client Work · Full Stack",
    hook: "A desktop system for a fine-jewellery business: stock tally, GST invoices, and prices that follow the daily metal rate.",
    period: "Aug – Dec 2025",
    role: "Sole developer",
    stack: ["FastAPI", "React", "SQLite", "ReportLab", "APScheduler", "Python"],
    art: "ledger",
    links: [],
    problem:
      "A fine-jewellery business needed one system for its stock tally across gold, silver and diamond pieces, a GST-compliant invoice for every sale, and figures that keep up with metal rates that change daily.",
    approach: [
      "Python/FastAPI backend with SQLite, packaged as a desktop application, with a React interface.",
      "Inventory modelled across gold, silver and diamond categories so the tally stays correct as pieces move.",
      "GST-compliant PDF invoices generated automatically for every sale with ReportLab.",
      "APScheduler job pulls daily metal rates from external APIs.",
      "Sales analytics and low-stock alerts built in.",
    ],
    architecture: {
      main: [
        { label: "React UI", detail: "desktop" },
        { label: "FastAPI", detail: "business logic" },
        { label: "SQLite", detail: "inventory · sales" },
        { label: "ReportLab", detail: "GST invoice PDFs" },
      ],
      branch: {
        from: 1,
        stages: [{ label: "APScheduler", detail: "daily job" }, { label: "Metal-rate APIs" }],
      },
    },
    results: [
      "Invoice generation automated for every sale.",
      "Metal rates update daily without manual entry.",
      todo("real outcome from the business, e.g. time saved per day"),
    ],
    learnings: [todo("1–3 learnings from building for a real business")],
    media: [todo("UI screenshots with business data blurred")],
  },
  {
    slug: "maahiraa-website",
    title: "maahiraadiamonds.com",
    short: "Maahiraa website",
    category: "Client Work · Design + Web",
    hook: "Brand identity and website for a fine-jewellery label, from the first logo sketch to the live site.",
    period: "Aug – Dec 2025",
    role: "Designer & developer",
    stack: ["Brand identity", "Logo design", "UI design", todo("site stack") as string],
    art: "facets",
    links: [{ label: "Visit the live site", href: "https://maahiraadiamonds.com" }],
    problem:
      "A fine-jewellery business needed an identity and a web presence that felt as considered as the pieces it sells.",
    approach: [
      "Designed the brand logo and visual identity.",
      "Designed the user interface and built the website.",
    ],
    architecture: {
      main: [
        { label: "Sketches" },
        { label: "Logo iterations" },
        { label: "Final mark" },
        { label: "UI design" },
        { label: "Live site" },
      ],
    },
    results: [
      "Live at maahiraadiamonds.com.",
      todo("any outcome worth stating (launch date, traffic, enquiries)"),
    ],
    learnings: [todo("1–3 learnings from designing a luxury brand")],
    media: [todo("logo evolution strip: sketch → iterations → final")],
  },
  {
    slug: "campaign-pacing-platform",
    title: "Campaign Pacing Data Platform",
    short: "Campaign pacing",
    category: "Enterprise",
    hook: "Nine-plus ad platforms, one source of truth: the pipelines and metric logic behind a campaign-pacing dashboard.",
    period: "2026 – present",
    role: "Data engineer, Publicis Re:Sources",
    stack: ["Python", "Azure", "PostgreSQL", "SQL"],
    art: "flow",
    links: [],
    problem:
      "Campaign-performance data for global advertising clients lives across nine-plus ad platforms. Media-buying teams need one consistent view to know whether a campaign is pacing to plan.",
    approach: [
      "Python pipelines on Microsoft Azure ingest and consolidate data from 9+ ad platforms into PostgreSQL, automating campaign-performance reporting.",
      "Transformation, deduplication and metric logic that powers a campaign-pacing dashboard.",
      "Data-quality checks and SQL reconciliations across development, QA and production.",
      "Pipeline documentation and onboarding guides so the system outlives its authors.",
    ],
    architecture: {
      main: [
        { label: "9+ ad platforms" },
        { label: "Python on Azure", detail: "ingestion" },
        { label: "Transform", detail: "dedupe · metrics" },
        { label: "PostgreSQL" },
        { label: "Pacing dashboard", detail: "media buyers" },
      ],
      branch: { from: 3, stages: [{ label: "DQ checks", detail: "dev → QA → prod" }] },
    },
    results: [
      "Reporting consolidated from 9+ ad platforms into a single store.",
      todo("impact metric you're allowed to share"),
    ],
    learnings: [todo("1–3 learnings, without client names")],
  },
  {
    slug: "ask-my-portfolio",
    title: "Ask my portfolio",
    short: "Ask my portfolio",
    category: "AI Engineering",
    hook: "The chatbot on this site: retrieval-augmented, grounded only in my own content, and honest when it doesn't know.",
    period: "2026",
    role: "Designed and built",
    stack: ["Next.js", "TypeScript", "Claude API", "BM25", "RAG"],
    art: "constellation",
    links: [{ label: "Try it", href: "#ask" }],
    problem:
      "Portfolios claim skills. A recruiter with one specific question still has to dig through every section. This one lets you ask, and it answers only from what is actually on the site.",
    approach: [
      "Every content file on the site (profile, experience, projects, research, skills) is the single source of truth for both the pages and the bot.",
      "At build time, the content is split into small, citable chunks and indexed for BM25 keyword retrieval, with optional dense embeddings for hybrid search.",
      "Each question retrieves the top matching chunks; Claude answers with a strict system prompt: use only the retrieved context, cite it, never invent dates or numbers, stay under ~120 words, decline off-topic requests.",
      "Answers stream token by token. Per-IP rate limiting and input caps protect the API key, which only ever lives on the server.",
      "If the API is down or out of quota, the widget fails gracefully to a contact link.",
    ],
    architecture: {
      main: [
        { label: "Content files", detail: "/content/*.ts" },
        { label: "Chunker", detail: "build time" },
        { label: "Index", detail: "BM25 (+ embeddings)" },
        { label: "Top-k retrieval" },
        { label: "Claude", detail: "grounded answer" },
        { label: "Streamed reply", detail: "with citations" },
      ],
    },
    results: [
      "No vector database or extra infrastructure: the whole index ships as one JSON file.",
      "Every answer links back to the section it came from.",
    ],
    learnings: [todo("1–3 learnings once it has seen real traffic")],
  },
  {
    slug: "document-qa",
    title: "Document Q&A Assistant",
    short: "Document Q&A",
    category: "AI Engineering · RAG",
    hook: "Upload a PDF, ask it questions: a retrieval-augmented pipeline with LangChain, FAISS and a conversational interface.",
    period: "Jun – Aug 2025",
    role: "Personal project",
    stack: ["LangChain", "OpenAI API", "FAISS", "Streamlit", "Python"],
    art: "pages",
    links: [{ label: "Source / demo", href: todo("GitHub or Hugging Face Space link") }],
    problem:
      "Long documents hide their answers. The goal was natural-language question answering over any custom collection of PDFs.",
    approach: [
      "PDF upload and document chunking.",
      "Embeddings indexed in FAISS for semantic search.",
      "LangChain retrieval chain over OpenAI models for grounded answers.",
      "Conversational Streamlit interface, deployable on Hugging Face Spaces.",
    ],
    architecture: {
      main: [
        { label: "PDF upload" },
        { label: "Chunking" },
        { label: "Embeddings" },
        { label: "FAISS index" },
        { label: "LangChain + OpenAI" },
        { label: "Streamlit chat" },
      ],
    },
    results: [todo("anything measurable, or a link to the live demo")],
    learnings: [todo("1–3 learnings")],
  },
  {
    slug: "discharge-summaries",
    title: "Discharge Summary Pipeline",
    short: "Discharge summaries",
    category: "Healthcare · Data Engineering",
    hook: "1,000+ ICU discharge summaries, extracted and categorised automatically, cutting manual data entry by more than 80%.",
    period: "Jan – Mar 2025",
    role: "Project",
    stack: ["AWS Textract", "Python", "Regex"],
    art: "scan",
    links: [],
    problem:
      "ICU discharge summaries carry diagnoses, comorbidities and outcomes as free text in scanned documents. Turning them into structured data was slow, manual work.",
    approach: [
      "AWS Textract extracts text from each discharge summary.",
      "Python and regular expressions pull out the relevant fields.",
      "Rule-based logic categorises clinical information into diagnoses, comorbidities and outcomes.",
    ],
    architecture: {
      main: [
        { label: "Discharge summaries", detail: "1,000+" },
        { label: "AWS Textract" },
        { label: "Python + regex", detail: "field extraction" },
        { label: "Rule-based categoriser" },
        { label: "Structured records" },
      ],
    },
    results: [
      "Processed more than 1,000 ICU discharge summaries.",
      "Reduced manual data-entry time by over 80%.",
    ],
    learnings: [todo("1–3 learnings")],
  },
];

/** Smaller work that doesn't get a case study. */
export const archive = [
  {
    title: "LLM email categoriser",
    detail:
      "LLaMA 3.2 fine-tuned to classify risk-assessment email at Protiviti; ~60% less manual review.",
    year: "2025",
  },
  {
    title: "Synthetic faces with DCGAN",
    detail:
      "Deep Convolutional GAN in Keras and OpenCV; a study of GAN training dynamics and what they mean for digital forensics.",
    year: "2023",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
