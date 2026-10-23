import { SpeedLines } from "@krizaka/ui/speed-lines";

// A radial burst behind the title that opens a page: the lines are decoration, the title is the page's h1.
export default function SpeedLinesHero() {
  return (
    <SpeedLines style={{ minHeight: 280, padding: 32 }} clear={36}>
      <h1 style={{ margin: 0, textAlign: "center", fontFamily: "var(--kz-font-display)", fontSize: "clamp(32px, 6vw, 56px)", background: "var(--kz-surface-0)", padding: "8px 20px" }}>
        2.0.0 is out
      </h1>
    </SpeedLines>
  );
}
