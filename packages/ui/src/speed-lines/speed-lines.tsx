// Server-safe. The manga action lines of the Krizaka style (blocks.css): thin wedges that burst from behind a hero element
// (`radial`) or streak across it (`horizontal`), in SVG. Deterministic (an integer hash of the index, never Math.random), static
// by default, and still under `prefers-reduced-motion`: `animated` only pulses them, and the stylesheet stops that.
// Decoration: the lines are hidden from assistive technology, the content in front is the real thing.
import type * as React from "react";

import { cn } from "../cn";

export type SpeedLinesProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `radial` bursts from the centre; `horizontal` streaks across. @default "radial" */
  kind?: "radial" | "horizontal";
  /** How many lines (4 to 120). @default 36 */
  count?: number;
  /** For `radial`: the share of the height left clear around the centre, 0 to 80. @default 34 */
  clear?: number;
  /** A slow pulse of the lines; off under reduced motion. @default false */
  animated?: boolean;
  /** The element the lines sit behind. */
  children?: React.ReactNode;
};

/** A stable 0–1 value of `i` and a `salt`: integer arithmetic only, so the server and the client draw the same lines. */
const unit = (i: number, salt: number) => {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(salt + 7, 40503);
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  h = Math.imul(h ^ (h >>> 13), 3266489917);
  return ((h ^ (h >>> 16)) >>> 0) % 1000 / 1000;
};
const r2 = (n: number) => Math.round(n * 100) / 100;

function radial(count: number, clear: number) {
  const cx = 100;
  const cy = 50;
  const inner = (clear / 100) * 50;
  return Array.from({ length: count }, (_, i) => {
    const a = ((i + (unit(i, 1) - 0.5) * 0.6) / count) * Math.PI * 2;
    const w = 0.012 + unit(i, 2) * 0.05;
    const r0 = inner * (0.8 + unit(i, 3) * 0.5);
    const r1 = 150;
    const p = (r: number, da: number) => `${r2(cx + r * Math.cos(a + da))},${r2(cy + r * Math.sin(a + da))}`;
    return { key: i, points: `${p(r0, 0)} ${p(r1, -w)} ${p(r1, w)}`, opacity: r2(0.35 + unit(i, 4) * 0.5) };
  });
}

function horizontal(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const y = ((i + unit(i, 5) * 0.8) / count) * 100;
    const x = unit(i, 6) * 120;
    return { key: i, x: r2(x), y: r2(y), width: r2(40 + unit(i, 7) * 100), height: r2(0.25 + unit(i, 8) * 0.9), opacity: r2(0.3 + unit(i, 9) * 0.5) };
  });
}

/** Manga action lines behind a hero element: a burst or streaks in SVG, still under reduced motion. */
/** @deprecated Krizaka UI 3.74: removed in 4.0.0 (krizaka-ui#840). No product uses it and there is no replacement. */
export function SpeedLines({ kind = "radial", count = 36, clear = 34, animated = false, className, children, ...props }: SpeedLinesProps) {
  const n = Math.min(120, Math.max(4, Math.round(count)));
  const gap = Math.min(80, Math.max(0, clear));
  return (
    <div className={cn("kz-speed", className)} data-kind={kind} data-speed-animated={animated ? "" : undefined} {...props}>
      <svg className="kz-speed-lines" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        {kind === "radial"
          ? radial(n, gap).map((l) => <polygon key={l.key} points={l.points} fill="currentColor" opacity={l.opacity} />)
          : horizontal(n).map((l) => <rect key={l.key} x={l.x} y={l.y} width={l.width} height={l.height} fill="currentColor" opacity={l.opacity} />)}
      </svg>
      <div className="kz-speed-content">{children}</div>
    </div>
  );
}
