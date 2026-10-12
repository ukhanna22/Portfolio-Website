"use client";

import { Cursor } from "@/components/effects/Cursor";
import { FieldLoader } from "@/components/effects/FieldLoader";
import { KeyboardShortcuts } from "@/components/effects/KeyboardShortcuts";
import { MotionRoot } from "@/components/effects/MotionRoot";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { Overlays } from "./Overlays";
import { ScrollProgress } from "./ScrollProgress";
import { Toaster } from "./Toaster";

/** Client-side chrome shared by every page. Everything heavy inside is lazy. */
export function Shell() {
  return (
    <>
      <FieldLoader />
      <ScrollProgress />
      <MotionRoot />
      <KeyboardShortcuts />
      <Cursor />
      <ChatLauncher />
      <Overlays />
      <Toaster />
    </>
  );
}
