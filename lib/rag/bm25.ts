import type { Chunk } from "./corpus";

const STOP = new Set(
  "a an and are as at be by for from has have he his how i in is it its me my of on or our she that the their them they this to was what when where which who why will with you your utkarsh khanna does did do about tell".split(
    " ",
  ),
);

const SYNONYMS: Record<string, string> = {
  cv: "resume",
  résumé: "resume",
  job: "experience",
  jobs: "experience",
  worked: "experience",
  work: "experience",
  employer: "experience",
  company: "experience",
  study: "education",
  studied: "education",
  degree: "education",
  university: "education",
  college: "education",
  paper: "publication",
  published: "publication",
  research: "publication",
  ieee: "publication",
  mail: "email",
  reach: "contact",
  hire: "contact",
  finetune: "fine-tuning",
  finetuning: "fine-tuning",
  llm: "llama",
};

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']s\b/g, "")
    .split(/[^a-z0-9+#.\-é]+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .flatMap((t) => {
      const base = t.length > 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t;
      const syn = SYNONYMS[t];
      return syn ? [base, syn] : [base];
    });
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
  const q = [...new Set(tokenize(query))];
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
