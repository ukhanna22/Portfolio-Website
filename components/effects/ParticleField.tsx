"use client";

import { useEffect, useRef } from "react";
import { fieldBus } from "@/lib/store";
import * as shapes from "./field/shapes";
import type { Formation } from "./field/shapes";

type Mode = "live" | "static";

/** Where each formation sits on screen and how it moves. cx is a fraction of the aspect ratio. */
const layout: Record<
  Formation,
  { cx: number; cy: number; spin: number; tilt: number; scale: number }
> = {
  noise: { cx: 0, cy: 0, spin: 0, tilt: 0, scale: 1 },
  sphere: { cx: 0.5, cy: 0.02, spin: 0.12, tilt: 0.2, scale: 1 },
  helix: { cx: 0.62, cy: 0, spin: 0.22, tilt: 0.12, scale: 1 },
  grid: { cx: 0, cy: -0.66, spin: 0, tilt: 0.28, scale: 1 },
  rings: { cx: 0.58, cy: 0.05, spin: 0.14, tilt: 0.3, scale: 1 },
  clusters: { cx: 0, cy: 0, spin: 0.035, tilt: 0.15, scale: 1 },
  point: { cx: 0.42, cy: 0.38, spin: 0.35, tilt: 0.25, scale: 1 },
  uk: { cx: 0, cy: 0.04, spin: 0, tilt: 0, scale: 1 },
};

const VERT = `
attribute vec2 a_pos;
attribute float a_size;
attribute float a_alpha;
attribute float a_mix;
uniform float u_dpr;
varying float v_alpha;
varying float v_mix;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr;
  v_alpha = a_alpha;
  v_mix = a_mix;
}`;

const FRAG = `
precision mediump float;
uniform vec3 u_fg;
uniform vec3 u_accent;
varying float v_alpha;
varying float v_mix;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  a = a * 0.75 + smoothstep(0.22, 0.0, d) * 0.25;
  vec3 col = mix(u_fg, u_accent, v_mix);
  gl_FragColor = vec4(col * a * v_alpha, a * v_alpha);
}`;

function cssColor(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = v.startsWith("#") ? v.slice(1) : "ffffff";
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as [number, number, number];
}

function particleCount() {
  const area = window.innerWidth * window.innerHeight;
  const cores = navigator.hardwareConcurrency ?? 4;
  const base = Math.min(2200, Math.max(700, area / 650));
  return Math.round(base * (cores >= 8 ? 1 : 0.65));
}

export default function ParticleField({ mode }: { mode: Mode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      mode === "live"
        ? canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true })
        : null;
    return gl ? runLive(canvas, gl) : runStatic(canvas);
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-[1.6s] data-ready:opacity-100"
    />
  );
}

/* ──────────────────────────── Static (mobile / low-power) ──────────────────────────── */

function runStatic(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const [fr, fg, fb] = cssColor("--fg").map((c) => Math.round(c * 255));
    const [ar, ag, ab] = cssColor("--accent").map((c) => Math.round(c * 255));
    const r = shapes.rng(42);
    const n = Math.round((w * h) / 2600);
    for (let i = 0; i < n; i++) {
      const x = r() * w;
      const y = r() * h;
      const accent = r() < 0.14;
      const depth = 0.35 + r() * 0.65;
      ctx.fillStyle = accent
        ? `rgba(${ar},${ag},${ab},${0.75 * depth})`
        : `rgba(${fr},${fg},${fb},${0.32 * depth})`;
      ctx.beginPath();
      ctx.arc(x, y, (accent ? 1.3 : 1) * depth, 0, Math.PI * 2);
      ctx.fill();
    }
    canvas.dataset.ready = "true";
  };
  draw();
  let t = 0;
  const onResize = () => {
    clearTimeout(t);
    t = window.setTimeout(draw, 200);
  };
  const mo = new MutationObserver(draw);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", onResize);
  return () => {
    mo.disconnect();
    window.removeEventListener("resize", onResize);
  };
}

/* ──────────────────────────── Live (WebGL) ──────────────────────────── */

function runLive(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return runStatic(canvas);
  gl.useProgram(prog);

  const STRIDE = 5;
  const loc = {
    pos: gl.getAttribLocation(prog, "a_pos"),
    size: gl.getAttribLocation(prog, "a_size"),
    alpha: gl.getAttribLocation(prog, "a_alpha"),
    mix: gl.getAttribLocation(prog, "a_mix"),
    dpr: gl.getUniformLocation(prog, "u_dpr"),
    fg: gl.getUniformLocation(prog, "u_fg"),
    accent: gl.getUniformLocation(prog, "u_accent"),
  };
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const F = 4;
  gl.enableVertexAttribArray(loc.pos);
  gl.vertexAttribPointer(loc.pos, 2, gl.FLOAT, false, STRIDE * F, 0);
  gl.enableVertexAttribArray(loc.size);
  gl.vertexAttribPointer(loc.size, 1, gl.FLOAT, false, STRIDE * F, 2 * F);
  gl.enableVertexAttribArray(loc.alpha);
  gl.vertexAttribPointer(loc.alpha, 1, gl.FLOAT, false, STRIDE * F, 3 * F);
  gl.enableVertexAttribArray(loc.mix);
  gl.vertexAttribPointer(loc.mix, 1, gl.FLOAT, false, STRIDE * F, 4 * F);
  gl.enable(gl.BLEND);

  const N = particleCount();
  const pos = new Float32Array(N * 3);
  const off = new Float32Array(N * 2);
  const seed = new Float32Array(N);
  const accent = new Uint8Array(N);
  const out = new Float32Array(N * STRIDE);
  const r = shapes.rng(7);
  for (let i = 0; i < N; i++) {
    seed[i] = r();
    accent[i] = r() < 0.13 ? 1 : 0;
  }

  let aspect = 1;
  let dpr = 1;
  let light = false;
  const cache = new Map<Formation, Float32Array>();
  const build = (f: Formation): Float32Array => {
    switch (f) {
      case "noise":
        return shapes.noise(N, aspect);
      case "sphere":
        return shapes.sphere(N, aspect < 1 ? 0.42 : 0.62);
      case "helix":
        return shapes.helix(N);
      case "grid":
        return shapes.grid(N, aspect);
      case "rings":
        return shapes.rings(N);
      case "clusters":
        return shapes.clusters(N, aspect);
      case "point":
        return shapes.point(N);
      case "uk":
        return shapes.text(N, "UK", aspect < 1 ? 0.45 : 0.75);
    }
  };
  const target = (f: Formation) => {
    let t = cache.get(f);
    if (!t) cache.set(f, (t = build(f)));
    return t;
  };

  // Start from noise, scattered wide, so the first frames look like the field assembling.
  const start = shapes.noise(N, 2.4);
  pos.set(start);

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = w / h;
    cache.clear();
  };
  const readTheme = () => {
    light = document.documentElement.dataset.theme === "light";
    gl.uniform3fv(loc.fg, cssColor("--fg"));
    gl.uniform3fv(loc.accent, cssColor("--accent"));
    if (light) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    else gl.blendFunc(gl.ONE, gl.ONE);
  };
  resize();
  readTheme();

  let state: Formation = "noise";
  let override: Formation | null = null;
  let overrideTimer = 0;
  let mx = 0,
    my = 0,
    mActive = false,
    pmx = 0,
    pmy = 0;

  // Section tracking: whichever [data-field] section crosses the viewport centre.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) state = (e.target as HTMLElement).dataset.field as Formation;
    },
    { rootMargin: "-48% 0px -48% 0px" },
  );
  const observeAll = () =>
    document.querySelectorAll<HTMLElement>("[data-field]").forEach((el) => io.observe(el));
  observeAll();
  const domMo = new MutationObserver(observeAll);
  domMo.observe(document.body, { childList: true, subtree: true });

  const themeMo = new MutationObserver(readTheme);
  themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const offBus = fieldBus.on((e) => {
    if (e.type === "burst") {
      override = "uk";
      for (let i = 0; i < N; i++) {
        const a = seed[i] * Math.PI * 2 * 13;
        const s = 0.15 + seed[(i * 7) % N] * 0.35;
        off[i * 2] += Math.cos(a) * s;
        off[i * 2 + 1] += Math.sin(a) * s;
      }
      clearTimeout(overrideTimer);
      overrideTimer = window.setTimeout(() => (override = null), 4200);
    }
  });

  const onMove = (e: PointerEvent) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = -((e.clientY / window.innerHeight) * 2 - 1);
    mActive = true;
  };
  const onLeave = () => (mActive = false);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  let resizeT = 0;
  const onResize = () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(resize, 150);
  };
  window.addEventListener("resize", onResize);

  let raf = 0;
  let last = performance.now();
  let time = 0;
  let frames = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    const f = override ?? state;
    const L = layout[f];
    const T = target(f);
    const portrait = aspect < 1;
    const cx = portrait ? 0 : L.cx * aspect;
    const cy = portrait && f !== "grid" ? L.cy * 0.5 + 0.25 : L.cy;
    const ang = time * L.spin;
    const ca = Math.cos(ang),
      sa = Math.sin(ang);
    const ct = Math.cos(L.tilt),
      st = Math.sin(L.tilt);

    pmx += ((mActive ? mx : 0) - pmx) * 0.05;
    pmy += ((mActive ? my : 0) - pmy) * 0.05;
    const wmx = mx * aspect,
      wmy = my;
    const R = 0.2;

    const ease = dt * 60;
    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      let lx = T[i3],
        ly = T[i3 + 1];
      const lz = T[i3 + 2];
      const s = seed[i];
      if (f === "noise") {
        lx += Math.sin(time * 0.22 + s * 40) * 0.06;
        ly += Math.cos(time * 0.18 + s * 31) * 0.06;
      } else if (f === "grid") {
        ly += Math.sin(lx * 2.4 + time * 0.8) * 0.05 + Math.cos(lz * 2 + time * 0.6) * 0.04;
      } else {
        lx += Math.sin(time * 0.6 + s * 20) * 0.006;
        ly += Math.cos(time * 0.5 + s * 17) * 0.006;
      }
      // spin around Y, then tilt around X
      const rx = lx * ca + lz * sa;
      const rz = -lx * sa + lz * ca;
      const ry = ly * ct - rz * st;
      const rz2 = ly * st + rz * ct;
      const tx = cx + rx;
      const ty = cy + ry;
      const k = Math.min(1, (0.022 + s * 0.03) * ease);
      pos[i3] += (tx - pos[i3]) * k;
      pos[i3 + 1] += (ty - pos[i3 + 1]) * k;
      pos[i3 + 2] += (rz2 - pos[i3 + 2]) * k;

      // perspective (camera at z = 3)
      const z = 3 - pos[i3 + 2];
      const p = 3 / Math.max(0.5, z);
      let sx = pos[i3] * p - pmx * 0.04;
      let sy = pos[i3 + 1] * p - pmy * 0.04;

      // cursor repulsion in screen space
      if (mActive) {
        const dx = sx - wmx,
          dy = sy - wmy;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1e-4;
          const force = (1 - d / R) * 0.012 * ease;
          off[i * 2] += (dx / d) * force;
          off[i * 2 + 1] += (dy / d) * force;
        }
      }
      off[i * 2] *= 0.94;
      off[i * 2 + 1] *= 0.94;
      sx += off[i * 2];
      sy += off[i * 2 + 1];

      const depth = Math.min(1, Math.max(0.25, (p - 0.6) / 0.9));
      const o = i * STRIDE;
      out[o] = sx / aspect;
      out[o + 1] = sy;
      const isAccent = accent[i] === 1;
      out[o + 2] = (isAccent ? 3.6 : 2.6) * p * (f === "point" && i % 9 !== 0 ? 1.3 : 1);
      out[o + 3] =
        (isAccent ? 0.95 : light ? 0.5 : 0.55) *
        depth *
        (light ? 1 : f === "point" ? 0.55 : 1) *
        (f === "uk" ? 1.3 : 1);
      out[o + 4] = isAccent ? 1 : 0;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(loc.dpr, dpr);
    gl.bufferData(gl.ARRAY_BUFFER, out, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, N);
    if (++frames === 2) canvas.dataset.ready = "true";
  };

  const onVis = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener("visibilitychange", onVis);
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(overrideTimer);
    io.disconnect();
    domMo.disconnect();
    themeMo.disconnect();
    offBus();
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
