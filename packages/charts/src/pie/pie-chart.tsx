"use client";
// Part of a whole: a pie, or a donut with the total in its hole. Plain SVG. The slices are sorted largest first and
// folded into “Other” past `maxSlices` (a ninth hue is never invented); a 2 px surface gap separates them; the legend
// carries each part's value and share, so the colour is never the only way to read it.
import { type KeyboardEvent, useMemo, useState } from "react";

import { read } from "../core/data";
import { describeParts } from "../core/describe";
import { shareFormatter, valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import { arcPath, polar } from "../core/shape";
import type { Accessor, Datum, SeriesColor, ValueFormat } from "../core/types";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { colorOf, Legend, Tooltip, useToggles } from "../web/parts";

export interface PieChartProps<T extends Datum> extends ChartFrameProps {
  /** One row per part. */
  data: readonly T[];
  /** The field (or function) naming the part. */
  label: Accessor<T, string>;
  /** The field (or function) of its amount (≥ 0). */
  value: Accessor<T, number>;
  /** A part's own colour (a slot, a tone or a CSS colour); default: the palette in order of size. */
  color?: Accessor<T, SeriesColor | undefined>;
  /** How the amounts are written. */
  format?: ValueFormat;
  /** A ring rather than a pie: the total (or `centerValue`) is written in its hole. */
  donut?: boolean;
  /** The words under the number in the hole of a donut (“Total credits”). */
  centerLabel?: string;
  /** The number in the hole, written already. Default: the total. */
  centerValue?: string;
  /** At most this many slices; the rest fold into one, named `otherLabel`. Default 6. */
  maxSlices?: number;
  /** The name of the folded slice. Default “Other”. */
  otherLabel?: string;
  /** Called with the row when a slice is clicked (or Enter is pressed on it). */
  onSelect?: (datum: T, index: number) => void;
  /** The header of the parts in the data table. */
  labelHeader?: string;
  /** The header of the amounts in the data table. */
  valueHeader?: string;
}

interface Slice<T> {
  readonly label: string;
  readonly value: number;
  readonly color: string;
  readonly datum?: T;
  readonly index: number;
}

export function PieChart<T extends Datum>(props: PieChartProps<T>) {
  const { data, label, value, color, format, donut = false, centerLabel, centerValue, maxSlices = 6, otherLabel = "Other", onSelect, labelHeader, valueHeader } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), share: shareFormatter(locale) }), [format, locale, labels.noValue]);

  const allSlices = useMemo<Slice<T>[]>(() => {
    const rows = data
      .map((datum, index) => ({ datum, index, label: read(label, datum, index), value: Math.max(0, Number(read(value, datum, index)) || 0) }))
      .sort((a, b) => b.value - a.value);
    const kept = rows.length > maxSlices ? rows.slice(0, maxSlices - 1) : rows;
    const out: Slice<T>[] = kept.map((row, i) => ({ ...row, color: colorOf(color ? read(color, row.datum, row.index) : undefined, i + 1) }));
    if (rows.length > maxSlices) {
      const rest = rows.slice(maxSlices - 1).reduce((sum, row) => sum + row.value, 0);
      out.push({ label: otherLabel, value: rest, color: "var(--kz-text-muted)", index: -1 });
    }
    return out;
  }, [data, label, value, color, maxSlices, otherLabel]);

  const { off, toggle } = useToggles();
  const allTotal = allSlices.reduce((sum, s) => sum + s.value, 0);
  // What is drawn: the parts that are on. The summary and the table keep them all.
  const slices = useMemo(() => allSlices.filter((s) => !off.has(s.label)), [allSlices, off]);
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const isEmpty = allTotal <= 0;
  const kind = donut ? "donut" : "pie";
  const summary = useMemo(() => (isEmpty ? labels.empty : describeParts(kind, allSlices, { labels, value: fmt.value, share: fmt.share })), [isEmpty, kind, allSlices, labels, fmt]);
  const table = useMemo(
    () => ({
      columns: [labelHeader ?? labels.category, valueHeader ?? labels.value, "%"],
      rows: [...allSlices.map((s) => [s.label, fmt.value(s.value), fmt.share(allTotal ? s.value / allTotal : 0)]), [labels.total, fmt.value(allTotal), fmt.share(1)]],
    }),
    [allSlices, fmt, allTotal, labels, labelHeader, valueHeader],
  );

  const [active, setActive] = useState<number | null>(null);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const n = slices.length;
    const moves: Record<string, () => number | null> = {
      ArrowRight: () => ((active ?? -1) + 1) % n,
      ArrowDown: () => ((active ?? -1) + 1) % n,
      ArrowLeft: () => ((active ?? 0) - 1 + n) % n,
      ArrowUp: () => ((active ?? 0) - 1 + n) % n,
      Home: () => 0,
      End: () => n - 1,
      Escape: () => null,
    };
    if (event.key === "Enter" && active !== null && onSelect) {
      const slice = slices[active]!;
      if (slice.datum) onSelect(slice.datum, slice.index);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setActive(move());
  };
  const say = (s: Slice<T>) => `${s.label}: ${fmt.value(s.value)} (${fmt.share(total ? s.value / total : 0)})`;

  const legend = (
    <Legend
      always
      items={allSlices.map((s) => ({ label: s.label, color: s.color, detail: `${fmt.value(s.value)} · ${fmt.share(allTotal ? s.value / allTotal : 0)}` }))}
      off={off}
      onToggle={allSlices.length > 1 ? (label) => { setActive(null); toggle(label); } : undefined}
      toggleName={(label) => fill(labels.toggleSeries, { label })}
    />
  );

  return (
    <ChartFrame
      kind={kind}
      frame={props}
      defaultHeight={240}
      table={table}
      summary={summary}
      isEmpty={isEmpty}
      legend={isEmpty ? null : legend}
      announcement={active === null ? "" : say(slices[active]!)}
      active={active !== null}
      handlers={{ onKeyDown, onBlur: () => setActive(null), onPointerLeave: () => setActive(null) }}
    >
      {(width, height) => {
        const radius = Math.max(10, Math.min(width, height) / 2 - 6);
        const inner = donut ? radius * 0.64 : 0;
        const cx = width / 2;
        const cy = height / 2;
        let angle = 0;
        const arcs = slices.map((s, i) => {
          const sweep = total ? (s.value / total) * Math.PI * 2 : 0;
          const start = angle;
          angle += sweep;
          return { s, i, start, end: angle };
        });
        const current = active !== null ? arcs[active] : null;
        const mid = current ? (current.start + current.end) / 2 : 0;
        const [tx, ty] = current ? polar(cx, cy, (radius + inner) / 2 + (donut ? 0 : radius * 0.2), mid) : [0, 0];
        return (
          <>
            <svg className="kzc-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
              <g className="kzc-enter-pop">
                {arcs.map(({ s, i, start, end }) => {
                  const lift = active === i ? 4 : 0;
                  const [dx, dy] = lift ? polar(0, 0, lift, (start + end) / 2) : [0, 0];
                  return (
                    <path
                      key={s.label}
                      d={arcPath(cx + dx, cy + dy, inner, radius, start, end)}
                      className="kzc-mark"
                      data-dim={active !== null && active !== i ? "" : undefined}
                      style={{ fill: s.color, stroke: "var(--kzc-surface)", strokeWidth: slices.length > 1 ? 2 : 0, strokeLinejoin: "round", cursor: onSelect ? "pointer" : undefined }}
                      onPointerEnter={() => setActive(i)}
                      onClick={onSelect && s.datum ? () => onSelect(s.datum!, s.index) : undefined}
                    />
                  );
                })}
              </g>
              {donut && (
                <g className="kzc-enter-fade">
                  <text x={cx} y={cy - (centerLabel ? 6 : 0)} textAnchor="middle" dominantBaseline="central" className="kzc-strong" style={{ fontSize: Math.max(14, Math.min(26, inner / 3)) }}>
                    {centerValue ?? fmt.value(total)}
                  </text>
                  {centerLabel && (
                    <text x={cx} y={cy + Math.max(12, Math.min(20, inner / 4))} textAnchor="middle" dominantBaseline="central">
                      {centerLabel}
                    </text>
                  )}
                </g>
              )}
            </svg>
            {current && <Tooltip x={tx} y={ty} width={width} title={current.s.label} rows={[{ label: fmt.share(total ? current.s.value / total : 0), value: fmt.value(current.s.value), color: current.s.color }]} />}
          </>
        );
      }}
    </ChartFrame>
  );
}

/** A pie with a hole: the total (or `centerValue`) and `centerLabel` in it. */
export function DonutChart<T extends Datum>(props: Omit<PieChartProps<T>, "donut">) {
  return <PieChart {...props} donut />;
}
