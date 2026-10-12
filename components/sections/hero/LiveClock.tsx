"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live local time in Gurugram. Renders a neutral placeholder on the server. */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setNow(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time
      className={className}
      suppressHydrationWarning
      aria-label={now ? `Local time ${now} ${profile.timeZoneLabel}` : undefined}
    >
      <span className="tabular-nums">{now ?? "--:--:--"}</span> {profile.timeZoneLabel}
    </time>
  );
}
