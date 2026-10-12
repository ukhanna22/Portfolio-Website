"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { onIdle, prefersReducedMotion } from "@/lib/utils";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

type Mode = "off" | "static" | "live";

function detect(): Mode {
  if (prefersReducedMotion()) return "off";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "off";
  const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  if (lowPower || (coarse && small)) return "static";
  return "live";
}

/** Decides how much of the particle field this device gets, after first paint. */
export function FieldLoader() {
  const [mode, setMode] = useState<Mode>("off");
  useEffect(() => onIdle(() => setMode(detect()), 1200), []);
  return (
    <>
      <div aria-hidden className="field-backdrop" />
      {mode !== "off" && <ParticleField mode={mode} />}
    </>
  );
}
