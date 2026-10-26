// Server-safe. A goal counted in steps (story.css): 6 of 10 backers, 3 of 5 dares done, 8 problems out of the way. A
// `meter` with its value in words; in a `Scene` of a `ScrollStage` the segments light (or drain) one by one, once.
import type * as React from "react";

import { cn } from "../cn";
import { brandClass, type StoryVariant, storyVariantClass } from "../story-variant";

export type GoalGaugeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What the gauge counts (“Backers”, “Dares completed”) — passed translated; the meter's accessible name. */
  label: string;
  /** The number of steps of the goal (2–24). */
  segments: number;
  /**
   * The steps reached (lit), from 0 to `segments`.
   * @default segments
   */
  value?: number;
  /** The value in words (“6 of 10”, “€420 raised”); default `value / segments`. */
  valueText?: string;
  /**
   * How the scene plays it: `fill` lights the reached steps one by one; `drain` empties the spent ones (a countdown of
   * what is left: tickets, lives, problems still standing).
   * @default "fill"
   */
  mode?: "fill" | "drain";
  /**
   * Shows the label and the value above the segments.
   * @default true
   */
  showLabel?: boolean;
  /**
   * `default`: rounded segments. `arcade`: the boss gauge — a skewed frame, gradient cells, a centred mono label.
   * @default "default"
   */
  variant?: StoryVariant;
  /** A brand scope (`orazaka` → `.brand-orazaka`). */
  brand?: string;
};

/** A goal in steps: `role="meter"`, the reached steps lit, the value in words beside the label. */
export function GoalGauge({ label, segments, value, valueText, mode = "fill", showLabel = true, variant, brand, className, style, ...props }: GoalGaugeProps) {
  const total = Math.max(1, Math.round(segments));
  const lit = Math.min(total, Math.max(0, Math.round(value ?? total)));
  const words = valueText ?? `${lit} / ${total}`;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={lit}
      aria-valuetext={words}
      data-mode={mode}
      className={cn("kzs-gauge", storyVariantClass(variant), brandClass(brand), className)}
      style={{ "--kzs-segments": total, ...style } as React.CSSProperties}
      {...props}
    >
      {showLabel && (
        <div className="kzs-gauge-head" aria-hidden>
          <span className="kzs-gauge-label">{label}</span>
          <span className="kzs-gauge-value">{words}</span>
        </div>
      )}
      <div className="kzs-gauge-cells" aria-hidden>
        {Array.from({ length: total }, (_, i) => {
          const on = i < lit;
          const animate = mode === "fill" ? on : !on;
          const order = mode === "fill" ? i : i - lit;
          return (
            <span
              key={i}
              className="kzs-gauge-cell"
              data-lit={on ? "" : undefined}
              data-animate={animate ? "" : undefined}
              style={animate ? ({ "--i": order } as React.CSSProperties) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
