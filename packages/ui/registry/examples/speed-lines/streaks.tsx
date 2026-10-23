import { SpeedLines } from "@krizaka/ui/speed-lines";

// Horizontal streaks behind a live demo (here a counter): the speed is in the lines, the demo stays calm.
export default function SpeedLinesStreaks() {
  return (
    <SpeedLines kind="horizontal" count={30} style={{ minHeight: 200, padding: 24 }}>
      <output style={{ display: "block", padding: "12px 28px", fontFamily: "var(--kz-font-mono)", fontSize: 28, background: "var(--kz-surface-1)", border: "1px solid var(--kz-border-default)" }}>
        60 fps · 0.0 ms jank
      </output>
    </SpeedLines>
  );
}
