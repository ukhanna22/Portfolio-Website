export type Skill = { name: string; projects?: string[]; note?: string };
export type SkillGroup = { id: string; title: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    title: "AI / ML",
    skills: [
      { name: "LLM fine-tuning (LLaMA)", projects: ["wellness-ai"] },
      { name: "LoRA & quantisation", projects: ["wellness-ai"] },
      { name: "RAG", projects: ["ask-my-portfolio", "document-qa"] },
      { name: "LangChain", projects: ["document-qa"] },
      { name: "FAISS", projects: ["document-qa"] },
      { name: "PyTorch", projects: ["wellness-ai"] },
      { name: "Prompt engineering", projects: ["ask-my-portfolio", "document-qa"] },
      { name: "Hugging Face Transformers" },
      { name: "TensorFlow / Keras" },
      { name: "scikit-learn" },
      { name: "OpenCV" },
    ],
  },
  {
    id: "data",
    title: "Data Engineering",
    skills: [
      {
        name: "ETL pipeline design",
        projects: ["campaign-pacing-platform", "discharge-summaries"],
      },
      { name: "Metrics design", projects: ["campaign-pacing-platform"] },
      { name: "Data quality & reconciliation", projects: ["campaign-pacing-platform"] },
      { name: "SQL", projects: ["campaign-pacing-platform"] },
      { name: "Azure Data Factory" },
      { name: "Azure Durable Functions" },
      { name: "SQLAlchemy" },
      { name: "Ibis" },
      { name: "Power BI" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Data Stores",
    skills: [
      {
        name: "Microsoft Azure",
        projects: ["campaign-pacing-platform"],
        note: "Functions, Data Factory, Data Lake, Document Intelligence, Synapse",
      },
      { name: "AWS", projects: ["discharge-summaries"], note: "Textract, S3" },
      { name: "PostgreSQL", projects: ["campaign-pacing-platform"] },
      { name: "SQLite", projects: ["maahiraa-inventory"] },
      { name: "OpenAI API", projects: ["document-qa"] },
      { name: "Claude API", projects: ["ask-my-portfolio"] },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "Firebase" },
    ],
  },
  {
    id: "software",
    title: "Software",
    skills: [
      {
        name: "Python",
        projects: [
          "wellness-ai",
          "maahiraa-inventory",
          "campaign-pacing-platform",
          "document-qa",
          "discharge-summaries",
        ],
      },
      { name: "FastAPI", projects: ["maahiraa-inventory"] },
      { name: "React", projects: ["maahiraa-inventory", "ask-my-portfolio"] },
      { name: "TypeScript / Next.js", projects: ["ask-my-portfolio"] },
      { name: "Streamlit", projects: ["document-qa"] },
      { name: "Docker" },
      { name: "Git" },
      { name: "Java" },
      { name: "C / C++" },
    ],
  },
  {
    id: "design",
    title: "Design",
    skills: [
      { name: "Brand identity", projects: ["maahiraa-website"] },
      { name: "Logo design", projects: ["maahiraa-website"] },
      { name: "UI design", projects: ["maahiraa-website", "maahiraa-inventory"] },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    skills: [
      { name: "English", note: "C1 · IELTS 7.5" },
      { name: "Hindi", note: "Native" },
      { name: "German", note: "A1, learning" },
      { name: "French", note: "School level" },
    ],
  },
];
