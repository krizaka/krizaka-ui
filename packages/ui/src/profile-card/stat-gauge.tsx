// Server-safe. One measured strength: a label, its figure, a bar (story.css) — the gauge of a ProfileCard, also usable
// alone (in a ChoiceGrid tile, a list). A `meter` with its value in words.
import type * as React from "react";

import { cn } from "../cn";

export type StatGaugeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What it measures (“Profile complete”, “Creator share”) — passed translated; the meter's accessible name. */
  label: string;
  /**
   * The value, between 0 and `max`.
   * @default 100
   */
  value?: number;
  /**
   * The top of the range.
   * @default 100
   */
  max?: number;
  /** The value in words (“12 of 15”); default: the percentage. Read by assistive technology, shown without `figure`. */
  valueText?: string;
  /** What shows as the figure instead of `valueText`: a `NumberTicker` that climbs, a formatted amount. Decorative. */
  figure?: React.ReactNode;
  /**
   * Hides the label and the figure (the bar alone, named for assistive technology).
   * @default false
   */
  hideLabel?: boolean;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** A measured strength: label, figure and bar; `role="meter"` with `aria-valuetext`. */
export function StatGauge({ label, value = 100, max = 100, valueText, figure, hideLabel, className, style, ...props }: StatGaugeProps) {
  const ratio = clamp(value / (max || 1));
  const words = valueText ?? `${Math.round(ratio * 100)} %`;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuetext={words}
      className={cn("kzs-stat", className)}
      style={{ "--kzs-ratio": ratio, ...style } as React.CSSProperties}
      {...props}
    >
      {!hideLabel && (
        <span className="kzs-stat-head" aria-hidden>
          <span className="kzs-stat-label">{label}</span>
          <span className="kzs-stat-value">{figure ?? words}</span>
        </span>
      )}
      <span className="kzs-bar" aria-hidden>
        <span className="kzs-bar-fill" />
      </span>
    </div>
  );
}
