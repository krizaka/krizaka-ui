// Server-safe. A margin doodle of the Cahier (ADR-004, blocks.css): an arrow, a circled word, a star, a wavy underline, a
// tiny bird, drawn in the margin ink beside a block. Decoration only: hidden from assistive technology, never over
// text, and gone below the width where the page's margin disappears (blocks.css: 1360 px).
import type * as React from "react";

import { seedUnit } from "../cahier-seed";
import { cn } from "../cn";

export type DoodleKind = "arrow" | "circle" | "star" | "wave" | "bird";

export type DoodleProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** What is drawn: `arrow` (points at the block), `circle` (rings a `word`), `star`, `wave` (an underline) or `bird` (a tiny sketch). */
  kind: DoodleKind;
  /** The word a `circle` rings (« ça ! »). It is decoration too: nothing that matters is said only here. */
  word?: string;
  /** Which margin it sits in: `left` (where the notebook's margin is) or `right`. It points at the block from either. @default "left" */
  side?: "left" | "right";
  /** `margin` hangs it beside the nearest positioned ancestor, on a wide screen only; `inline` keeps it in the flow. @default "margin" */
  place?: "margin" | "inline";
  /** How far from the top of the block it sits, as a CSS length. @default "0px" */
  top?: string;
  /** Where its slight tilt comes from: the same string always leans the same way (±8°). @default "" */
  seed?: string;
};

const PATHS: Record<DoodleKind, { box: string; d: string[] }> = {
  arrow: { box: "0 0 56 36", d: ["M4 30 C 14 8, 32 6, 50 20", "M41 17 L50 20 L46 28"] },
  circle: { box: "0 0 64 40", d: ["M9 22 C 6 8, 42 2, 54 14 C 62 26, 24 38, 11 29 C 4 23, 14 10, 34 8"] },
  star: { box: "0 0 56 52", d: ["M28 4 L34 20 L52 21 L38 32 L43 48 L28 39 L13 48 L18 32 L4 21 L22 20 Z"] },
  wave: { box: "0 0 56 16", d: ["M2 9 Q 8 1 14 9 T 26 9 T 38 9 T 50 9"] },
  bird: { box: "0 0 56 44", d: ["M5 26 C 12 12, 28 12, 36 21 L 50 14 L 43 27 C 38 38, 18 39, 5 26 Z", "M20 38 L18 43 M27 38 L26 43", "M33 20 L33.5 20"] },
};

/** A margin doodle: an arrow, a circled word, a star, a wavy underline or a tiny bird, in the margin ink. Decoration. */
export function Doodle({ kind, word, side = "left", place = "margin", top, seed = "", className, style, ...props }: DoodleProps) {
  const { box, d } = PATHS[kind];
  return (
    <span
      className={cn("kz-doodle", className)}
      data-kind={kind}
      data-side={side}
      data-place={place}
      aria-hidden
      style={{ ...style, ["--kz-doodle-tilt" as string]: `${Math.round(seedUnit(`${kind}${seed}`) * 80) / 10}deg`, ...(top ? { ["--kz-doodle-top" as string]: top } : {}) }}
      {...props}
    >
      <svg viewBox={box} focusable="false">
        {d.map((path) => (
          <path key={path} d={path} />
        ))}
      </svg>
      {kind === "circle" && word ? <span className="kz-doodle-word">{word}</span> : null}
    </span>
  );
}
