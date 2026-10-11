import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const serif = await readFile(
    join(process.cwd(), "assets/fonts/instrument-serif-latin-400-normal.woff"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07080B",
        color: "#EDEDEF",
        fontFamily: "Instrument Serif",
        fontSize: 108,
        letterSpacing: -4,
      }}
    >
      U<span style={{ color: "#4FF0D2" }}>K</span>
    </div>,
    { ...size, fonts: [{ name: "Instrument Serif", data: serif, weight: 400, style: "normal" }] },
  );
}
