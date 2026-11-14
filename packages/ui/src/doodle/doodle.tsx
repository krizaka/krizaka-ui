// Server-safe. A doodle of the Cahier (ADR-004, blocks.css): an arrow, a circled word, a star, a wavy underline or a small
// sketch of one of the birds, drawn in the margin ink. It lives in two places: beside a block (`place="margin"`, hung by
// `Stuck`, on a wide screen only — gone below 1360 px, where the page's margin disappears) or in the flow
// (`place="inline"`), where a `circle` or a `wave` can wrap real text (`children`): the word stays text, in the reading
// order, and the ink is drawn around it. Pure functions of their props (the tilt comes from `seed`, never random): the
// same marks on the server and on the client. Decoration, hidden from assistive technology, unless it carries a `label`.
import type * as React from "react";

import { seedUnit } from "../cahier-seed";
import { cn } from "../cn";

export type DoodleKind = "arrow" | "circle" | "star" | "wave" | "bird";
/** The birds with a sketch of their own (the ear tufts, the beak, the legs tell them apart); the rest of the flock is not drawn here. */
export type DoodleBird = "falcon" | "owl" | "duck" | "flamingo" | "pigeon";

export type DoodleProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** What is drawn: `arrow` (points at the block), `circle` (rings a word), `star`, `wave` (an underline) or `bird` (a small sketch). */
  kind: DoodleKind;
  /** Real text a `circle` rings or a `wave` underlines, in the flow (« nothing to copy »): it stays text, the ink is hidden. */
  children?: React.ReactNode;
  /** The word a margin `circle` rings (« ça ! »). It is decoration too: nothing that matters is said only here. */
  word?: string;
  /** Which margin it sits in: `left` (where the notebook's margin is) or `right`. It points at the block from either. @default "left" */
  side?: "left" | "right";
  /** `margin` hangs it beside the nearest positioned ancestor, on a wide screen only; `inline` keeps it in the flow (always, around `children`). @default "margin" */
  place?: "margin" | "inline";
  /** How far from the top of the block it sits, as a CSS length. @default "0px" */
  top?: string;
  /** Where its slight tilt comes from: the same string always leans the same way (±8°). @default "" */
  seed?: string;
  /** Which bird `kind="bird"` sketches. @default "duck" */
  bird?: DoodleBird;
  /** Turns the mark to face the other way (an inline arrow that points left). A margin doodle on the `right` already does. @default false */
  flip?: boolean;
  /** A text equivalent, when the mark says something (« Start with the installation »): it is then an image carrying it. Without it, decoration. */
  label?: string;
};

const PATHS: Record<Exclude<DoodleKind, "bird">, { box: string; d: string[] }> = {
  arrow: { box: "0 0 56 36", d: ["M4 30 C 14 8, 32 6, 50 20", "M41 17 L50 20 L46 28"] },
  circle: { box: "0 0 64 40", d: ["M9 22 C 6 8, 42 2, 54 14 C 62 26, 24 38, 11 29 C 4 23, 14 10, 34 8"] },
  star: { box: "0 0 56 52", d: ["M28 4 L34 20 L52 21 L38 32 L43 48 L28 39 L13 48 L18 32 L4 21 L22 20 Z"] },
  wave: { box: "0 0 56 16", d: ["M2 9 Q 8 1 14 9 T 26 9 T 38 9 T 50 9"] },
};

/** Around real text, the ring and the underline stretch to the word (`preserveAspectRatio="none"`, the stroke kept even). */
const WRAPS: Record<"circle" | "wave", { box: string; d: string }> = {
  circle: { box: "0 0 100 40", d: "M52 4 C18 2 3 14 6 24 C9 36 40 38 70 34 C94 30 99 16 84 8 C76 4 62 3 46 4 C40 4 36 5 33 6" },
  wave: { box: "0 0 100 12", d: "M2 7 Q8 1 14 7 T26 7 T38 7 T50 7 T62 7 T74 7 T86 7 T98 7" },
};

/** The ear tufts, the beak and the legs that tell the birds apart, over a body and a head every bird shares. */
const BIRD_FEATURES: Record<DoodleBird, string> = {
  falcon: "M52 17 Q62 17 60 27 Q57 22 52 23",
  owl: "M39 12 L37 4 L44 10 M51 12 L55 4 L48 10 M52 21 L55 25 L51 25",
  duck: "M52 19 Q62 18 63 23 Q58 25 52 24",
  flamingo: "M51 17 Q58 17 56 24 M44 14 C32 22 50 30 36 40",
  pigeon: "M52 20 L59 22 L52 24",
};

function BirdSketch({ bird }: { bird: DoodleBird }) {
  const owl = bird === "owl";
  const tall = bird === "flamingo";
  return (
    <svg viewBox="0 0 64 64" focusable="false" data-bird={bird}>
      <ellipse cx="30" cy="40" rx="18" ry="12" transform="rotate(-8 30 40)" />
      {tall ? <circle cx="45" cy="12" r="5.5" /> : <circle cx="44" cy="21" r="9" />}
      <path d="M20 40 Q29 31 40 39" />
      <path d="M26 52 L25 61 M34 52 L35 61" />
      <path d={BIRD_FEATURES[bird]} />
      {owl ? <circle cx="47" cy="19" r="4" /> : null}
      <circle cx={tall ? 46.5 : 47} cy={tall ? 11 : 19} r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A doodle: an arrow, a circled word, a star, a wavy underline or a bird's sketch, in the margin ink. Decoration unless it has a `label`. */
export function Doodle({ kind, children, word, side = "left", place = "margin", top, seed = "", bird = "duck", flip = false, label, className, style, ...props }: DoodleProps) {
  const wraps = children != null && (kind === "circle" || kind === "wave");
  const said = !wraps && Boolean(label);
  return (
    <span
      className={cn("kz-doodle", className)}
      data-kind={kind}
      data-side={side}
      data-place={wraps ? "inline" : place}
      data-wrap={wraps ? "" : undefined}
      data-flip={flip ? "" : undefined}
      role={said ? "img" : undefined}
      aria-label={said ? label : undefined}
      aria-hidden={wraps || said ? undefined : true}
      style={{ ...style, ["--kz-doodle-tilt" as string]: `${Math.round(seedUnit(`${kind}${seed}`) * 80) / 10}deg`, ...(top ? { ["--kz-doodle-top" as string]: top } : {}) }}
      {...props}
    >
      {wraps ? (
        <>
          <span className="kz-doodle-word">{children}</span>
          <span className="kz-doodle-ink" aria-hidden>
            <svg viewBox={WRAPS[kind as "circle" | "wave"].box} preserveAspectRatio="none" focusable="false">
              <path d={WRAPS[kind as "circle" | "wave"].d} vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
        </>
      ) : kind === "bird" ? (
        <BirdSketch bird={bird} />
      ) : (
        <svg viewBox={PATHS[kind].box} focusable="false">
          {PATHS[kind].d.map((path) => (
            <path key={path} d={path} />
          ))}
        </svg>
      )}
      {!wraps && kind === "circle" && word ? <span className="kz-doodle-word">{word}</span> : null}
    </span>
  );
}
