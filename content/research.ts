import { todo } from "./todo";

export const paper = {
  title: "Wellness AI: AI-Driven Personalized Diet and Fitness Recommendation",
  authors: ["A. Kothari", "U. Khanna", "N. Shah", "S. Shah"],
  self: "U. Khanna",
  venue:
    "2025 IEEE International Students' Conference on Electrical, Electronics and Computer Science (SCEECS)",
  venueShort: "IEEE SCEECS 2025",
  location: "Bhopal, India",
  year: 2025,
  pages: "1–5",
  doi: "10.1109/SCEECS64059.2025.10940178",
  url: "https://doi.org/10.1109/SCEECS64059.2025.10940178",
  type: "Peer-reviewed conference paper",
  projectSlug: "wellness-ai",
  abstract:
    "Most diet and fitness apps give everyone the same advice. This paper presents Wellness AI, a mobile application that pairs a fine-tuned large language model with real-time biometric data from Apple HealthKit to generate recommendations for the individual. We fine-tuned Meta's LLaMA 3 8B with Low-Rank Adaptation (LoRA), quantised it for on-device inference, and describe the full architecture from data pipeline and fine-tuning through evaluation to mobile deployment.",
  abstractNote: todo("check the plain-English abstract against the published one"),
  bibtex: `@inproceedings{kothari2025wellness,
  author    = {Kothari, A. and Khanna, U. and Shah, N. and Shah, S.},
  title     = {Wellness AI: AI-Driven Personalized Diet and Fitness Recommendation},
  booktitle = {2025 IEEE International Students' Conference on Electrical, Electronics and Computer Science (SCEECS)},
  address   = {Bhopal, India},
  year      = {2025},
  pages     = {1--5},
  doi       = {10.1109/SCEECS64059.2025.10940178}
}`,
} as const;

export const otherWriting = [
  {
    title: "Apple's Marketing & Innovation Strategy",
    venue: "Technology, Business and Management in Dynamic Era · Imperial Publications",
    year: 2024,
    kind: "Book chapter",
    note: "ISBN 978-93-91044-51-0",
  },
] as const;
