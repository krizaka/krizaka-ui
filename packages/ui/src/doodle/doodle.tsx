// Server-safe. The doodles of the Cahier's margins (ADR-004, blocks.css): an arrow to a heading, a circled word, stars, a wavy
// underline, a small sketch of a bird — hand-drawn marks in inline SVG, in the margin's ink (`--kz-doodle-ink`). Pure
// functions of their props: the same marks on the server and on the client, no random. Decoration: a word it marks is real
// text, and a mark that stands alone is hidden from assistive technology unless it carries a `label`.
import type * as React from "react";

import { cn } from "../cn";
import type { MascotBird } from "../mascots/geometry";

export type DoodleKind = "arrow" | "circle" | "stars" | "underline" | "bird";

export type DoodleProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The mark: `arrow` (points to a heading), `circle` and `underline` (wrap a word), `stars`, `bird` (a sketch). */
  kind: DoodleKind;
  /** The word a `circle` or an `underline` marks: it stays real text. */
  children?: React.ReactNode;
  /** Which bird `kind="bird"` sketches. @default "duck" */
  bird?: MascotBird;
  /** Turns an `arrow` or a `bird` to face left. @default false */
  flip?: boolean;
  /** A text equivalent, when the mark says something (`See the install steps`). Without it the mark is decoration, hidden. */
  label?: string;
};

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** A four-pointed sparkle centred on (x, y). */
const sparkle = (x: number, y: number, r: number) => {
  const k = r * 0.3;
  return `M${r1(x)} ${r1(y - r)} L${r1(x + k)} ${r1(y - k)} L${r1(x + r)} ${r1(y)} L${r1(x + k)} ${r1(y + k)} L${r1(x)} ${r1(y + r)} L${r1(x - k)} ${r1(y + k)} L${r1(x - r)} ${r1(y)} L${r1(x - k)} ${r1(y - k)} Z`;
};

/** The ear tufts, the beak and the legs that tell the birds apart, over a body and a head every bird shares. */
const BIRD_FEATURES: Readonly<Record<string, string>> = {
  falcon: "M52 17 Q62 17 60 27 Q57 22 52 23",
  owl: "M39 12 L37 4 L44 10 M51 12 L55 4 L48 10 M52 21 L55 25 L51 25",
  duck: "M52 19 Q62 18 63 23 Q58 25 52 24",
  flamingo: "M51 17 Q58 17 56 24 M44 14 C32 22 50 30 36 40",
  pigeon: "M52 20 L59 22 L52 24",
};

function BirdSketch({ bird }: { bird: MascotBird }) {
  const owl = bird === "owl";
  const tall = bird === "flamingo";
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <g {...STROKE}>
        <ellipse cx="30" cy="40" rx="18" ry="12" transform="rotate(-8 30 40)" />
        {!tall && <circle cx="44" cy="21" r="9" />}
        {tall && <circle cx="45" cy="12" r="5.5" />}
        <path d="M20 40 Q29 31 40 39" />
        <path d="M26 52 L25 61 M34 52 L35 61" />
        <path d={BIRD_FEATURES[bird] ?? BIRD_FEATURES.duck} />
        {owl && <circle cx="47" cy="19" r="4" />}
      </g>
      <circle cx={tall ? 46.5 : 47} cy={tall ? 11 : 19} r="1.6" fill="currentColor" />
    </svg>
  );
}

function Mark({ kind, bird }: { kind: DoodleKind; bird: MascotBird }) {
  switch (kind) {
    case "arrow":
      return (
        <svg viewBox="0 0 64 40" width="100%" height="100%" aria-hidden="true" focusable="false">
          <path {...STROKE} d="M4 30 C20 6 40 6 58 22 M47 19 L58 22 L53 32" />
        </svg>
      );
    case "stars":
      return (
        <svg viewBox="0 0 64 40" width="100%" height="100%" aria-hidden="true" focusable="false">
          <path {...STROKE} d={`${sparkle(14, 24, 11)} ${sparkle(40, 12, 8)} ${sparkle(54, 30, 5)}`} />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path {...STROKE} d="M52 4 C18 2 3 14 6 24 C9 36 40 38 70 34 C94 30 99 16 84 8 C76 4 62 3 46 4 C40 4 36 5 33 6" />
        </svg>
      );
    case "underline":
      return (
        <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path {...STROKE} d="M2 7 Q8 1 14 7 T26 7 T38 7 T50 7 T62 7 T74 7 T86 7 T98 7" />
        </svg>
      );
    case "bird":
      return <BirdSketch bird={bird} />;
  }
}

/** A hand-drawn mark for a margin: an arrow, a circled word, stars, a wavy underline, a bird sketch. Decoration, with a real text equivalent. */
export function Doodle({ kind, children, bird = "duck", flip = false, label, className, ...props }: DoodleProps) {
  const wraps = kind === "circle" || kind === "underline";
  const hidden = wraps || !label;
  return (
    <span
      className={cn("kz-doodle", className)}
      data-kind={kind}
      data-flip={flip ? "" : undefined}
      role={wraps || !label ? undefined : "img"}
      aria-label={wraps || !label ? undefined : label}
      aria-hidden={wraps || label ? undefined : true}
      {...props}
    >
      {wraps && <span className="kz-doodle-word">{children}</span>}
      <span className="kz-doodle-ink" aria-hidden={hidden ? true : undefined}>
        <Mark kind={kind} bird={bird} />
      </span>
    </span>
  );
}
