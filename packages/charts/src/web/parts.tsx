// The small pieces every chart shares: a series' colour, the legend and the tooltip (the surface of @krizaka/ui's
// floating elements: raised surface, border, large shadow; text in the text roles, the colour on a key beside it).
import type { ReactNode } from "react";

import type { SeriesColor, Tone } from "../core/types";

/** Joins class names, skipping the empty ones. */
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

const TONES: Record<Tone, string> = {
  neutral: "var(--kz-text-secondary)",
  accent: "var(--kz-accent)",
  success: "var(--kz-success)",
  warning: "var(--kz-warning)",
  danger: "var(--kz-danger)",
  info: "var(--kz-info)",
};

/** The CSS colour of a series: its own (`color`), else its palette slot, `var(--kzc-<slot>)`. */
export function colorOf(color: SeriesColor | undefined, slot: number): string {
  if (color === undefined) return `var(--kzc-${((slot - 1) % 8) + 1})`;
  if (typeof color === "number") return `var(--kzc-${color})`;
  if (color in TONES) return TONES[color as Tone];
  return color;
}

export interface LegendItem {
  readonly label: string;
  readonly color: string;
  readonly shape?: "square" | "line";
  readonly dashed?: boolean;
}

/** The legend: a key in the series' colour beside its name in the text colour. Shown from two series. */
export function Legend({ items }: { items: readonly LegendItem[] }) {
  if (items.length < 2) return null;
  return (
    <ul className="kzc-legend" aria-hidden>
      {items.map((item) => (
        <li key={item.label}>
          <span
            className="kzc-key"
            data-shape={item.shape}
            style={{ background: item.dashed ? `repeating-linear-gradient(90deg, ${item.color} 0 4px, transparent 4px 7px)` : item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export interface TooltipRow {
  readonly label: string;
  readonly value: string;
  readonly color?: string;
  readonly shape?: "square" | "line";
}

export interface TooltipProps {
  /** Where the pointer or the active point is, in the plot's pixels. */
  readonly x: number;
  readonly y: number;
  /** The plot's width: the tooltip flips to the left of the point past the middle. */
  readonly width: number;
  readonly title?: string;
  readonly rows: readonly TooltipRow[];
  readonly note?: ReactNode;
}

/** The rich tooltip: a title (the category), one row per series (key, name, value), an optional note. */
export function Tooltip({ x, y, width, title, rows, note }: TooltipProps) {
  const flip = x > width / 2;
  return (
    <div className="kzc-tip" aria-hidden style={{ left: flip ? x - 12 : x + 12, top: Math.max(0, y - 12), transform: flip ? "translateX(-100%)" : undefined }}>
      {title && <p className="kzc-tip-title">{title}</p>}
      {rows.map((row, i) => (
        <p key={i} className="kzc-tip-row">
          {row.color ? <span className="kzc-key" data-shape={row.shape} style={{ background: row.color }} /> : <span />}
          <span>{row.label}</span>
          <b>{row.value}</b>
        </p>
      ))}
      {note && <p className="kzc-tip-note">{note}</p>}
    </div>
  );
}

/**
 * The colour of step `i` of `n` of a sequential scale: the brand hue (slot 1) mixed into the surface in OKLab, from
 * 22 % (still distinct from the surface) to 100 % — the same steps as `sequential()` for the canvas engine.
 */
export const stepColor = (i: number, n: number) => `color-mix(in oklab, var(--kzc-1) ${Math.round(22 + (78 * i) / Math.max(1, n - 1))}%, var(--kz-surface-1))`;

/** The legend of a sequential scale: its lowest value, the steps from near the surface to the full hue, its highest. */
export function RampLegend({ min, max, steps, write }: { min: number; max: number; steps: number; write: (v: number) => string }) {
  return (
    <div className="kzc-legend" aria-hidden>
      <span>{write(min)}</span>
      <span style={{ display: "inline-flex", gap: 2 }}>
        {Array.from({ length: steps }, (_, i) => (
          <span key={i} className="kzc-key" style={{ background: stepColor(i, steps), width: 14 }} />
        ))}
      </span>
      <span>{write(max)}</span>
    </div>
  );
}
