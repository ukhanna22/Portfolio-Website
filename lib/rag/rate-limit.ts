/**
 * Fixed-window, per-IP limits held in memory. Serverless instances each keep their own
 * counters, so this is a speed bump rather than a wall; swap for a shared store if the
 * bot ever attracts real abuse.
 */
type Window = { count: number; reset: number };
const buckets = new Map<string, Window>();

const LIMITS = [
  { key: "min", max: 8, ms: 60_000 },
  { key: "day", max: 60, ms: 86_400_000 },
] as const;

export function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, w] of buckets) if (w.reset < now) buckets.delete(k);
  for (const l of LIMITS) {
    const id = `${l.key}:${ip}`;
    const w = buckets.get(id);
    if (!w || w.reset < now) buckets.set(id, { count: 1, reset: now + l.ms });
    else if (w.count >= l.max) return { ok: false, retryAfter: Math.ceil((w.reset - now) / 1000) };
    else w.count++;
  }
  return { ok: true };
}
