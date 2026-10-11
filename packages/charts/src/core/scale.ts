// Scales and ticks: the few functions a cartesian chart needs, without d3-scale (the charts draw a handful of shapes;
// a full scale library would weigh more than the charts themselves).

export interface LinearScale {
  (value: number): number;
  readonly domain: readonly [number, number];
  readonly range: readonly [number, number];
  readonly ticks: readonly number[];
}

/** A step of 1, 2, 2.5 or 5 × 10ⁿ near `span / count`: ticks a reader counts without effort (0, 250, 500…). */
export function niceStep(span: number, count: number): number {
  if (!(span > 0) || !(count > 0)) return 1;
  const raw = span / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / power;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * power;
}

/**
 * A domain stretched to round ticks: `[0, 4870]` with about 5 ticks → `[0, 5000]`, ticks `0 1000 … 5000`. A single
 * value is padded towards zero, so a lone point never sits on the edge.
 */
export function niceDomain(min: number, max: number, count = 5): { domain: [number, number]; ticks: number[] } {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { domain: [0, 1], ticks: [0, 1] };
  if (min === max) {
    if (min === 0) return { domain: [0, 1], ticks: [0, 0.5, 1] };
    const pad = Math.abs(min) * 0.5;
    [min, max] = min > 0 ? [0, max + pad] : [min - pad, 0];
  }
  const step = niceStep(max - min, count);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  // Rounded to the step's precision: 0.1 + 0.2 must read 0.3.
  const digits = Math.max(0, -Math.floor(Math.log10(step)) + 2);
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(digits)));
  return { domain: [lo, hi], ticks };
}

/** A linear scale from a domain to pixels, with its round ticks. */
export function linearScale(domain: readonly [number, number], range: readonly [number, number], ticks: readonly number[] = domain): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const scale = ((value: number) => r0 + (value - d0) * k) as LinearScale;
  return Object.assign(scale, { domain, range, ticks });
}

export interface BandScale {
  (index: number): number;
  /** The width of one band (the bars of a category share it). */
  readonly bandwidth: number;
  /** The distance between the starts of two bands. */
  readonly step: number;
  readonly count: number;
}

/** `count` bands over the range, with an inner padding between them (a ratio of the step). */
export function bandScale(count: number, range: readonly [number, number], padding = 0.3): BandScale {
  const [r0, r1] = range;
  const step = count > 0 ? (r1 - r0) / count : 0;
  const bandwidth = step * (1 - padding);
  const scale = ((index: number) => r0 + index * step + (step - bandwidth) / 2) as BandScale;
  return Object.assign(scale, { bandwidth, step, count });
}

/** A point scale: `count` points from one end of the range to the other (lines, areas). */
export function pointScale(count: number, range: readonly [number, number]): (index: number) => number {
  const [r0, r1] = range;
  if (count <= 1) return () => (r0 + r1) / 2;
  const step = (r1 - r0) / (count - 1);
  return (index) => r0 + index * step;
}

/** At most `max` of `count` labels, evenly spaced, the last one always kept: which indexes to write on an axis. */
export function thinLabels(count: number, max: number): number[] {
  if (count <= max) return Array.from({ length: count }, (_, i) => i);
  const every = Math.ceil(count / Math.max(1, max));
  const out: number[] = [];
  for (let i = 0; i < count; i += every) out.push(i);
  if (out[out.length - 1] !== count - 1) {
    // The last label is always written; the one before it gives way when they would touch.
    if (count - 1 - out[out.length - 1]! < every) out.pop();
    out.push(count - 1);
  }
  return out;
}
