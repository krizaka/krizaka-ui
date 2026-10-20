// Server-safe. The head of a multi-step flow: back, segments that fill, the position in words — a `progressbar`.
import type * as React from "react";

export type StepProgressProps = {
  /** The current step, from 1. */
  step: number;
  /** How many steps. */
  total: number;
  /** The position in words: `(n, total) => "Step " + n + " of " + total` — passed translated. */
  label: (step: number, total: number) => string;
  /** The back link or button (a `Button`), at the left. */
  back?: React.ReactNode;
  /** At the right: a Skip link. */
  trailing?: React.ReactNode;
  /** Classes merged on the root. */
  className?: string;
};

/** The head of a sign-up or a profile to fill: back, segments that fill, the position in words. */
export function StepProgress({ step, total, label, back, trailing, className }: StepProgressProps) {
  const words = label(step, total);
  return (
    <div className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}>
      <div className="flex items-center gap-3">
        <div className="flex min-w-10 justify-start">{back}</div>
        <div role="progressbar" aria-label={words} aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-valuetext={words} className="flex flex-1 gap-1">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={["h-1 flex-1 rounded-sm transition-colors motion-reduce:transition-none", i < step ? "bg-accent" : "bg-surface-3"].join(" ")} />
          ))}
        </div>
        <div className="flex min-w-10 justify-end">{trailing}</div>
      </div>
      <p className="m-0 text-center text-xs text-fg-secondary" aria-hidden>
        {words}
      </p>
    </div>
  );
}
