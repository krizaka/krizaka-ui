// Server-safe (no state). A fair "versus" block: one grid where every row lines up across the columns, the column you
// argue for drawn AS a column of the grid (a tinted band with the brand's light, its header part of the band), a small icon per question, each answer as its key phrase in bold then its detail. The other columns stay
// neutral — never crossed out. Below `md` each question is a card: the question, then the answers stacked, the
// highlighted one tinted. Rows arrive one after the other (`[data-reveal]`, staggered) when a MotionObserver runs.
import * as React from "react";

import { cn } from "../cn";

export interface ComparisonColumn {
  /** A stable id: the key of the rows' `answers`. */
  id: string;
  /** The column's name (“A cloud assistant”), passed translated. */
  label: string;
  /** A small icon beside the name. */
  icon?: React.ReactNode;
}

export interface ComparisonAnswer {
  /** The key phrase, in bold (“On your machines.”). */
  key: string;
  /** The detail after it (“A cloud model only if you connect one.”). */
  detail?: string;
}

export interface ComparisonRow {
  /** A stable key. */
  id: string;
  /** The question (“Where do your prompts go?”). */
  topic: string;
  /** A small icon for the question. */
  icon?: React.ReactNode;
  /** One answer per column id. */
  answers: Readonly<Record<string, ComparisonAnswer>>;
}

export interface ComparisonTableProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The table's accessible name (the section's title), passed translated. */
  label: string;
  /** The first column's header (“Question”). */
  topicLabel: string;
  /** The answer columns, in order. */
  columns: readonly ComparisonColumn[];
  /** The column drawn as the highlighted band (yours). */
  highlight: string;
  /** The questions, in order (three to six). */
  rows: readonly ComparisonRow[];
  /** Stagger the rows' entrance with `[data-reveal]` (needs MotionObserver). @default true */
  reveal?: boolean;
}

function Answer({ answer }: { answer?: ComparisonAnswer }) {
  if (!answer) return null;
  return (
    <>
      <strong className="font-semibold text-fg">{answer.key}</strong>
      {answer.detail && <span className="text-fg-secondary"> {answer.detail}</span>}
    </>
  );
}

/** The rows' stagger: 70 ms apart, through the motion system's `--kz-delay` (reduced motion: no movement at all). */
const stagger = (i: number): React.CSSProperties => ({ "--kz-delay": `${i * 70}ms` }) as React.CSSProperties;

/** A comparison where your column is a highlighted band of the same grid — aligned rows, fair neutral answers, cards on a phone. */
export function ComparisonTable({ label, topicLabel, columns, highlight, rows, reveal = true, className, ...props }: ComparisonTableProps) {
  const at = Math.max(columns.findIndex((c) => c.id === highlight), 0);
  const grid = { gridTemplateColumns: `minmax(10rem, 0.9fr) repeat(${columns.length}, minmax(0, 1fr))` };
  const band = (i: number) => i === at;
  return (
    <div data-kz-comparison className={cn("w-full", className)} {...props}>
      {/* Wide: one grid, the band is a grid item spanning every row of its column — the rows cannot drift. */}
      <div role="table" aria-label={label} className="relative hidden md:grid" style={grid}>
        <div
          aria-hidden
          data-band
          className="pointer-events-none rounded-2xl border border-accent/35 bg-accent-soft shadow-[0_0_48px_-16px_var(--kz-accent)]"
          style={{ gridColumn: at + 2, gridRow: `1 / span ${rows.length + 1}` }}
        />
        <div role="row" className="contents">
          <span role="columnheader" className="row-start-1 self-end px-4 pb-4 pt-5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary" style={{ gridColumn: 1 }}>
            {topicLabel}
          </span>
          {columns.map((c, i) => (
            <span
              key={c.id}
              role="columnheader"
              data-highlight={band(i) ? "" : undefined}
              className={cn("row-start-1 flex items-center gap-2 self-stretch px-5 pb-4 pt-5 text-sm font-semibold", band(i) ? "text-fg [&_svg]:text-fg-accent" : "text-fg-secondary")}
              style={{ gridColumn: i + 2 }}
            >
              {c.icon}
              {c.label}
            </span>
          ))}
        </div>
        {rows.map((row, r) => (
          <div key={row.id} role="row" className="contents">
            <span role="rowheader" data-reveal={reveal ? "soft" : undefined} style={{ ...stagger(r), gridColumn: 1, gridRow: r + 2 }} className="flex items-start gap-3 border-t border-border-subtle px-4 py-5 text-base font-semibold text-fg">
              {row.icon && <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-2 text-fg-accent [&>svg]:h-4 [&>svg]:w-4">{row.icon}</span>}
              {row.topic}
            </span>
            {columns.map((c, i) => (
              <span
                key={c.id}
                role="cell"
                data-reveal={reveal ? "soft" : undefined}
                style={{ ...stagger(r), gridColumn: i + 2, gridRow: r + 2 }}
                className={cn("border-t px-5 py-5 text-sm leading-relaxed", band(i) ? "border-accent/20" : "border-border-subtle")}
              >
                <Answer answer={row.answers[c.id]} />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Phone: one card per question, the answers stacked, the highlighted one tinted. */}
      <ul aria-label={label} className="grid gap-4 md:hidden">
        {rows.map((row, r) => (
          <li key={row.id} data-reveal={reveal ? "soft" : undefined} style={stagger(r)} className="rounded-2xl border border-border-subtle bg-surface-1/80 p-4">
            <p className="flex items-center gap-3 text-base font-semibold text-fg">
              {row.icon && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-2 text-fg-accent [&>svg]:h-4 [&>svg]:w-4">{row.icon}</span>}
              {row.topic}
            </p>
            <dl className="mt-3 grid gap-2">
              {columns.map((c, i) => (
                <div key={c.id} data-highlight={band(i) ? "" : undefined} className={cn("rounded-xl p-3 text-sm leading-relaxed", band(i) ? "border border-accent/35 bg-accent-soft" : "bg-surface-2/60")}>
                  <dt className={cn("mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em]", band(i) ? "text-fg-accent" : "text-fg-secondary")}>
                    {c.label}
                  </dt>
                  <dd>
                    <Answer answer={row.answers[c.id]} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
