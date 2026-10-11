import type { Chunk } from "./corpus";

const STOP = new Set(
  (
    "a an and are as at be by can could did do does for from had has have he her him his how i if in is it its " +
    "know me my of on or our she that the their them they this to was what when where which who why will with " +
    "would you your utkarsh khanna about tell any some there"
  ).split(" "),
);

/** Query-side only, so documents keep their literal vocabulary. */
const SYNONYMS: Record<string, string[]> = {
  cv: ["resume"],
  résumé: ["resume"],
  job: ["role", "experience"],
  employer: ["experience"],
  company: ["experience"],
  study: ["education", "b.tech"],
  studied: ["education", "b.tech"],
  degree: ["education", "b.tech"],
  university: ["education", "nmims"],
  college: ["education", "nmims"],
  publish: ["publication", "paper"],
  published: ["publication", "paper"],
  paper: ["publication"],
  research: ["publication", "paper"],
  ieee: ["publication", "paper"],
  mail: ["email"],
  reach: ["contact", "email"],
  hire: ["contact", "role"],
  finetune: ["fine-tuning", "fine-tuned"],
  finetuning: ["fine-tuning", "fine-tuned"],
  "fine-tune": ["fine-tuning", "fine-tuned"],
  llm: ["llama", "fine-tuning"],
  language: ["languages"],
  speak: ["languages"],
};

/** Very light stemming: enough to match plurals and -ed/-ing forms. */
function stem(t: string) {
  if (t.length > 5 && t.endsWith("ing")) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith("ed")) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith("es") && !t.endsWith("ses")) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

export function tokenize(text: string, query = false): string[] {
  return text
    .toLowerCase()
    .replace(/[’']s\b/g, "")
    .split(/[^a-z0-9+#.\-é]+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .flatMap((t) => [t, ...(query ? (SYNONYMS[t] ?? []) : [])])
    .map(stem);
}

export type Bm25Index = {
  docs: { tf: Map<string, number>; len: number }[];
  df: Map<string, number>;
  avgLen: number;
};

export function buildBm25(chunks: Chunk[]): Bm25Index {
  const df = new Map<string, number>();
  const docs = chunks.map((c) => {
    // the label counts double: it is the strongest signal of what a chunk is about
    const tokens = [...tokenize(c.label), ...tokenize(c.label), ...tokenize(c.text)];
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return { tf, len: tokens.length };
  });
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(1, docs.length);
  return { docs, df, avgLen };
}

export function bm25Scores(index: Bm25Index, query: string, k1 = 1.4, b = 0.7): number[] {
  const q = [...new Set(tokenize(query, true))];
  const N = index.docs.length;
  return index.docs.map((d) => {
    let s = 0;
    for (const t of q) {
      const f = d.tf.get(t);
      if (!f) continue;
      const n = index.df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / index.avgLen)));
    }
    return s;
  });
}
