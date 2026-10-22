// Headless: the arithmetic of a Meter, read by the web (`meter.tsx`) and the native (`native/meter.tsx`) alike.

export interface MeterPart {
  /** Its name (“To the creator”) — passed translated. */
  label: string;
  /** Its value, in the meter's unit. */
  value: number;
  /** Its value in words (“€9.00”), in the legend and for assistive technology; default: its percentage. */
  valueText?: string;
}

/** Which end of the range is good: `low` (a quota) or `high` (a score, a balance). */
export const MeterOptimum = { Low: "low", High: "high" } as const;
export type MeterOptimum = (typeof MeterOptimum)[keyof typeof MeterOptimum];

/** The tone of a fill: the accent without thresholds, otherwise good, warning or bad. */
export const MeterLevel = { Ok: "ok", Success: "success", Warning: "warning", Danger: "danger" } as const;
export type MeterLevel = (typeof MeterLevel)[keyof typeof MeterLevel];

export interface MeterThresholds {
  readonly low: number;
  readonly high: number;
}

export interface MeterInput {
  value?: number;
  min?: number;
  max?: number;
  valueText?: string;
  thresholds?: MeterThresholds;
  optimum?: MeterOptimum;
  parts?: readonly MeterPart[];
}

export interface MeterShare extends MeterPart {
  i: number;
  /** Its share of the range, 0–1. */
  ratio: number;
  /** Its value in words. */
  words: string;
}

/** One arc of a ring, as fractions of the circle: the part it draws (none for the whole value), its length, where it starts. */
export interface MeterArc {
  part: number | undefined;
  len: number;
  start: number;
}

export interface MeterModel {
  ratio: number;
  level: MeterLevel;
  words: string;
  shares: MeterShare[];
  arcs: MeterArc[];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const percent = (ratio: number) => `${Math.round(ratio * 100)} %`;

function levelOf(ratio: number, thresholds: MeterThresholds | undefined, optimum: MeterOptimum): MeterLevel {
  if (!thresholds) return MeterLevel.Ok;
  const good = optimum === MeterOptimum.Low ? MeterLevel.Success : MeterLevel.Danger;
  const bad = optimum === MeterOptimum.Low ? MeterLevel.Danger : MeterLevel.Success;
  if (ratio >= thresholds.high) return bad;
  return ratio >= thresholds.low ? MeterLevel.Warning : good;
}

/** The ratio, tone, words, parts and ring arcs of a meter. */
export function meterModel({ value = 0, min = 0, max = 100, valueText, thresholds, optimum = MeterOptimum.Low, parts }: MeterInput): MeterModel {
  const span = max - min || 1;
  const ratio = clamp01((value - min) / span);
  const shares = (parts ?? []).map((p, i) => ({ ...p, i, ratio: clamp01(p.value / span), words: p.valueText ?? percent(p.value / span) }));
  let start = 0;
  const arcs = parts
    ? shares.map((p) => {
        const arc = { part: p.i, len: p.ratio, start };
        start += p.ratio;
        return arc;
      })
    : [{ part: undefined, len: ratio, start: 0 }];
  return { ratio, level: levelOf(ratio, thresholds, optimum), words: valueText ?? percent(ratio), shares, arcs };
}
