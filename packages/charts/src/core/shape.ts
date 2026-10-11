// SVG path data for the marks: lines (linear, monotone, step), areas, bars with a rounded data end, arcs. Shared by
// the web (`<path d>`) and React Native (react-native-svg's `<Path d>`): the same geometry on both platforms.

export type Point = readonly [number, number];
export type Curve = "linear" | "monotone" | "step";

const r = (n: number) => Math.round(n * 100) / 100;

/** The segments of a line, split where a value is missing (a gap stays a gap, never a fake zero). */
export function segments(points: readonly (Point | null)[]): Point[][] {
  const out: Point[][] = [];
  let current: Point[] = [];
  for (const point of points) {
    if (point) current.push(point);
    else if (current.length) {
      out.push(current);
      current = [];
    }
  }
  if (current.length) out.push(current);
  return out;
}

/** The path of one segment. `monotone` (Fritsch–Carlson) never overshoots: a curve that never invents a peak. */
export function linePath(points: readonly Point[], curve: Curve = "monotone"): string {
  if (points.length === 0) return "";
  const [x0, y0] = points[0]!;
  if (points.length === 1) return `M${r(x0)},${r(y0)}`;
  if (curve === "step") {
    let d = `M${r(x0)},${r(y0)}`;
    for (let i = 1; i < points.length; i += 1) {
      const [px] = points[i - 1]!;
      const [x, y] = points[i]!;
      const mid = (px + x) / 2;
      d += `H${r(mid)}V${r(y)}H${r(x)}`;
    }
    return d;
  }
  if (curve === "linear" || points.length === 2) return points.map(([x, y], i) => `${i ? "L" : "M"}${r(x)},${r(y)}`).join("");
  const tangents = monotoneTangents(points);
  let d = `M${r(x0)},${r(y0)}`;
  for (let i = 1; i < points.length; i += 1) {
    const [xa, ya] = points[i - 1]!;
    const [xb, yb] = points[i]!;
    const h = (xb - xa) / 3;
    d += `C${r(xa + h)},${r(ya + h * tangents[i - 1]!)} ${r(xb - h)},${r(yb - h * tangents[i]!)} ${r(xb)},${r(yb)}`;
  }
  return d;
}

function monotoneTangents(points: readonly Point[]): number[] {
  const n = points.length;
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const [xa, ya] = points[i]!;
    const [xb, yb] = points[i + 1]!;
    slopes.push(xb === xa ? 0 : (yb - ya) / (xb - xa));
  }
  const tangents = [slopes[0]!];
  for (let i = 1; i < n - 1; i += 1) {
    const a = slopes[i - 1]!;
    const b = slopes[i]!;
    tangents.push(a * b <= 0 ? 0 : (3 * a * b) / (Math.max(a, b) * 2 + Math.min(a, b)) || 0);
  }
  tangents.push(slopes[n - 2]!);
  return tangents;
}

/** An area under (or between) lines: the top points left to right, then the base right to left. */
export function areaPath(top: readonly Point[], base: readonly Point[] | number, curve: Curve = "monotone"): string {
  if (top.length === 0) return "";
  const line = linePath(top, curve);
  const bottom: Point[] = typeof base === "number" ? [top[top.length - 1]!, top[0]!].map(([x]) => [x, base] as Point) : [...base].reverse();
  if (typeof base === "number") return `${line}L${r(bottom[0]![0])},${r(base)}L${r(bottom[1]![0])},${r(base)}Z`;
  return `${line}L${linePath(bottom, curve).slice(1)}Z`;
}

/**
 * A bar from its baseline to its value, the data end rounded (`radius`, 4 px by default), square on the baseline.
 * `horizontal` bars grow to the right (or left for a negative value).
 */
export function barPath(x: number, y: number, width: number, height: number, radius = 4, horizontal = false, negative = false): string {
  if (width <= 0 || height <= 0) return "";
  const rad = Math.min(radius, horizontal ? height / 2 : width / 2, horizontal ? width : height);
  if (!horizontal) {
    if (!negative) {
      // Rounded at the top, square at the baseline (bottom).
      return `M${r(x)},${r(y + height)}V${r(y + rad)}Q${r(x)},${r(y)} ${r(x + rad)},${r(y)}H${r(x + width - rad)}Q${r(x + width)},${r(y)} ${r(x + width)},${r(y + rad)}V${r(y + height)}Z`;
    }
    return `M${r(x)},${r(y)}V${r(y + height - rad)}Q${r(x)},${r(y + height)} ${r(x + rad)},${r(y + height)}H${r(x + width - rad)}Q${r(x + width)},${r(y + height)} ${r(x + width)},${r(y + height - rad)}V${r(y)}Z`;
  }
  if (!negative) {
    return `M${r(x)},${r(y)}H${r(x + width - rad)}Q${r(x + width)},${r(y)} ${r(x + width)},${r(y + rad)}V${r(y + height - rad)}Q${r(x + width)},${r(y + height)} ${r(x + width - rad)},${r(y + height)}H${r(x)}Z`;
  }
  return `M${r(x + width)},${r(y)}H${r(x + rad)}Q${r(x)},${r(y)} ${r(x)},${r(y + rad)}V${r(y + height - rad)}Q${r(x)},${r(y + height)} ${r(x + rad)},${r(y + height)}H${r(x + width)}Z`;
}

/** A point on a circle, the angle in radians from twelve o'clock, clockwise. */
export function polar(cx: number, cy: number, radius: number, angle: number): Point {
  return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
}

/**
 * A ring sector (a pie slice when `inner` is 0), from `start` to `end` (radians, clockwise from twelve o'clock).
 * A full turn is drawn as two halves: an SVG arc cannot start and end on the same point.
 */
export function arcPath(cx: number, cy: number, inner: number, outer: number, start: number, end: number): string {
  const sweep = end - start;
  if (sweep <= 0 || outer <= 0) return "";
  if (sweep >= Math.PI * 2 - 1e-6) {
    const mid = start + Math.PI;
    return `${arcPath(cx, cy, inner, outer, start, mid)}${arcPath(cx, cy, inner, outer, mid, start + Math.PI * 2)}`;
  }
  const large = sweep > Math.PI ? 1 : 0;
  const [ox0, oy0] = polar(cx, cy, outer, start);
  const [ox1, oy1] = polar(cx, cy, outer, end);
  let d = `M${r(ox0)},${r(oy0)}A${r(outer)},${r(outer)} 0 ${large} 1 ${r(ox1)},${r(oy1)}`;
  if (inner > 0) {
    const [ix1, iy1] = polar(cx, cy, inner, end);
    const [ix0, iy0] = polar(cx, cy, inner, start);
    d += `L${r(ix1)},${r(iy1)}A${r(inner)},${r(inner)} 0 ${large} 0 ${r(ix0)},${r(iy0)}Z`;
  } else d += `L${r(cx)},${r(cy)}Z`;
  return d;
}

/** An open arc (a gauge's track), stroked rather than filled. */
export function strokeArcPath(cx: number, cy: number, radius: number, start: number, end: number): string {
  if (end - start <= 0) return "";
  const [x0, y0] = polar(cx, cy, radius, start);
  const [x1, y1] = polar(cx, cy, radius, end);
  return `M${r(x0)},${r(y0)}A${r(radius)},${r(radius)} 0 ${end - start > Math.PI ? 1 : 0} 1 ${r(x1)},${r(y1)}`;
}
