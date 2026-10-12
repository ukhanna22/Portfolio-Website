"use client";

import { useSyncExternalStore } from "react";

/** Tiny global UI store: overlays, theme and toasts, shared by lazily-loaded widgets. */
export type Overlay = "palette" | "terminal" | "chat" | "menu" | null;
export type Toast = { id: number; message: string };

type State = {
  overlay: Overlay;
  theme: "dark" | "light";
  toasts: Toast[];
  chatSeed: string | null;
};

let state: State = { overlay: null, theme: "dark", toasts: [], chatSeed: null };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const ui = {
  get: () => state,
  set(partial: Partial<State>) {
    state = { ...state, ...partial };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  open(overlay: Exclude<Overlay, null>) {
    ui.set({ overlay });
  },
  close() {
    ui.set({ overlay: null });
  },
  toggle(overlay: Exclude<Overlay, null>) {
    ui.set({ overlay: state.overlay === overlay ? null : overlay });
  },
  askChat(question?: string) {
    ui.set({ overlay: "chat", chatSeed: question ?? null });
  },
  toast(message: string) {
    const id = Date.now() + Math.random();
    ui.set({ toasts: [...state.toasts, { id, message }] });
    setTimeout(() => ui.set({ toasts: state.toasts.filter((t) => t.id !== id) }), 2600);
  },
  setTheme(theme: State["theme"]) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    ui.set({ theme });
  },
};

const serverState = state;

export function useUI<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    ui.subscribe,
    () => selector(state),
    () => selector(serverState),
  );
}

/* ─── Particle-field bus: sections and easter eggs talk to the lazily-loaded field ─── */

type FieldEvent = { type: "burst"; shape: "uk" } | { type: "state"; state: string };
const fieldListeners = new Set<(e: FieldEvent) => void>();
export const fieldBus = {
  emit: (e: FieldEvent) => fieldListeners.forEach((l) => l(e)),
  on(l: (e: FieldEvent) => void) {
    fieldListeners.add(l);
    return () => {
      fieldListeners.delete(l);
    };
  },
};
