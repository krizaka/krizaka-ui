// Server-safe. The decisions behind a product, numbered (blocks.css): what was chosen, large, first; then side by side
// what was refused, why, and what it costs the reader — each with its mark (✓ ✕ → !) and its colour, so the eye
// compares decisions at a glance. Every word arrives as a prop.
import type * as React from "react";

import { cn } from "../cn";
import { ArrowGlyph, CheckGlyph, CloseGlyph, WarningGlyph } from "../glyphs";

export interface Decision {
  /** A stable key (the decision's id); the `chose` text otherwise. */
  id?: string;
  /** What was chosen. */
  chose: React.ReactNode;
  /** What was refused. */
  refused: React.ReactNode;
  /** Why. */
  because: React.ReactNode;
  /** What it costs the reader — said honestly. */
  cost: React.ReactNode;
}

export type DecisionListProps = React.HTMLAttributes<HTMLOListElement> & {
  /** The decisions, in order. */
  decisions: readonly Decision[];
  /** The four labels: `{ chose: "We chose", refused: "We refused", because: "Because", cost: "What it costs you" }`. */
  labels: { chose: React.ReactNode; refused: React.ReactNode; because: React.ReactNode; cost: React.ReactNode };
  /**
   * Each decision rises once into place, staggered (`[data-reveal]`).
   * @default true
   */
  reveal?: boolean;
};

const ICON = "h-3.5 w-3.5";

/** Numbered decisions: chose, then refused · because · what it costs, side by side. */
export function DecisionList({ decisions, labels, reveal = true, className, ...props }: DecisionListProps) {
  return (
    <ol className={cn("kz-decisions", className)} {...props}>
      {decisions.map((d, i) => (
        <li
          key={d.id ?? (typeof d.chose === "string" ? d.chose : i)}
          className="kz-decision"
          data-reveal={reveal ? "soft" : undefined}
          style={reveal && i ? ({ "--kz-delay": `${Math.min(i, 5) * 70}ms` } as React.CSSProperties) : undefined}
        >
          <span className="kz-decision-n" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="kz-decision-body">
            <div className="kz-decision-part" data-part="chose">
              <p className="kz-label">
                <CheckGlyph className={ICON} /> {labels.chose}
              </p>
              <p>{d.chose}</p>
            </div>
            <div className="kz-decision-grid">
              <div className="kz-decision-part" data-part="refused">
                <p className="kz-label">
                  <CloseGlyph className={ICON} /> {labels.refused}
                </p>
                <p>{d.refused}</p>
              </div>
              <div className="kz-decision-part" data-part="because">
                <p className="kz-label">
                  <ArrowGlyph className={ICON} /> {labels.because}
                </p>
                <p>{d.because}</p>
              </div>
              <div className="kz-decision-part" data-part="cost">
                <p className="kz-label">
                  <WarningGlyph className={ICON} /> {labels.cost}
                </p>
                <p>{d.cost}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
