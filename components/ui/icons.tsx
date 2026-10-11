import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12H4m6-6-6 6 6 6" />
  </svg>
);
export const ArrowUp = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20V4m-6 6 6-6 6 6" />
  </svg>
);
export const Copy = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a1 1 0 0 1 1-1h9" />
  </svg>
);
export const Sun = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Moon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
  </svg>
);
export const Close = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Send = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
export const Spark = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.5 2.5m6.4 6.4 2.5 2.5m0-11.4-2.5 2.5m-6.4 6.4-2.5 2.5" />
  </svg>
);
export const Terminal = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 8 4 4-4 4M12 16h7" />
  </svg>
);
export const Search = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const Download = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const Hash = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 9h14M5 15h14M10 4 8 20m8-16-2 16" />
  </svg>
);
export const Robot = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <path d="M12 4v4M9 13h.01M15 13h.01M3 12v3m18-3v3" />
  </svg>
);
export const Book = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
    <path d="M4 19a2 2 0 0 1 2-2h13" />
  </svg>
);
export const Speech = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h16v10H9l-5 4V5Z" />
    <path d="M8 9h8M8 12h5" />
  </svg>
);
