// Server-safe. The anatomy plate of the Cahier (ADR-004, blocks.css): a component drawn large in the middle of a plate,
// its parts numbered and named on both sides, a hairline leading from each note to the specimen — the way a field guide
// shows a bird's anatomy. The notes are real text in an ordered list: the plate is its own text version, and on a phone
// it stacks (the specimen, then the list).
import type * as React from "react";

import { cn } from "../cn";
import { warnDeprecated } from "../deprecated";

export interface AnatomyPart {
  /** The part's name: `the cut`. */
  label: React.ReactNode;
  /** Why it is there, in one sentence: `45°, the Krizaka chamfer; it points where the action goes.` */
  note: React.ReactNode;
  /** The side of the plate it is written on. @default alternates, left first */
  side?: "left" | "right";
}

export type AnatomyPlateProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** The plate's title: `Anatomy`. */
  title?: React.ReactNode;
  /** One line under the title, or the scale: `to scale × 1.9`. */
  subtitle?: React.ReactNode;
  /** The parts, numbered in this order. */
  parts: readonly AnatomyPart[];
  /** The specimen: the live component, drawn large. */
  children: React.ReactNode;
  /** The specimen's scale on a wide screen (it is drawn at 1 on a phone). @default 1.6 */
  scale?: number;
};

/**
 * A component's anatomy as a naturalist's plate: the specimen in the middle, its numbered parts and their reasons around it.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function AnatomyPlate({ title, subtitle, parts, children, scale = 1.6, className, style, ...props }: AnatomyPlateProps) {
  warnDeprecated("anatomy-plate");
  const numbered = parts.map((p, i) => ({ ...p, n: i + 1, side: p.side ?? (i % 2 === 0 ? "left" : "right") }));
  const column = (side: "left" | "right") => (
    <ol className="kz-anatomy-parts" data-side={side}>
      {numbered
        .filter((p) => p.side === side)
        .map((p) => (
          <li key={p.n} value={p.n} className="kz-anatomy-part">
            <span className="kz-anatomy-n" aria-hidden>
              {p.n}
            </span>
            <span className="kz-anatomy-text">
              <b>{p.label}</b> {p.note}
            </span>
          </li>
        ))}
    </ol>
  );
  return (
    <figure className={cn("kz-anatomy", className)} style={{ ["--kz-anatomy-scale" as string]: scale, ...style }} {...props}>
      {(title || subtitle) && (
        <figcaption className="kz-anatomy-head">
          {title && <span className="kz-plate-title">{title}</span>}
          {subtitle && <span className="kz-plate-sub">{subtitle}</span>}
        </figcaption>
      )}
      <div className="kz-anatomy-stage">
        {column("left")}
        <div className="kz-anatomy-specimen">
          <div className="kz-anatomy-scale">{children}</div>
        </div>
        {column("right")}
      </div>
    </figure>
  );
}
