"use client";
// A 3D globe without WebGL: the orthographic projection of d3-geo, lit like a sphere (a radial light, an atmosphere
// in the brand accent), the far side clipped, great-circle arcs between places. Plain SVG — server-safe, sharp at
// any size, readable by the export, a fraction of echarts-gl's 300 kB (see the package README). It turns slowly
// while on screen and the page is visible, never under reduced motion; it is dragged with the pointer, and the
// keyboard walks the places, turning the globe to each one.
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { type KeyboardEvent, type PointerEvent, useEffect, useId, useMemo, useRef, useState } from "react";

import { valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import type { Tone, ValueFormat } from "../core/types";
import type { GeoPoint } from "../geo/geo-map";
import { useWorld } from "../geo/world";
import { ChartFrame, type ChartFrameProps, useSettings } from "../web/frame";
import { useInView, useMounted, useReducedMotion } from "../web/hooks";
import { colorOf, Tooltip } from "../web/parts";

export interface GlobePoint extends GeoPoint {
  /** Its tone: a healthy region in `"success"`, a degraded one in `"warning"`. Default `"accent"`. */
  readonly tone?: Tone;
}

export interface GlobeArc {
  /** The labels of two points (or their coordinates, `[lon, lat]`). */
  readonly from: string | readonly [number, number];
  readonly to: string | readonly [number, number];
}

export interface Globe3DProps extends ChartFrameProps {
  /** The places: deployment regions, data centres, audiences. */
  points: readonly GlobePoint[];
  /** Great-circle arcs between places: replication, traffic. */
  arcs?: readonly GlobeArc[];
  /** Countries to tint in the accent (ISO alpha-2): where the service is available. */
  regions?: readonly string[];
  /** How the points' values are written. */
  format?: ValueFormat;
  /** The longitude and latitude facing the reader at first. Default: the first point. */
  center?: readonly [number, number];
  /** Turn slowly while on screen (never under reduced motion). Default true. */
  autoRotate?: boolean;
  /** The header of the places and of their values in the table. */
  pointLabel?: string;
/** The header of the points' values (“Availability”). */
  valueLabel?: string;
}

const SPEED = 6; // degrees per second: one turn a minute.

/** The world as a lit sphere: deployment regions, the arcs between them, a slow turn. */
export function Globe3D(props: Globe3DProps) {
  const { points, arcs = [], regions = [], format, center, autoRotate = true, pointLabel, valueLabel } = props;
  const { locale, labels } = useSettings(props);
  const mounted = useMounted();
  const { world, failed } = useWorld(mounted);
  const reduced = useReducedMotion();
  const plotRef = useRef<HTMLDivElement | null>(null);
  const onScreen = useInView(plotRef, { margin: "0px" });
  const fmt = useMemo(() => valueFormatter(format, locale, labels.noValue), [format, locale, labels.noValue]);
  const uid = useId().replace(/:/g, "");
  const start = center ?? (points[0] ? [points[0].lon, points[0].lat] : [0, 20]);
  const [rotation, setRotation] = useState<[number, number]>([-start[0], -Math.max(-60, Math.min(60, start[1]))]);
  const [active, setActive] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; r: [number, number] } | null>(null);
  const highlighted = useMemo(() => new Set(regions.map((r) => r.toUpperCase())), [regions]);

  // The slow turn: only on screen, page visible, no reduced motion, not while dragged or a place is focused.
  const turning = autoRotate && !reduced && onScreen && !dragging && active === null && mounted && Boolean(world);
  useEffect(() => {
    if (!turning) return undefined;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // ~30 frames a second is plenty for a turn of 6°/s, and half the work.
      if (now - last >= 33 && document.visibilityState === "visible") {
        const dt = (now - last) / 1000;
        last = now;
        setRotation(([lon, lat]) => [lon + SPEED * dt, lat]);
      } else if (document.visibilityState !== "visible") last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [turning]);

  const pointAt = (ref: GlobeArc["from"]): [number, number] | null => {
    if (typeof ref !== "string") return [ref[0], ref[1]];
    const p = points.find((q) => q.label === ref);
    return p ? [p.lon, p.lat] : null;
  };

  const summary = points.length
    ? `${fill(labels.summaryIntro, { kind: labels.kinds.globe, count: points.length })} ${points.map((p) => (p.value == null ? p.label : `${p.label} ${fmt(p.value)}`)).join(", ")}.`
    : labels.empty;
  const table = { columns: [pointLabel ?? labels.category, valueLabel ?? labels.value, "lon", "lat"], rows: points.map((p) => [p.label, p.value == null ? labels.noValue : fmt(p.value), p.lon.toFixed(2), p.lat.toFixed(2)]) };

  const focus = (i: number | null) => {
    setActive(i);
    if (i !== null) {
      const p = points[i]!;
      setRotation([-p.lon, -Math.max(-60, Math.min(60, p.lat))]);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const n = points.length;
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
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    focus(move());
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, r: rotation };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const { x, y, r } = drag.current;
    setRotation([r[0] + (event.clientX - x) * 0.4, Math.max(-75, Math.min(75, r[1] - (event.clientY - y) * 0.4))]);
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <ChartFrame
      kind="globe"
      frame={{ ...props, error: props.error ?? (failed || undefined), loading: props.loading || (mounted && !world && !failed) }}
      pending={!world && !failed}
      defaultHeight={360}
      table={table}
      summary={summary}
      isEmpty={points.length === 0}
      announcement={active === null ? "" : `${points[active]!.label}${points[active]!.value != null ? `: ${fmt(points[active]!.value)}` : ""}`}
      handlers={{ onKeyDown, onBlur: () => setActive(null) }}
      plotRef={plotRef}
    >
      {(width, height) => {
        if (!world) return null;
        const radius = Math.max(20, Math.min(width, height) / 2 - 12);
        const cx = width / 2;
        const cy = height / 2;
        const projection = geoOrthographic().scale(radius).translate([cx, cy]).rotate([rotation[0], rotation[1]]).clipAngle(90).precision(0.5);
        const path = geoPath(projection);
        const facing: [number, number] = [-rotation[0], -rotation[1]];
        const visible = (lon: number, lat: number) => geoDistance([lon, lat], facing) < Math.PI / 2 - 0.02;
        const current = active !== null ? points[active] : null;
        const tipAt = current && visible(current.lon, current.lat) ? projection([current.lon, current.lat]) : null;
        const placed: { x: number; y: number; w: number; h: number }[] = [];
        return (
          <>
            <svg
              className="kzc-svg kzc-enter-pop"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              aria-hidden
              style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <defs>
                <radialGradient id={`${uid}-light`} cx="35%" cy="30%" r="75%">
                  <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--kz-accent) 14%, var(--kz-surface-2))" }} />
                  <stop offset="100%" style={{ stopColor: "var(--kz-surface-1)" }} />
                </radialGradient>
                <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
                  <stop offset="86%" style={{ stopColor: "var(--kz-accent)", stopOpacity: 0.22 }} />
                  <stop offset="100%" style={{ stopColor: "var(--kz-accent)", stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r={radius * 1.12} style={{ fill: `url(#${uid}-halo)` }} />
              <circle cx={cx} cy={cy} r={radius} style={{ fill: `url(#${uid}-light)`, stroke: "var(--kz-border-default)" }} />
              <path d={path(geoGraticule10()) ?? ""} style={{ fill: "none", stroke: "var(--kz-border-subtle)", strokeWidth: 0.75 }} />
              {world.features.map((f, i) => (
                <path
                  key={`${f.id ?? "x"}-${i}`}
                  d={path(f) ?? ""}
                  style={{
                    fill: f.id && highlighted.has(f.id) ? "color-mix(in oklab, var(--kz-accent) 45%, var(--kz-surface-3))" : "var(--kz-surface-3)",
                    stroke: "var(--kz-surface-1)",
                    strokeWidth: 0.5,
                  }}
                />
              ))}
              {arcs.map((arc, i) => {
                const a = pointAt(arc.from);
                const b = pointAt(arc.to);
                if (!a || !b) return null;
                const interpolate = geoInterpolate(a, b);
                const line = { type: "LineString" as const, coordinates: Array.from({ length: 33 }, (_, k) => interpolate(k / 32)) };
                return <path key={i} d={path(line) ?? ""} style={{ fill: "none", stroke: "var(--kz-accent-text)", strokeWidth: 1.5, strokeDasharray: "4 3", opacity: 0.85 }} />;
              })}
              {points.map((p, i) => {
                if (!visible(p.lon, p.lat)) return null;
                const at0 = projection([p.lon, p.lat]);
                // A label is written only where it does not cover another (the active place's always).
                const box = at0 && { x: at0[0] + 10, y: at0[1] - 8, w: p.label.length * 6.6, h: 16 };
                const free = box && (active === i || !placed.some((b) => box.x < b.x + b.w && b.x < box.x + box.w && box.y < b.y + b.h && b.y < box.y + box.h));
                if (free) placed.push(box);
                const at = projection([p.lon, p.lat]);
                if (!at) return null;
                const color = colorOf(p.tone ?? "accent", 1);
                const on = active === i;
                return (
                  <g key={`${p.label}-${i}`}>
                    <circle cx={at[0]} cy={at[1]} r={on ? 11 : 8} style={{ fill: color, opacity: 0.22 }} />
                    <circle cx={at[0]} cy={at[1]} r={on ? 5.5 : 4.5} className="kzc-dot" style={{ fill: color }} />
                    {free && (on || points.length <= 8) && width >= 320 && (
                      <text x={at[0] + 10} y={at[1]} dominantBaseline="central" className="kzc-threshold-label">
                        {p.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {current && tipAt && <Tooltip x={tipAt[0]} y={tipAt[1]} width={width} title={current.label} rows={current.value == null ? [] : [{ label: valueLabel ?? labels.value, value: fmt(current.value) }]} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
