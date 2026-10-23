// Server-safe. A block stuck into the notebook (ADR-004, blocks.css): a figure, a specimen tag, a card, a print — held by
// tape, a pin, photo corners or a lifted edge, slightly tilted (from data, never random), on the Cahier's hard paper
// shadow. The tape is TapedPhoto's own (the same rule in blocks.css). The tilt is a transform: nothing shifts.
import type * as React from "react";

import { seedUnit } from "../cahier-seed";
import { cn } from "../cn";

export type StuckHold = "tape" | "tape-corners" | "pin" | "corner" | "glue";

export type StuckProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** What is stuck: a figure, a `SpecimenTag`, a card, a `TapedPhoto`. */
  children: React.ReactNode;
  /**
   * How it is held: `tape` (one strip), `tape-corners` (two opposite corners), `pin` (a drawing pin), `corner` (photo
   * corners) or `glue` (a slightly lifted edge).
   * @default "tape"
   */
  hold?: StuckHold;
  /** The tilt in degrees (negative leans left). Without it, the tilt comes from `seed`. */
  tilt?: number;
  /** Where the tilt comes from when `tilt` is not given: the same string always leans the same way (±2°). @default "" */
  seed?: string;
  /** Margin doodles (`Doodle`) drawn beside the block; they leave with the margin on a narrow screen. */
  doodle?: React.ReactNode;
  /** The element of the wrapper. A `figure` goes inside, never here. @default "div" */
  as?: "div" | "li" | "aside";
};

/** The tilt of a stuck block: `tilt` when given, otherwise a steady lean (−2° to 2°) read from `seed`, rounded to a tenth. */
export function stuckTilt(seed: string, tilt?: number): number {
  return tilt ?? Math.round(seedUnit(seed) * 20) / 10;
}

/** A block stuck into the notebook: held by tape, a pin, photo corners or glue; tilted from data; a hard paper shadow. */
export function Stuck({ children, hold = "tape", tilt, seed = "", doodle, as: Tag = "div", className, style, ...props }: StuckProps) {
  return (
    <Tag className={cn("kz-stuck", className)} style={style} {...props}>
      <div className="kz-stuck-body" data-hold={hold} style={{ ["--kz-stuck-tilt" as string]: `${stuckTilt(seed, tilt)}deg` }}>
        {hold === "pin" ? <span className="kz-stuck-pin" aria-hidden /> : null}
        {children}
      </div>
      {doodle}
    </Tag>
  );
}
