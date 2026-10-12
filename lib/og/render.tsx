import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { rng } from "@/components/effects/field/shapes";

export const ogSize = { width: 1200, height: 630 };

const fonts = async () => {
  const dir = join(process.cwd(), "assets/fonts");
  const [serif, mono] = await Promise.all([
    readFile(join(dir, "instrument-serif-latin-400-normal.woff")),
    readFile(join(dir, "GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
};

/** Shared OG card: name, page title, and a scatter of accent "embeddings". */
export async function renderOg({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string;
  title: string;
  footer: string;
}) {
  const r = rng(title.length * 97 + 13);
  const dots = Array.from({ length: 140 }, (_, i) => {
    // denser towards the right, like the hero field
    const x = 560 + Math.pow(r(), 0.7) * 640;
    const y = r() * 630;
    const accent = r() < 0.18;
    const s = accent ? 3 + r() * 3 : 1.5 + r() * 2;
    return { i, x, y, s, accent, o: 0.25 + r() * 0.7 };
  });
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#07080B",
        color: "#EDEDEF",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle at 82% 30%, rgba(79,240,210,0.18), transparent 55%)",
        }}
      />
      {dots.map((d) => (
        <div
          key={d.i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            borderRadius: 999,
            background: d.accent ? "#4FF0D2" : "#EDEDEF",
            opacity: d.accent ? d.o : d.o * 0.4,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#8A8F98",
          }}
        >
          <span
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 44,
              color: "#EDEDEF",
              letterSpacing: 0,
            }}
          >
            U<span style={{ color: "#4FF0D2" }}>K</span>
          </span>
          <span>{eyebrow}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Instrument Serif",
            fontSize: title.length > 26 ? 96 : 124,
            lineHeight: 0.95,
            letterSpacing: -3,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#8A8F98",
          }}
        >
          <span>{footer}</span>
          <span style={{ color: "#4FF0D2" }}>utkarshkhanna.in</span>
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}
