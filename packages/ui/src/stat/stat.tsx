// Server-safe. A key figure: a label, the value in tabular digits, a hint, a trend. Every word is a prop.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const stat = tv({
  slots: {
    root: "flex min-w-0 flex-col gap-1",
    label: "text-xs font-semibold uppercase tracking-wider text-fg-secondary",
    value: "font-display text-2xl font-black tabular-nums text-fg",
    meta: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
    // The status tokens are too light for small text on a light surface: the words stay a text role, the arrow carries
    // the direction's colour.
    trend: "inline-flex items-center gap-1 font-semibold text-fg [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0",
    hint: "text-fg-secondary",
  },
  variants: {
    trend: {
      up: { trend: "[&>svg]:text-success" },
      down: { trend: "[&>svg]:text-danger" },
      flat: { trend: "[&>svg]:text-fg-secondary" },
    },
  },
});

export type StatTrend = "up" | "down" | "flat";

const ARROW: Record<StatTrend, string> = { up: "M7 17 17 7M8 7h9v9", down: "M7 7l10 10M17 8v9H8", flat: "M5 12h14M13 6l6 6-6 6" };

export type StatProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** What the figure is ("Revenue"), above it. */
  label: React.ReactNode;
  /** The figure, formatted by the app, in tabular digits. */
  value: React.ReactNode;
  /** A line under the value: the period, the comparison. */
  hint?: React.ReactNode;
  /** The direction of the change; its arrow is decorative. */
  trend?: StatTrend;
  /** The change, in words, as read and shown (e.g. "+12 % vs last week") — the arrow alone says nothing. */
  trendLabel?: React.ReactNode;
};

export function Stat({ label, value, hint, trend, trendLabel, className, ...props }: StatProps) {
  const s = stat({ trend });
  return (
    <div data-trend={trend} className={s.root({ className })} {...props}>
      <p className={s.label()}>{label}</p>
      <p className={s.value()}>{value}</p>
      {(trendLabel || hint) && (
        <p className={s.meta()}>
          {trend && trendLabel && (
            <span className={s.trend()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={ARROW[trend]} />
              </svg>
              {trendLabel}
            </span>
          )}
          {hint && <span className={s.hint()}>{hint}</span>}
        </p>
      )}
    </div>
  );
}
