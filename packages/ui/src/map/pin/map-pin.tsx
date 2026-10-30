"use client";

import * as React from "react";

import { tv } from "../../tv";

export const mapPin = tv({
  slots: {
    root: "relative inline-flex items-center justify-center text-on-accent transition-transform motion-reduce:transition-none",
    shape: "block h-full w-full overflow-visible drop-shadow-md",
    glyph: "absolute inset-0 flex items-center justify-center text-[0.55em] font-semibold leading-none [&>svg]:h-[55%] [&>svg]:w-[55%]",
  },
  variants: {
    state: {
      selected: { root: "scale-125" },
    },
  },
});

export type MapPinShape = "drop" | "disc" | "tag";
export type MapPinState = "default" | "selected" | "visited" | "closed";

export type MapPinProps = {
  /** `drop` (a pin, its tip on the place), `disc` (a dot with a ring) or `tag` (the Cahier's manila tag with its eyelet). Default `drop`. */
  shape?: MapPinShape;
  /** `default`; `selected` (larger, the ring doubled); `visited` (hollow: seen already); `closed` (greyed: not available now). */
  state?: MapPinState;
  /** `accent` (the product's colour) or `margin` (the notebook's red). Default `accent`. */
  tone?: "accent" | "margin";
  /** Its size in pixels (the width). Default 28. */
  size?: number;
  /** A short mark or an icon in the head of the pin ("3", an icon). */
  children?: React.ReactNode;
  className?: string;
};

const PATHS: Record<MapPinShape, { d: string; viewBox: string; height: number; head: [number, number] }> = {
  drop: { d: "M12 1C6.2 1 1.5 5.6 1.5 11.3 1.5 18.6 12 31 12 31s10.5-12.4 10.5-19.7C22.5 5.6 17.8 1 12 1Z", viewBox: "0 0 24 32", height: 32 / 24, head: [12, 11.5] },
  disc: { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z", viewBox: "0 0 24 24", height: 1, head: [12, 12] },
  tag: { d: "M5 2h14a2 2 0 0 1 2 2v12l-9 7.5L3 16V4a2 2 0 0 1 2-2Z", viewBox: "0 0 24 26", height: 26 / 24, head: [12, 10] },
};

type PinColours = { edge: string; fill: string; stroke: string; glyph: string; headFill: string };

/** The colours a pin wears for its shape, state and tone: the state is also said by shape (hollow, struck), never by colour alone. */
function pinColours(shape: MapPinShape, state: MapPinState, tone: "accent" | "margin"): PinColours {
  const tag = shape === "tag";
  const base = tag ? "var(--kz-paper-tag)" : `var(--kz-${tone === "margin" ? "paper-rule-margin" : "accent"})`;
  const edge = tag ? "var(--kz-paper-tag-edge)" : "var(--kz-on-accent)";
  const muted = "var(--kz-text-muted)";
  if (state === "closed") return { edge, fill: "var(--kz-surface-3)", stroke: muted, glyph: muted, headFill: "none" };
  if (state === "visited") return { edge, fill: "var(--kz-surface-1)", stroke: base, glyph: base, headFill: base };
  return { edge, fill: base, stroke: edge, glyph: tag ? "var(--kz-paper-tag-ink)" : edge, headFill: "var(--kz-surface-0)" };
}

const GLYPH_TOP: Record<MapPinShape, string | number> = { drop: "-8%", tag: "6%", disc: 0 };

/**
 * A pin for a `Marker`'s children: three shapes, four states, drawn from the tokens (both themes). Decorative by itself —
 * the `Marker` carries the label — and the state is also said by shape (hollow, struck), never by colour alone.
 */
export function MapPin({ shape = "drop", state = "default", tone = "accent", size = 28, children, className }: Readonly<MapPinProps>) {
  const s = mapPin({ state });
  const p = PATHS[shape];
  const c = pinColours(shape, state, tone);
  const closed = state === "closed";
  return (
    <span className={s.root({ className })} style={{ width: size, height: size * p.height }} data-shape={shape} data-state={state} aria-hidden="true">
      <svg className={s.shape()} viewBox={p.viewBox} focusable="false">
        <path d={p.d} fill={c.fill} stroke={c.stroke} strokeWidth={state === "selected" ? 2.5 : 1.75} strokeDasharray={closed ? "3 2" : undefined} />
        {shape === "tag" ? <circle cx={12} cy={5.5} r={1.6} fill="var(--kz-surface-0)" stroke={c.edge} strokeWidth={1} /> : null}
        {children ? null : <circle cx={p.head[0]} cy={p.head[1]} r={shape === "disc" ? 3 : 3.2} fill={c.headFill} opacity={closed ? 0 : 1} />}
      </svg>
      {children ? (
        <span className={s.glyph()} style={{ color: c.glyph, top: GLYPH_TOP[shape] }}>
          {children}
        </span>
      ) : null}
    </span>
  );
}
