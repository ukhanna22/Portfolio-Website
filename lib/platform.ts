"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** "⌘" on Apple platforms, "Ctrl" elsewhere. Server render assumes ⌘. */
export function useModKey() {
  return useSyncExternalStore(
    noop,
    () => (isApple() ? "⌘" : "Ctrl"),
    () => "⌘",
  );
}
