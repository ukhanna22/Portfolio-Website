import index from "@/content/.generated/rag-index.json";
import type { Chunk } from "./corpus";
import { bm25Scores, buildBm25 } from "./bm25";
import { cosine, embed, embeddingModel } from "./embed";

type IndexFile = { model: string | null; chunks: (Chunk & { vector?: number[] })[] };
const data = index as IndexFile;
const bm25 = buildBm25(data.chunks);

export type Retrieved = Chunk & { score: number };

const rank = (scores: number[]) => {
  const order = scores.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]);
  const r = new Array<number>(scores.length);
  order.forEach(([, i], pos) => (r[i] = pos));
  return r;
};

/** BM25, fused with dense similarity (reciprocal rank fusion) when embeddings are available. */
export async function retrieve(query: string, k = 6): Promise<Retrieved[]> {
  const lexical = bm25Scores(bm25, query);
  let fused = lexical;

  const hasVectors =
    data.model && data.model === embeddingModel() && data.chunks.every((c) => c.vector);
  if (hasVectors) {
    try {
      const qv = (await embed([query], "query"))?.[0];
      if (qv) {
        const dense = data.chunks.map((c) => cosine(qv, c.vector!));
        const rl = rank(lexical);
        const rd = rank(dense);
        fused = data.chunks.map(
          (_, i) => 1 / (60 + rl[i]) + 1 / (60 + rd[i]) + (lexical[i] > 0 ? 0 : -0.002),
        );
      }
    } catch {
      // dense retrieval is a bonus; fall back to BM25 silently
    }
  }

  const ranked = data.chunks
    .map((c, i) => ({ id: c.id, label: c.label, href: c.href, text: c.text, score: fused[i] }))
    .sort((a, b) => b.score - a.score);

  // Always ground answers in at least the overview, even for vague questions.
  const top = ranked.filter((c) => c.score > 0).slice(0, k);
  if (top.length < 2) {
    for (const id of ["profile", "about-0"]) {
      const c = ranked.find((x) => x.id === id);
      if (c && !top.includes(c)) top.push(c);
    }
  }
  return top;
}
