import { todo, type Todo } from "./todo";

export type Experience = {
  id: string;
  company: string;
  companyNote?: string;
  role: string;
  kind: "Full-time" | "Internship" | "Independent" | "Training";
  start: string;
  end: string;
  location: string;
  summary: string;
  points: (string | Todo)[];
  stack: string[];
  /** Project slugs from projects.ts that came out of this role. */
  projects?: string[];
};

export const experience: Experience[] = [
  {
    id: "publicis",
    company: "Publicis Re:Sources",
    companyNote: "Publicis Groupe",
    role: "Junior Associate, Generative AI (Data Engineering)",
    kind: "Full-time",
    start: "Jan 2026",
    end: "Present",
    location: "Gurugram, India",
    summary:
      "Data engineering for campaign reporting and pacing across global advertising clients, plus the groundwork for GenAI in media planning.",
    points: [
      "Build and maintain Python data pipelines on Microsoft Azure that automate campaign-performance reporting, consolidating data from 9+ ad platforms into PostgreSQL.",
      "Implement the transformation, deduplication and metric logic behind a campaign-pacing dashboard used by media-buying teams.",
      "Develop scalable data infrastructure to bring GenAI capabilities into media planning and execution.",
      "Run data-quality checks and SQL reconciliations across development, QA and production; write the pipeline documentation and onboarding guides.",
      todo("one measurable impact metric from Publicis (and confirm what can be named publicly)"),
    ],
    stack: ["Python", "Azure", "PostgreSQL", "SQL"],
    projects: ["campaign-pacing-platform"],
  },
  {
    id: "maahiraa",
    company: "Maahiraa Diamonds",
    companyNote: "Fine jewellery, Mumbai",
    role: "Software Developer & Designer",
    kind: "Independent",
    start: "Aug 2025",
    end: "Dec 2025",
    location: "Remote",
    summary: "Brand, website and an in-house business system for a fine-jewellery company.",
    points: [
      "Designed and built maahiraadiamonds.com, including the brand logo and user interface.",
      "Built a full-stack inventory and billing application (FastAPI, React, SQLite) that keeps the stock tally across gold, silver and diamond categories.",
      "Automated GST-compliant PDF invoices for every sale and daily metal-rate updates from external APIs, with sales analytics and low-stock alerts.",
    ],
    stack: ["FastAPI", "React", "SQLite", "ReportLab", "APScheduler"],
    projects: ["maahiraa-inventory", "maahiraa-website"],
  },
  {
    id: "protiviti",
    company: "Protiviti India",
    role: "Data Analyst Intern",
    kind: "Internship",
    start: "Jan 2025",
    end: "Jul 2025",
    location: "Gurugram, India",
    summary:
      "Six-month project internship, completed as the B.Tech Semester VIII project (Grade A+).",
    points: [
      "Built an LLM-powered email categorisation tool by fine-tuning LLaMA 3.2 for fast, scalable, accurate classification.",
      "Automated extraction, cleaning, transformation and visualisation pipelines with Azure Document Intelligence and Python.",
      "Streamlined cross-departmental email analysis for risk-assessment workflows, reducing manual review effort by roughly 60%.",
    ],
    stack: ["LLaMA 3.2", "Python", "Azure Document Intelligence"],
  },
  {
    id: "grant-thornton",
    company: "Grant Thornton Bharat",
    role: "Cyber Security Trainee",
    kind: "Training",
    start: "May 2024",
    end: "Jun 2024",
    location: "Gurugram, India",
    summary: "Summer internship between the 6th and 7th semesters.",
    points: [
      "Worked hands-on with cybersecurity tooling, the NIST Cybersecurity Framework and ISO 27001 controls.",
      "Reviewed client firewall policies, ran reconnaissance and web-scraping exercises, and assisted with phishing simulations.",
    ],
    stack: ["NIST CSF", "ISO 27001"],
  },
];
