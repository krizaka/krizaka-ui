// The written summary of a chart — what a sighted reader takes in at a glance, said in words for a screen reader (and
// shown under the chart when `summary="visible"`): the kind, the size, then per series its range, extremes and trend.
import { summarize, type Table } from "./data";
import type { CategoryFormatter, ValueFormatter } from "./format";
import { capitalize, type ChartKind, type ChartLabels, fill } from "./labels";
import type { Threshold } from "./types";

export interface DescribeOptions {
  readonly kind: ChartKind;
  readonly labels: ChartLabels;
  readonly value: ValueFormatter;
  readonly category: CategoryFormatter;
  readonly share: (ratio: number) => string;
  readonly thresholds?: readonly Threshold[];
}

/** A cartesian chart (line, area, bar, sparkline): one sentence per series. */
export function describeSeries(table: Table, { kind, labels, value, category, share, thresholds = [] }: DescribeOptions): string {
  const points = table.categories.length;
  const first = points ? category(table.categories[0]) : "";
  const last = points ? category(table.categories[points - 1]) : "";
  const count = table.series.length > 1 ? `${table.series.length} × ${points}` : String(points);
  const intro = fill(labels.summaryIntro, { kind: labels.kinds[kind], count: points > 1 ? `${count} (${first} – ${last})` : count });
  const sentences = table.series.map((series) => {
    const s = summarize(series, table.categories, category);
    if (!s.count) return `${s.label}: ${labels.noValue}.`;
    const parts = [fill(labels.summarySeries, { label: s.label, first: value(s.first), last: value(s.last) })];
    if (s.min && s.max && s.count > 2) parts.push(fill(labels.summaryRange, { min: value(s.min.value), minAt: s.min.category, max: value(s.max.value), maxAt: s.max.category }));
    if (s.trend === "up" || s.trend === "down") {
      const template = s.trend === "up" ? labels.summaryTrendUp : labels.summaryTrendDown;
      if (s.change !== null) parts.push(fill(template, { change: share(Math.abs(s.change)) }));
    } else if (s.trend === "flat") parts.push(labels.summaryTrendFlat);
    return `${parts.join(", ")}.`;
  });
  const marks = thresholds.map((t) => fill(labels.summaryThreshold, { label: t.label, value: value(t.value) }));
  return [intro, ...sentences, ...(marks.length ? [`${marks.join(", ")}.`] : [])].join(" ");
}

/** A part-to-whole chart (pie, donut, funnel, treemap): the parts, largest first, with their share. */
export function describeParts(kind: ChartKind, parts: readonly { label: string; value: number }[], { labels, value, share }: Omit<DescribeOptions, "kind" | "category">): string {
  const total = parts.reduce((sum, p) => sum + Math.max(0, p.value), 0);
  const intro = fill(labels.summaryIntro, { kind: labels.kinds[kind], count: parts.length });
  const sorted = [...parts].sort((a, b) => b.value - a.value);
  const items = sorted.map((p) => fill(labels.summaryShare, { label: p.label, value: value(p.value), share: share(total ? p.value / total : 0) }));
  return `${intro} ${items.join(", ")}. ${capitalize(fill(labels.summaryTotal, { total: value(total) }))}.`;
}
