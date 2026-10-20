// Client (each bird has an id per instance). The bird plate of the Cahier (ADR-004, blocks.css): the flock drawn as a
// naturalist's plate — each bird a figure, numbered, a hairline leading from the drawing to its caption, and the
// caption is the bird's promise as the film says it. The birds are the `Mascot` renders, never redrawn; one bird per
// subject (the brand reference, §5).
import type * as React from "react";

import { cn } from "../cn";
import { type MascotBird, type MascotMood, type MascotTone } from "../mascots/geometry";
import { Mascot } from "../mascots/mascot";

export interface PlateFigure {
  /** The bird. */
  bird: MascotBird;
  /** Its mood. @default "welcome" */
  mood?: MascotMood;
  /** `own` — the bird's signature colours (the film's); `brand` — the host's accent. @default "own" */
  tone?: MascotTone;
  /** Its name in the caption: `the falcon`. */
  label: React.ReactNode;
  /** Its promise, word for word as the film says it: `keeps watch: security comes first.` */
  promise?: React.ReactNode;
}

export type BirdPlateProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The plate's title: `Plate I · The flock`. */
  title?: React.ReactNode;
  /** One line under the title. */
  subtitle?: React.ReactNode;
  /** The figures, in order: each is numbered `fig. n`. */
  figures: readonly PlateFigure[];
  /** The first figure's number (a page that continues a plate). @default 1 */
  start?: number;
  /** The word before the number. @default "fig." */
  figureLabel?: string;
  /**
   * `grid` — the figures side by side (two to five); `single` — one large figure, its caption beside it.
   * @default "grid"
   */
  layout?: "grid" | "single";
  /** The birds' idle loops (they pause off screen and stop under reduced motion). @default false */
  animated?: boolean;
};

/** A naturalist's plate of the flock: numbered figures, a leader line from each bird to its caption, its promise. */
export function BirdPlate({ title, subtitle, figures, start = 1, figureLabel = "fig.", layout = "grid", animated = false, className, ...props }: BirdPlateProps) {
  const single = layout === "single";
  return (
    <figure className={cn("kz-plate", className)} data-layout={single ? "single" : undefined} {...props}>
      {(title || subtitle) && (
        <figcaption className="kz-plate-head">
          {title && <span className="kz-plate-title">{title}</span>}
          {subtitle && <span className="kz-plate-sub">{subtitle}</span>}
        </figcaption>
      )}
      <ol className="kz-plate-figures" start={start}>
        {figures.map((f, i) => (
          <li key={i} className="kz-plate-figure">
            <Mascot bird={f.bird} mood={f.mood ?? "welcome"} tone={f.tone ?? "own"} size={single ? 168 : 112} animated={animated} className="kz-plate-bird" aria-hidden />
            <p className="kz-plate-caption">
              <b>
                {figureLabel} {start + i} — {f.label}
              </b>
              {f.promise && <span> {f.promise}</span>}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
