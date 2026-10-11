/**
 * Optional dense embeddings (Voyage AI). Without VOYAGE_API_KEY, retrieval is BM25-only,
 * which is plenty for a corpus this size.
 */
export const embeddingModel = () => process.env.VOYAGE_MODEL || "voyage-3.5-lite";

export async function embed(
  texts: string[],
  inputType: "document" | "query",
): Promise<number[][] | null> {
  const key = process.env.VOYAGE_API_KEY;
  if (!key || texts.length === 0) return null;
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ input: texts, model: embeddingModel(), input_type: inputType }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Embedding request failed: ${res.status}`);
  const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

export function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
