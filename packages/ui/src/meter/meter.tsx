// Server-safe. A measure within a known range — a quota, a balance, a share — as opposed to the progress of a task.
// `role="meter"`, its value in words; thresholds turn it to warning then danger (or the reverse when high is good);
// split into parts (90 % to the creator, 10 % to the platform) it becomes a stacked bar or ring with its legend: the
// text version of what it draws.
import type * as React from "react";
import { tv } from "tailwind-variants";

export const meter = tv({
  slots: {
    root: "flex w-full flex-col gap-1.5",
    header: "flex items-baseline gap-2 text-xs",
    caption: "min-w-0 flex-1 truncate font-medium text-fg",
    figure: "shrink-0 tabular-nums text-fg-secondary",
    track: "relative flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-surface-3",
    fill: "h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none",
    legend: "mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-secondary",
    swatch: "inline-block h-2 w-2 shrink-0 rounded-full",
    ring: "relative inline-flex shrink-0 items-center justify-center",
    center: "absolute inset-0 flex flex-col items-center justify-center text-center",
  },
  variants: {
    size: { sm: { track: "h-1.5", ring: "h-14 w-14" }, md: { ring: "h-24 w-24" }, lg: { track: "h-3", ring: "h-36 w-36" } },
  },
  defaultVariants: { size: "md" },
});

/** The colour of a fill: by tone (thresholds) or by part (the accent, a neutral, accent-2, a lighter neutral). */
const BG = { ok: "bg-accent", success: "bg-success", warning: "bg-warning", danger: "bg-danger" } as const;
const STROKE = { ok: "stroke-accent", success: "stroke-success", warning: "stroke-warning", danger: "stroke-danger" } as const;
const PART_BG = ["bg-accent", "bg-fg-secondary", "bg-accent-2", "bg-border-strong"];
const PART_STROKE = ["stroke-accent", "stroke-fg-secondary", "stroke-accent-2", "stroke-border-strong"];

export interface MeterPart {
  /** Its name (“To the creator”) — passed translated. */
  label: string;
  /** Its value, in the meter's unit. */
  value: number;
  /** Its value in words (“€9.00”), in the legend and for assistive technology; default: its percentage. */
  valueText?: string;
}

export type MeterProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The accessible name (“Storage”, “Split of a tip”) — passed translated; shown with `showLabel`. */
  label: string;
  /** The value, between `min` and `max` (ignored with `parts`). */
  value?: number;
  /**
   * The bottom of the range.
   * @default 0
   */
  min?: number;
  /**
   * The top of the range.
   * @default 100
   */
  max?: number;
  /** The value in words (“42 GB of 50 GB”) — passed translated; default: the percentage. */
  valueText?: string;
  /**
   * Ratios (0–1) where the tone changes: past `high` it is in danger, past `low` in warning — or the reverse with
   * `optimum="high"` (a balance: the lower, the worse). Without thresholds the fill is the brand accent.
   */
  thresholds?: { readonly low: number; readonly high: number };
  /**
   * Which end is good.
   * @default "low"
   */
  optimum?: "low" | "high";
  /** Split into parts that add up to `max`: a stacked bar or ring, with its legend. */
  parts?: readonly MeterPart[];
  /**
   * bar · ring.
   * @default "bar"
   */
  variant?: "bar" | "ring";
  /**
   * sm · md · lg: the bar's thickness, the ring's diameter.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Shows the label and the value above the bar. */
  showLabel?: boolean;
  /** A ring's centre: the value, a word. */
  children?: React.ReactNode;
};

/** A measure within a range — a quota, a balance, a share — toned by thresholds or split into parts. */
export function Meter({
  label,
  value = 0,
  min = 0,
  max = 100,
  valueText,
  thresholds,
  optimum = "low",
  parts,
  variant = "bar",
  size = "md",
  showLabel,
  className,
  children,
  ...props
}: MeterProps) {
  const s = meter({ size });
  const span = max - min || 1;
  const ratio = Math.min(1, Math.max(0, (value - min) / span));
  const level = !thresholds ? "ok" : ratio >= thresholds.high ? (optimum === "low" ? "danger" : "success") : ratio >= thresholds.low ? "warning" : optimum === "low" ? "success" : "danger";
  const words = valueText ?? `${Math.round(ratio * 100)} %`;
  const shares = (parts ?? []).map((p, i) => ({ ...p, i, ratio: Math.min(1, Math.max(0, p.value / span)), words: p.valueText ?? `${Math.round((p.value / span) * 100)} %` }));
  const a11y = parts
    ? { role: "group" as const, "aria-label": label }
    : { role: "meter" as const, "aria-label": label, "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": Math.min(max, Math.max(min, value)), "aria-valuetext": words };
  const legend = parts && (
    <ul className={s.legend()}>
      {shares.map((p) => (
        <li key={p.i} className="flex items-center gap-1.5">
          <span aria-hidden className={[s.swatch(), PART_BG[p.i % PART_BG.length]].join(" ")} />
          <span className="text-fg">{p.label}</span>
          <span className="tabular-nums">{p.words}</span>
        </li>
      ))}
    </ul>
  );

  if (variant === "ring") {
    const r = 44;
    let offset = 0;
    const arcs = parts
      ? shares.map((p) => {
          const arc = { cls: PART_STROKE[p.i % PART_STROKE.length]!, len: p.ratio * 100, start: offset };
          offset += arc.len;
          return arc;
        })
      : [{ cls: STROKE[level], len: ratio * 100, start: 0 }];
    return (
      <div {...a11y} data-level={parts ? undefined : level} className={["inline-flex flex-col items-center gap-2", className].filter(Boolean).join(" ")} {...props}>
        <div className={s.ring()}>
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-border-default" />
            {arcs.map((a, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                strokeWidth="9"
                pathLength={100}
                strokeDasharray={`${Math.max(0, a.len - (parts ? 1 : 0))} ${100 - Math.max(0, a.len - (parts ? 1 : 0))}`}
                strokeDashoffset={-a.start}
                className={[a.cls, "transition-[stroke-dasharray] duration-700 motion-reduce:transition-none"].join(" ")}
              />
            ))}
          </svg>
          {children !== undefined && <div className={s.center()}>{children}</div>}
        </div>
        {legend}
      </div>
    );
  }

  return (
    <div {...a11y} data-level={parts ? undefined : level} className={s.root({ className })} {...props}>
      {showLabel && (
        <div aria-hidden className={s.header()}>
          <span className={s.caption()}>{label}</span>
          {!parts && <span className={s.figure()}>{words}</span>}
        </div>
      )}
      <div aria-hidden className={s.track()}>
        {parts ? (
          shares.map((p) => <span key={p.i} className={[s.fill(), PART_BG[p.i % PART_BG.length]].join(" ")} style={{ width: `${p.ratio * 100}%` }} />)
        ) : (
          <span className={[s.fill(), BG[level]].join(" ")} style={{ width: `${ratio * 100}%` }} />
        )}
      </div>
      {legend}
    </div>
  );
}

export interface MeterValueProps {
  /** The figure. */
  value: React.ReactNode;
  /** A word under it. */
  caption?: React.ReactNode;
}

/** For the ring's centre when it shows a figure and a word. */
export function MeterValue({ value, caption }: MeterValueProps) {
  return (
    <>
      <span className="font-display text-lg font-semibold text-fg tabular-nums">{value}</span>
      {caption && <span className="text-[10px] text-fg-secondary">{caption}</span>}
    </>
  );
}
