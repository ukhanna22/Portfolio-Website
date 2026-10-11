/** Shared easing curves. Nothing linear, nothing bouncy. */
export const ease = {
  reveal: [0.76, 0, 0.24, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const easeCss = {
  reveal: "cubic-bezier(0.76, 0, 0.24, 1)",
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export const duration = { fast: 0.25, base: 0.6, slow: 1.1 };
