/**
 * Build step: chunks every content file into a retrieval index (and embeds it when
 * VOYAGE_API_KEY is set). Output: content/.generated/rag-index.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildCorpus } from "../lib/rag/corpus";
import { embed, embeddingModel } from "../lib/rag/embed";

const out = join(process.cwd(), "content/.generated/rag-index.json");

async function main() {
  const chunks = buildCorpus();
  let vectors: number[][] | null = null;
  try {
    vectors = await embed(
      chunks.map((c) => `${c.label}\n${c.text}`),
      "document",
    );
  } catch (err) {
    console.warn(`[rag] embeddings skipped: ${(err as Error).message}`);
  }
  const data = {
    model: vectors ? embeddingModel() : null,
    chunks: chunks.map((c, i) => (vectors ? { ...c, vector: vectors[i] } : c)),
  };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(data));
  console.log(
    `[rag] ${chunks.length} chunks indexed (${vectors ? `dense: ${data.model}` : "BM25 only"})`,
  );
}

main();
