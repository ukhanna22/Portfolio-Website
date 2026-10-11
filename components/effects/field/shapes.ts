/**
 * Target formations for the latent-space field. Each returns N local points (x, y, z) around
 * the origin; the renderer places them at a per-state centre and spins them slowly.
 * World units: y spans [-1, 1] on screen, x spans [-aspect, aspect].
 */

export type Formation =
  "noise" | "sphere" | "helix" | "grid" | "rings" | "clusters" | "point" | "uk";

export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: () => number) => {
  const u = Math.max(1e-6, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
};

export function noise(n: number, aspect: number) {
  const r = rng(1);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = (r() * 2 - 1) * aspect * 1.08;
    out[i * 3 + 1] = (r() * 2 - 1) * 1.08;
    out[i * 3 + 2] = (r() * 2 - 1) * 0.9;
  }
  return out;
}

export function sphere(n: number, radius = 0.62) {
  const out = new Float32Array(n * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const th = g * i;
    out[i * 3] = Math.cos(th) * rr * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(th) * rr * radius;
  }
  return out;
}

export function helix(n: number, radius = 0.32, height = 2.1) {
  const r = rng(3);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const strand = i % 3; // two strands + rungs
    const t = r();
    const a = t * Math.PI * 7;
    const y = (t - 0.5) * height;
    if (strand < 2) {
      const off = strand * Math.PI;
      out[i * 3] = Math.cos(a + off) * radius + gauss(r) * 0.012;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = Math.sin(a + off) * radius + gauss(r) * 0.012;
    } else {
      const k = r() * 2 - 1;
      out[i * 3] = Math.cos(a) * radius * k;
      out[i * 3 + 1] = Math.round(y * 14) / 14;
      out[i * 3 + 2] = Math.sin(a) * radius * k;
    }
  }
  return out;
}

export function grid(n: number, aspect: number) {
  const cols = Math.ceil(Math.sqrt(n * 2.2));
  const rows = Math.ceil(n / cols);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const rI = Math.floor(i / cols);
    out[i * 3] = (c / (cols - 1) - 0.5) * aspect * 2.4;
    out[i * 3 + 1] = 0;
    out[i * 3 + 2] = (rI / Math.max(1, rows - 1) - 0.5) * 3;
  }
  return out;
}

export function rings(n: number) {
  const r = rng(5);
  const out = new Float32Array(n * 3);
  const radii = [0.32, 0.5, 0.7];
  const tilts = [0.35, -0.5, 0.9];
  for (let i = 0; i < n; i++) {
    const k = i % 3;
    const a = r() * Math.PI * 2;
    const x = Math.cos(a) * radii[k];
    const z = Math.sin(a) * radii[k];
    const ct = Math.cos(tilts[k]);
    const st = Math.sin(tilts[k]);
    out[i * 3] = x + gauss(r) * 0.008;
    out[i * 3 + 1] = z * st + gauss(r) * 0.008;
    out[i * 3 + 2] = z * ct;
  }
  return out;
}

export function clusters(n: number, aspect: number, count = 7) {
  const r = rng(9);
  const centres = Array.from({ length: count }, (_, k) => {
    const a = (k / count) * Math.PI * 2 + 0.4;
    return [Math.cos(a) * aspect * 0.62, Math.sin(a) * 0.62, (r() - 0.5) * 0.6];
  });
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = centres[i % count];
    const spread = 0.05 + (i % 5) * 0.012;
    out[i * 3] = c[0] + gauss(r) * spread;
    out[i * 3 + 1] = c[1] + gauss(r) * spread;
    out[i * 3 + 2] = c[2] + gauss(r) * spread;
  }
  return out;
}

export function point(n: number) {
  const r = rng(11);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (i % 9 === 0) {
      // a thin halo still orbiting the output
      const a = r() * Math.PI * 2;
      const rad = 0.12 + r() * 0.3;
      out[i * 3] = Math.cos(a) * rad;
      out[i * 3 + 1] = Math.sin(a) * rad * 0.35;
      out[i * 3 + 2] = Math.sin(a) * rad;
    } else {
      out[i * 3] = gauss(r) * 0.012;
      out[i * 3 + 1] = gauss(r) * 0.012;
      out[i * 3 + 2] = gauss(r) * 0.012;
    }
  }
  return out;
}

/** Samples points from rendered text on an offscreen canvas. */
export function text(n: number, label: string, height = 0.9) {
  const cw = 600;
  const ch = 300;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  const out = new Float32Array(n * 3);
  if (!ctx) return out;
  ctx.fillStyle = "#fff";
  const display = document.querySelector("h1.font-display");
  const family = display ? getComputedStyle(display).fontFamily : "Georgia, serif";
  ctx.font = `400 ${ch * 0.95}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cw / 2, ch / 2 + ch * 0.05);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts: number[] = [];
  for (let y = 0; y < ch; y += 3)
    for (let x = 0; x < cw; x += 3) if (data[(y * cw + x) * 4 + 3] > 128) pts.push(x, y);
  const r = rng(13);
  const count = pts.length / 2;
  if (!count) return out;
  const scale = height / ch;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * count) * 2;
    out[i * 3] = (pts[k] - cw / 2) * scale * 2;
    out[i * 3 + 1] = -(pts[k + 1] - ch / 2) * scale * 2;
    out[i * 3 + 2] = (r() - 0.5) * 0.06;
  }
  return out;
}
