// The pen of the sketch: the internal drawing facade (krizaka-internal#4006). Every stroke is an SVG path whose wobble
// comes from a seeded generator, so a spec and its seed always give the same markup — on the server, without client
// JavaScript. Our own few strokes instead of a drawing library: a line, a box, a circle, a scribble and a hatch are all
// the sketch needs, and they cost a fraction of the block's size budget.
import type { Pt } from "./sketch.types";

/** A seeded generator of numbers in [0, 1) (mulberry32): small, fast and the same on every platform. */
export type Rng = () => number;

export function rngOf(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The generator of one shape: its own stream, so adding a shape never moves the strokes of the others. */
export const rngFor = (seed: number, index: number): Rng => rngOf(Math.imul(seed + 1, 2654435761) ^ Math.imul(index + 1, 40503));

/** A number written with one decimal at most: the markup stays short and stable. */
const f = (v: number) => String(Math.round(v * 10) / 10);
const pt = ([x, y]: Pt) => `${f(x)} ${f(y)}`;
const spread = (rng: Rng, amount: number) => (rng() * 2 - 1) * amount;

/** The bowed middle of a stroke from `a` to `b` (at most `bow` off the straight line), to continue a path already at `a`. */
export function bend(rng: Rng, a: Pt, b: Pt, bow = 2): string {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(len * 0.012, bow);
  const c = (t: number): Pt => [a[0] + dx * t + (-dy / len) * spread(rng, off), a[1] + dy * t + (dx / len) * spread(rng, off)];
  return `C${pt(c(1 / 3))} ${pt(c(2 / 3))} ${pt(b)}`;
}

/** One pen stroke from `a` to `b`: the ends a little off, the middle bowed, sometimes past the end. */
export function stroke(rng: Rng, a: Pt, b: Pt, overshoot = 0): string {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  const end = overshoot * rng();
  const start: Pt = [a[0] + spread(rng, 0.6), a[1] + spread(rng, 0.6)];
  const stop: Pt = [b[0] + (dx / len) * end + spread(rng, 0.6), b[1] + (dy / len) * end + spread(rng, 0.6)];
  return `M${pt(start)}` + bend(rng, start, stop, 2.2);
}

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
function through(points: readonly Pt[]): string {
  let d = `M${pt(points[0]!)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const [p1, p2] = [points[i]!, points[i + 1]!];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return d;
}

/** A box's outline: four strokes, each one a little past its corner, the way a pen draws a frame. */
export function box(rng: Rng, x: number, y: number, w: number, h: number): string {
  const corners: Pt[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  return corners.map((c, i) => stroke(rng, c, corners[(i + 1) % 4]!, 2.5)).join("");
}

/** A box's wash: the same box, its corners a little off, closed and without a stroke. */
export function wash(rng: Rng, x: number, y: number, w: number, h: number): string {
  const c = (px: number, py: number) => pt([px + spread(rng, 1), py + spread(rng, 1)]);
  return `M${c(x, y)}L${c(x + w, y)}L${c(x + w, y + h)}L${c(x, y + h)}Z`;
}

/** A hand-drawn circle: a little uneven, and its end runs past its start. */
export function circle(rng: Rng, [cx, cy]: Pt, r: number): string {
  const start = rng() * Math.PI * 2;
  const steps = 9;
  const points: Pt[] = [];
  for (let i = 0; i <= steps + 1; i++) {
    const a = start + (i / steps) * Math.PI * 2 * (1 + 0.04 * rng());
    const rr = r * (1 + spread(rng, 0.05));
    points.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return through(points);
}

/** A scribbled line of text: a wave of the pen, `w` long. */
export function scribble(rng: Rng, x: number, y: number, w: number): string {
  const points: Pt[] = [];
  const step = 14;
  for (let px = 0; px <= w; px += step) points.push([x + px, y + (points.length % 2 ? 1.3 : -1.3) + spread(rng, 0.6)]);
  points.push([x + w, y + spread(rng, 0.8)]);
  return through(points);
}

/** An arrow's head at `to`, coming from `from`: two short strokes. */
export function head(rng: Rng, from: Pt, to: Pt, size: number): string {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const wing = (side: number): Pt => {
    const a = angle + Math.PI + side * (0.45 + spread(rng, 0.06));
    return [to[0] + Math.cos(a) * size, to[1] + Math.sin(a) * size];
  };
  return stroke(rng, wing(1), to) + stroke(rng, wing(-1), to);
}

/** A hatched area: strokes at 45°, every `gap` units, cut at the box's edges. */
export function hatch(rng: Rng, x: number, y: number, w: number, h: number, gap = 9): string {
  let d = "";
  for (let c = x + y + gap / 2; c < x + w + y + h; c += gap) {
    const ax = Math.max(x, c - (y + h));
    const bx = Math.min(x + w, c - y);
    if (bx - ax > 1) d += stroke(rng, [ax, c - ax], [bx, c - bx]);
  }
  return d;
}
