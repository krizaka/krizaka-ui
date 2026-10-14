import { ImageResponse } from "next/og";

/* The Open Graph card of every page (1200 × 630), drawn once at build. Colours are the Krizaka dark surface and blue
   accent as literal values: an image has no CSS variables. */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 88, background: "#0d0d0f", color: "#f4f4f5" }}>
        <div style={{ display: "flex", fontSize: 30, color: "#60a5fa", letterSpacing: 2, textTransform: "uppercase" }}>A Krizaka open-source project</div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 800, marginTop: 18 }}>Krizaka UI</div>
        <div style={{ display: "flex", fontSize: 38, marginTop: 24, color: "#a1a1aa", maxWidth: 960 }}>
          Components, tokens, icons, fonts, charts and templates — web and React Native, documented from their code.
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 48, color: "#f4f4f5" }}>ui.krizaka.com</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
