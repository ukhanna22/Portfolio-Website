"use client";

import { useEffect, useRef, useState } from "react";
import type { ArtVariant } from "@/content/projects";

/**
 * Deterministic generative covers, one motif per project, drawn from what the project
 * actually does (attention maps, ledgers, facets, pipelines, vectors, chunks, scans).
 */
const W = 400;
const H = 300;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const A = "var(--accent)";
const F = "var(--fg)";

function Attention() {
  const r = rng(7);
  const n = 14;
  const s = 15;
  const ox = (W - n * s) / 2;
  const oy = (H - n * s) / 2;
  const cells = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      const near = Math.exp(-Math.abs(i - j) / 2.2);
      const v = Math.min(1, near * 0.8 + r() * 0.35 * (r() > 0.7 ? 1 : 0.3));
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={ox + j * s}
          y={oy + i * s}
          width={s - 2}
          height={s - 2}
          rx={1.5}
          fill={v > 0.62 ? A : F}
          opacity={v > 0.62 ? v : v * 0.32}
        />,
      );
    }
  return <g>{cells}</g>;
}

function Ledger() {
  const r = rng(11);
  const rows = [];
  for (let i = 0; i < 11; i++) {
    const y = 40 + i * 21;
    const w1 = 40 + r() * 70;
    const hot = i === 3 || i === 7;
    rows.push(
      <g key={i}>
        <line x1={40} x2={360} y1={y + 14} y2={y + 14} stroke={F} strokeOpacity={0.1} />
        <rect x={40} y={y} width={w1} height={8} rx={2} fill={F} opacity={0.22} />
        <rect
          x={200}
          y={y}
          width={30 + r() * 40}
          height={8}
          rx={2}
          fill={hot ? A : F}
          opacity={hot ? 0.95 : 0.14}
        />
        <rect x={320 - r() * 20} y={y} width={40} height={8} rx={2} fill={F} opacity={0.3} />
      </g>,
    );
  }
  return <g>{rows}</g>;
}

function Facets() {
  const cx = W / 2;
  const cy = H / 2 + 6;
  const R = 110;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
  });
  const inner = pts.map(([x, y]) => [cx + (x - cx) * 0.48, cy + (y - cy) * 0.48]);
  const lines = [];
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % 8];
    const [ix, iy] = inner[i];
    const [jx, jy] = inner[(i + 1) % 8];
    lines.push(
      <g key={i}>
        <polygon
          points={`${x1},${y1} ${x2},${y2} ${jx},${jy} ${ix},${iy}`}
          fill={i % 3 === 0 ? A : F}
          fillOpacity={i % 3 === 0 ? 0.16 : 0.03}
          stroke={F}
          strokeOpacity={0.35}
          strokeWidth={0.8}
        />
        <line
          x1={ix}
          y1={iy}
          x2={cx}
          y2={cy}
          stroke={i % 2 ? A : F}
          strokeOpacity={i % 2 ? 0.8 : 0.3}
          strokeWidth={0.8}
        />
        <line x1={x1} y1={y1} x2={jx} y2={jy} stroke={F} strokeOpacity={0.2} strokeWidth={0.6} />
      </g>,
    );
  }
  return <g>{lines}</g>;
}

function Flow() {
  const paths = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const y0 = 40 + (i * (H - 80)) / (n - 1);
    paths.push(
      <g key={i}>
        <circle cx={40} cy={y0} r={3.5} fill={F} opacity={0.55} />
        <path
          d={`M 40 ${y0} C 180 ${y0}, 200 ${H / 2}, 300 ${H / 2}`}
          stroke={i === 4 ? A : F}
          strokeOpacity={i === 4 ? 0.9 : 0.25}
          strokeWidth={1}
          fill="none"
        />
      </g>,
    );
  }
  return (
    <g>
      {paths}
      <rect
        x={300}
        y={H / 2 - 26}
        width={62}
        height={52}
        rx={6}
        fill="none"
        stroke={A}
        strokeWidth={1.2}
      />
      <line x1={300} x2={362} y1={H / 2 - 8} y2={H / 2 - 8} stroke={A} strokeOpacity={0.5} />
      <line x1={300} x2={362} y1={H / 2 + 8} y2={H / 2 + 8} stroke={A} strokeOpacity={0.5} />
    </g>
  );
}

function Constellation() {
  const r = rng(23);
  const q = [W * 0.56, H * 0.48];
  const pts = Array.from({ length: 46 }, () => [30 + r() * (W - 60), 24 + r() * (H - 48)]);
  const d = (p: number[]) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const near = [...pts].sort((a, b) => d(a) - d(b)).slice(0, 5);
  return (
    <g>
      {near.map((p, i) => (
        <line
          key={`l${i}`}
          x1={q[0]}
          y1={q[1]}
          x2={p[0]}
          y2={p[1]}
          stroke={A}
          strokeOpacity={0.7}
          strokeWidth={0.8}
        />
      ))}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={near.includes(p) ? 3.2 : 2}
          fill={near.includes(p) ? A : F}
          opacity={near.includes(p) ? 1 : 0.35}
        />
      ))}
      <circle cx={q[0]} cy={q[1]} r={6} fill="none" stroke={A} strokeWidth={1.2} />
      <circle cx={q[0]} cy={q[1]} r={2.5} fill={A} />
    </g>
  );
}

function Pages() {
  const r = rng(5);
  const pages = [];
  for (let p = 0; p < 3; p++) {
    const x = 70 + p * 90;
    const y = 40 + p * 14;
    const rows = [];
    for (let i = 0; i < 9; i++) {
      const hot = (p === 1 && (i === 3 || i === 4)) || (p === 2 && i === 6);
      rows.push(
        <rect
          key={i}
          x={x + 14}
          y={y + 22 + i * 20}
          width={60 + r() * 50}
          height={6}
          rx={2}
          fill={hot ? A : F}
          opacity={hot ? 0.95 : 0.18}
        />,
      );
    }
    pages.push(
      <g key={p}>
        <rect
          x={x}
          y={y}
          width={140}
          height={210}
          rx={6}
          fill="var(--bg)"
          stroke={F}
          strokeOpacity={0.25}
        />
        {rows}
      </g>,
    );
  }
  return <g>{pages}</g>;
}

function Scan() {
  const r = rng(31);
  const rows = [];
  for (let i = 0; i < 12; i++) {
    const y = 36 + i * 19;
    rows.push(
      <rect
        key={i}
        x={60}
        y={y}
        width={120 + r() * 130}
        height={5}
        rx={2}
        fill={F}
        opacity={0.16}
      />,
    );
  }
  return (
    <g>
      <rect
        x={44}
        y={20}
        width={312}
        height={260}
        rx={6}
        fill="none"
        stroke={F}
        strokeOpacity={0.2}
      />
      {rows}
      <rect x={56} y={89} width={150} height={14} rx={2} fill="none" stroke={A} strokeWidth={1} />
      <rect x={56} y={165} width={190} height={14} rx={2} fill="none" stroke={A} strokeWidth={1} />
      <rect x={44} y={128} width={312} height={1.5} fill={A} />
      <rect x={44} y={98} width={312} height={30} fill="url(#scanfade)" />
      <defs>
        <linearGradient id="scanfade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.18" />
        </linearGradient>
      </defs>
    </g>
  );
}

const variants: Record<ArtVariant, () => React.ReactElement> = {
  attention: Attention,
  ledger: Ledger,
  facets: Facets,
  flow: Flow,
  constellation: Constellation,
  pages: Pages,
  scan: Scan,
};

/**
 * Rendered on the client once the cover nears the viewport, so ~40 KB of SVG stays out of the
 * HTML and the RSC payload. Until then only the grid shows.
 */
export function ProjectArt({ variant, className }: { variant: ArtVariant; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Art = variants[variant];
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      role="presentation"
    >
      <defs>
        <pattern id={`grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="var(--fg)"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#grid-${variant})`} />
      {shown && (
        <g style={{ animation: "art-in 0.9s var(--ease-out) both" }}>
          <Art />
        </g>
      )}
    </svg>
  );
}
