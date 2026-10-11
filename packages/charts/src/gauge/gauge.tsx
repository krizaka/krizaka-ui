"use client";
// One value against its range: a 240° arc, the value written in the middle, an optional target tick and coloured
// zones (a quota that turns to warning, then danger). Plain SVG; exposed as a `meter` (value, range and its words).
import { useMemo } from "react";

import { valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import { polar, strokeArcPath } from "../core/shape";
import type { Threshold, Tone, ValueFormat } from "../core/types";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { colorOf } from "../web/parts";

export interface GaugeZone {
  /** The zone runs from the previous one's end (or `min`) to this value. */
  readonly to: number;
  readonly tone: Tone;
  /** Its name, in the summary and the table (“Over quota”). */
  readonly label?: string;
}

export interface GaugeProps extends Omit<ChartFrameProps, "dataTable" | "exportable"> {
  /** The value. */
/** The value. */
  value: number;
  /** The start of the range. Default 0. */
/** The start of the range. Default 0. */
  min?: number;
  /** The end of the range. Default 100. */
/** The end of the range. Default 100. */
  max?: number;
  /** How the value is written. */
/** How the value and the range are written. */
  format?: ValueFormat;
  /** The words under the value (“of 50 000 credits”). */
  caption?: string;
  /** A tick on the arc: the objective. */
  target?: Threshold;
  /** Coloured zones along the arc: the value takes the tone of the zone it is in. */
  zones?: readonly GaugeZone[];
  /** The tone of the value without zones. Default `"accent"`. */
/** The tone of the value without zones. Default `"accent"`. */
  tone?: Tone;
}

const START = (-120 * Math.PI) / 180;
const END = (120 * Math.PI) / 180;

/** One figure against its range — credits used of a plan, a challenge's progress, a load. */
export function Gauge(props: GaugeProps) {
  const { value, min = 0, max = 100, format, caption, target, zones = [], tone = "accent" } = props;
  const { locale, labels } = useSettings(props);
  const fmt = useMemo(() => valueFormatter(format, locale, labels.noValue), [format, locale, labels.noValue]);
  const clamped = Math.min(max, Math.max(min, value));
  const ratio = max > min ? (clamped - min) / (max - min) : 0;
  const zone = zones.find((z) => clamped <= z.to) ?? zones[zones.length - 1];
  const color = colorOf(zone?.tone ?? tone, 1);
  const text = fmt(value);
  const summary = [
    `${labels.kinds.gauge}: ${text} (${min === 0 ? "" : `${fmt(min)} – `}${fmt(max)})${zone?.label ? `, ${zone.label}` : ""}.`,
    target ? `${fill(labels.summaryThreshold, { label: target.label, value: fmt(target.value) })}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const table = { columns: [labels.category, labels.value], rows: [[props.title, text], ["min", fmt(min)], ["max", fmt(max)], ...(target ? [[target.label, fmt(target.value)]] : [])] };
  const at = (v: number) => START + ((Math.min(max, Math.max(min, v)) - min) / (max - min || 1)) * (END - START);

  return (
    <ChartFrame kind="gauge" frame={{ ...props, dataTable: false }} defaultHeight={180} table={table} summary={summary} isEmpty={false} navigable={false}>
      {(width, height) => {
        // The arc spans 240°: its lowest points sit at half the radius below the centre, the range labels under them.
        const radius = Math.max(20, Math.min(width / 2 - 12, (height - 30) / 1.58));
        const cx = width / 2;
        const cy = 8 + radius;
        const stroke = Math.max(8, radius * 0.16);
        let from = min;
        return (
          <div role="meter" aria-label={props.title} aria-valuemin={min} aria-valuemax={max} aria-valuenow={clamped} aria-valuetext={caption ? `${text} ${caption}` : text} style={{ height: "100%" }}>
            <svg className="kzc-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
              <path d={strokeArcPath(cx, cy, radius, START, END)} style={{ fill: "none", stroke: "var(--kz-surface-3)", strokeWidth: stroke, strokeLinecap: "round" }} />
              {zones.map((z, i) => {
                const d = strokeArcPath(cx, cy, radius + stroke / 2 + 4, at(from), at(z.to));
                from = z.to;
                return <path key={i} d={d} data-tone={z.tone} style={{ fill: "none", stroke: "var(--kzc-tone)", strokeWidth: 3, opacity: 0.7 }} />;
              })}
              {ratio > 0 && (
                <path d={strokeArcPath(cx, cy, radius, START, at(clamped))} pathLength={1} className="kzc-line kzc-enter-line" style={{ stroke: color, strokeWidth: stroke }} />
              )}
              {target && (
                <g data-tone={target.tone ?? "neutral"}>
                  <line
                    x1={polar(cx, cy, radius - stroke, at(target.value))[0]}
                    y1={polar(cx, cy, radius - stroke, at(target.value))[1]}
                    x2={polar(cx, cy, radius + stroke, at(target.value))[0]}
                    y2={polar(cx, cy, radius + stroke, at(target.value))[1]}
                    style={{ stroke: "var(--kzc-text)", strokeWidth: 2, strokeLinecap: "round" }}
                  />
                </g>
              )}
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="kzc-strong" style={{ fontSize: Math.max(12, Math.min(32, radius / 2.6, (radius * 1.45) / (text.length * 0.58))) }}>
                {text}
              </text>
              {caption && (
                <text x={cx} y={cy + Math.max(16, radius / 3.2)} textAnchor="middle" dominantBaseline="central">
                  {caption}
                </text>
              )}
              <text x={polar(cx, cy, radius, START)[0]} y={polar(cx, cy, radius, START)[1] + stroke + 6} textAnchor="middle">
                {fmt(min)}
              </text>
              <text x={polar(cx, cy, radius, END)[0]} y={polar(cx, cy, radius, END)[1] + stroke + 6} textAnchor="middle">
                {fmt(max)}
              </text>
            </svg>
          </div>
        );
      }}
    </ChartFrame>
  );
}
