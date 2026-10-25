// Server-safe. A key figure: a label, the value in tabular digits, a hint, a trend. Every word is a prop.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const stat = tv({
  slots: {
    root: "flex min-w-0 flex-col gap-1",
    label: "text-xs font-semibold text-fg-secondary",
    value: "kz-stat-value font-display text-2xl font-black tabular-nums text-fg",
    meta: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
    // The status tokens are too light for small text on a light surface: the words stay a text role, the arrow carries
    // the direction's colour.
    trend: "inline-flex items-center gap-1 font-semibold text-fg [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0",
    hint: "text-fg-secondary",
    chart: "mt-2 h-10 w-full min-w-0",
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
  /** Under the figure: a `Sparkline` of @krizaka/charts (its own accessible summary), a `Meter`. */
  chart?: React.ReactNode;
};

export function Stat({ label, value, hint, trend, trendLabel, chart, className, ...props }: StatProps) {
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
      {chart ? <div className={s.chart()}>{chart}</div> : null}
    </div>
  );
}

export const statGrid = tv({
  base: "grid w-full grid-cols-[repeat(auto-fit,minmax(var(--kz-stat-min,11rem),1fr))] overflow-hidden rounded-xl border border-border-default bg-surface-1",
  variants: {
    divided: {
      true: "gap-px bg-border-subtle [&>*]:bg-surface-1 [&>*]:p-5",
      false: "gap-6 p-5",
    },
  },
  defaultVariants: { divided: true },
});

export type StatGridProps = React.ComponentProps<"div"> & {
  /** Hairlines between the stats (default) or space only. */
  divided?: boolean;
  /** The narrowest a stat may be before the row wraps, in rem. Default 11. */
  minWidth?: number;
};

/** A row of key figures that wraps with the width: a dashboard's head. The stats are its children. */
export function StatGrid({ divided, minWidth = 11, className, style, ...props }: StatGridProps) {
  return <div className={statGrid({ divided, className })} style={{ ...style, ["--kz-stat-min" as string]: `${minWidth}rem` }} {...props} />;
}
