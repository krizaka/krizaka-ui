"use client";
// Where: a choropleth of the world (one sequential hue — the brand's — in even steps from near the surface), and
// optional bubbles on places (cities, data centres). Plain SVG through d3-geo's Equal Earth projection (areas stay
// true: no Greenland the size of Africa); country names in the reader's language (Intl.DisplayNames). The keyboard
// walks the regions that have data, largest first.
import { geoEqualEarth, geoPath } from "d3-geo";
import { type KeyboardEvent, useMemo, useState } from "react";

import { read } from "../core/data";
import { shareFormatter, valueFormatter } from "../core/format";
import { capitalize, fill } from "../core/labels";
import type { Accessor, Datum, ValueFormat } from "../core/types";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { useMounted } from "../web/hooks";
import { RampLegend, stepColor, Tooltip } from "../web/parts";
import { regionName, useWorld } from "./world";

/** A place on the map or the globe. */
export interface GeoPoint {
  /** Longitude, then latitude, in degrees. */
  readonly lon: number;
  readonly lat: number;
  /** Its name (“Montréal”, “eu-west-3 · Paris”). */
  readonly label: string;
  /** An amount: the bubble's area on a map; written in the tooltip and the table. */
  readonly value?: number;
}

export interface GeoMapProps<T extends Datum> extends ChartFrameProps {
  /** One row per region with a value. */
  data: readonly T[];
  /** The field (or function) of the region's ISO 3166-1 alpha-2 code (`"FR"`, `"US"`). */
  region: Accessor<T, string>;
  /** The field (or function) of its value. */
  value: Accessor<T, number>;
  /** How the values are written. */
  format?: ValueFormat;
  /** Bubbles on places, their area by `value`. */
  points?: readonly GeoPoint[];
  /** The number of colour steps of the scale. Default 5. */
  steps?: number;
  /** The header of the regions and of the values in the table (“Country”, “Viewers”). */
  regionLabel?: string;
/** The header of the values (“Viewers”). */
  valueLabel?: string;
  /** Called with the row when a region is clicked (or Enter is pressed on it). */
  onSelect?: (datum: T, index: number) => void;
}

export function GeoMap<T extends Datum>(props: GeoMapProps<T>) {
  const { data, region, value, format, points = [], steps = 5, regionLabel, valueLabel, onSelect } = props;
  const { locale, labels } = useSettings(props);
  const mounted = useMounted();
  const { world, failed } = useWorld(mounted);
  const fmt = useMemo(() => ({ value: valueFormatter(format, locale, labels.noValue), axis: valueFormatter(format, locale, labels.noValue, true), share: shareFormatter(locale) }), [format, locale, labels.noValue]);

  const rows = useMemo(
    () =>
      data
        .map((datum, index) => ({ datum, index, code: String(read(region, datum, index)).toUpperCase(), value: Number(read(value, datum, index)) }))
        .filter((r) => Number.isFinite(r.value))
        .sort((a, b) => b.value - a.value),
    [data, region, value],
  );
  const byCode = useMemo(() => new Map(rows.map((r) => [r.code, r])), [rows]);
  const max = rows[0]?.value ?? 0;
  const min = rows[rows.length - 1]?.value ?? 0;
  const stepOf = (v: number) => (max === min ? steps - 1 : Math.min(steps - 1, Math.floor(((v - min) / (max - min)) * steps)));
  const name = (code: string) => regionName(code, code, locale);
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const isEmpty = rows.length === 0 && points.length === 0;

  const summary = isEmpty
    ? labels.empty
    : [
        fill(labels.summaryIntro, { kind: labels.kinds.map, count: rows.length || points.length }),
        rows
          .slice(0, 5)
          .map((r) => fill(labels.summaryShare, { label: name(r.code), value: fmt.value(r.value), share: fmt.share(total ? r.value / total : 0) }))
          .join(", ") + (rows.length ? "." : ""),
        rows.length ? `${capitalize(fill(labels.summaryTotal, { total: fmt.value(total) }))}.` : "",
      ]
        .filter(Boolean)
        .join(" ");
  const table = {
    columns: [regionLabel ?? labels.category, valueLabel ?? labels.value, "%"],
    rows: [
      ...rows.map((r) => [name(r.code), fmt.value(r.value), fmt.share(total ? r.value / total : 0)]),
      ...points.map((p) => [p.label, p.value == null ? labels.noValue : fmt.value(p.value), ""]),
    ],
  };

  const walk = [...rows.map((r) => ({ kind: "region" as const, code: r.code })), ...points.map((_, i) => ({ kind: "point" as const, i }))];
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const n = walk.length;
    if (!n) return;
    const moves: Record<string, () => number | null> = {
      ArrowRight: () => ((active ?? -1) + 1) % n,
      ArrowDown: () => ((active ?? -1) + 1) % n,
      ArrowLeft: () => ((active ?? 0) - 1 + n) % n,
      ArrowUp: () => ((active ?? 0) - 1 + n) % n,
      Home: () => 0,
      End: () => n - 1,
      Escape: () => null,
    };
    const current = active !== null ? walk[active] : null;
    if (event.key === "Enter" && current?.kind === "region" && onSelect) {
      const row = byCode.get(current.code)!;
      onSelect(row.datum, row.index);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setHover(null);
    setActive(move());
  };
  const current = active !== null ? walk[active] : null;
  const announce = !current ? "" : current.kind === "region" ? `${name(current.code)}: ${fmt.value(byCode.get(current.code)!.value)}` : `${points[current.i]!.label}${points[current.i]!.value != null ? `: ${fmt.value(points[current.i]!.value)}` : ""}`;

  const legend = rows.length > 0 ? <RampLegend min={min} max={max} steps={steps} write={fmt.axis} /> : null;

  return (
    <ChartFrame
      kind="map"
      frame={{ ...props, error: props.error ?? (failed || undefined), loading: props.loading || (mounted && !world && !failed) }}
      pending={!world && !failed}
      defaultHeight={360}
      table={table}
      summary={summary}
      isEmpty={isEmpty}
      legend={legend}
      announcement={announce}
      active={active !== null}
      handlers={{
        onKeyDown,
        onBlur: () => setActive(null),
        onPointerLeave: () => setHover(null),
      }}
    >
      {(width, height) => {
        if (!world) return null;
        const projection = geoEqualEarth().fitExtent(
          [
            [4, 4],
            [width - 4, height - 4],
          ],
          { type: "Sphere" },
        );
        const path = geoPath(projection);
        const maxPoint = Math.max(0, ...points.map((p) => p.value ?? 0));
        const radiusOf = (p: GeoPoint) => (p.value && maxPoint ? 3 + Math.sqrt(p.value / maxPoint) * 15 : 4);
        const focusCode = hover?.code ?? (current?.kind === "region" ? current.code : null);
        let tip: { x: number; y: number; title: string; value: string } | null = null;
        if (hover) {
          const row = byCode.get(hover.code);
          tip = { x: hover.x, y: hover.y, title: name(hover.code), value: row ? fmt.value(row.value) : labels.noValue };
        } else if (current?.kind === "region") {
          const feature = world.features.find((f) => f.id === current.code);
          const [cx, cy] = feature ? path.centroid(feature) : [width / 2, height / 2];
          tip = { x: cx, y: cy, title: name(current.code), value: fmt.value(byCode.get(current.code)!.value) };
        } else if (current?.kind === "point") {
          const p = points[current.i]!;
          const [px, py] = projection([p.lon, p.lat]) ?? [0, 0];
          tip = { x: px, y: py, title: p.label, value: p.value == null ? "" : fmt.value(p.value) };
        }
        return (
          <>
            <svg className="kzc-svg kzc-enter-fade" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
              <path d={path({ type: "Sphere" }) ?? ""} style={{ fill: "var(--kz-surface-2)", opacity: 0.5 }} />
              {world.features.map((f, i) => {
                const row = f.id ? byCode.get(f.id) : undefined;
                return (
                  <path
                    key={`${f.id ?? "x"}-${i}`}
                    d={path(f) ?? ""}
                    className="kzc-mark"
                    data-dim={focusCode && focusCode !== f.id ? "" : undefined}
                    style={{
                      fill: row ? stepColor(stepOf(row.value), steps) : "var(--kz-surface-3)",
                      stroke: focusCode === f.id ? "var(--kzc-text)" : "var(--kzc-surface)",
                      strokeWidth: focusCode === f.id ? 1.5 : 0.5,
                      cursor: row && onSelect ? "pointer" : undefined,
                    }}
                    onPointerMove={(event) => {
                      if (!f.id) return;
                      const box = (event.currentTarget.ownerSVGElement ?? event.currentTarget).getBoundingClientRect();
                      setActive(null);
                      setHover({ code: f.id, x: event.clientX - box.left, y: event.clientY - box.top });
                    }}
                    onClick={row && onSelect ? () => onSelect(row.datum, row.index) : undefined}
                  />
                );
              })}
              {points.map((p, i) => {
                const at = projection([p.lon, p.lat]);
                if (!at) return null;
                const on = current?.kind === "point" && current.i === i;
                return <circle key={`${p.label}-${i}`} cx={at[0]} cy={at[1]} r={radiusOf(p)} className="kzc-dot" style={{ fill: "var(--kzc-2)", fillOpacity: on ? 1 : 0.8, strokeWidth: on ? 2.5 : 1.5 }} />;
              })}
            </svg>
            {tip && <Tooltip x={tip.x} y={tip.y} width={width} title={tip.title} rows={tip.value ? [{ label: valueLabel ?? labels.value, value: tip.value }] : []} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
