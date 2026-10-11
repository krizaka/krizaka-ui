// The words a chart says on its own: its controls, its states and its written summary. English by default; an app
// passes its own (translated through its catalogue) once, to `ChartsProvider labels`, or to one chart's `labels`.
// Placeholders are written `{name}`.

export interface ChartLabels {
  /** The button that shows the data table. */
  showData: string;
  /** The button that hides it. */
  hideData: string;
  /** The caption of the data table: `{title}`. */
  tableCaption: string;
  /** The export buttons. */
  exportPng: string;
  exportSvg: string;
  exportCsv: string;
  /** Announced while the data loads. */
  loading: string;
  /** Shown when there is nothing to draw. */
  empty: string;
  /** Shown when the data could not be loaded. */
  error: string;
  /** The keyboard hint, read once when the plot takes the focus. */
  keyboardHint: string;
  /** The role description of the plot (`chart`). */
  roleDescription: string;
  /** Summary pieces. `{kind}` is the chart's name (`Line chart`), `{count}` a number of points or series. */
  summaryIntro: string;
  summarySeries: string;
  summaryRange: string;
  summaryTrendUp: string;
  summaryTrendDown: string;
  summaryTrendFlat: string;
  summaryTotal: string;
  summaryThreshold: string;
  summaryShare: string;
  /** Scatter: the correlation of x and y (Pearson's r). */
  summaryCorrelation: string;
  /** Funnel: from one stage to the next, and from the first to the last. */
  summaryConversion: string;
  summaryOverall: string;
  /** Heatmap, calendar: the largest cell and the number of cells with a value. */
  summaryPeak: string;
  summaryActive: string;
  /** Candlestick: the period's range. */
  summaryOhlc: string;
  /** The names of the charts, read first in the summary. */
  kinds: Record<ChartKind, string>;
  /** The column of the values, when the chart has no value label. */
  value: string;
  /** The column of the categories in the data table, when the chart has no x label. */
  category: string;
  /** The total row of a stacked chart, a pie, a funnel. */
  total: string;
  /** What a missing value reads as. */
  noValue: string;
}

export type ChartKind =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "gauge"
  | "sparkline"
  | "radar"
  | "heatmap"
  | "calendar"
  | "sankey"
  | "funnel"
  | "candlestick"
  | "treemap"
  | "scatter"
  | "map"
  | "globe"
  | "chart";

export const DEFAULT_LABELS: ChartLabels = {
  showData: "Show data",
  hideData: "Hide data",
  tableCaption: "{title} — data",
  exportPng: "PNG",
  exportSvg: "SVG",
  exportCsv: "CSV",
  loading: "Loading chart…",
  empty: "No data for this period yet.",
  error: "The chart could not be loaded.",
  keyboardHint: "Use the arrow keys to move between points, Home and End to jump to the ends.",
  roleDescription: "chart",
  summaryIntro: "{kind}, {count}.",
  summarySeries: "{label}: from {first} to {last}",
  summaryRange: "lowest {min} ({minAt}), highest {max} ({maxAt})",
  summaryTrendUp: "up {change}",
  summaryTrendDown: "down {change}",
  summaryTrendFlat: "stable",
  summaryTotal: "total {total}",
  summaryThreshold: "{label} at {value}",
  summaryShare: "{label} {value} ({share})",
  summaryCorrelation: "correlation {r}",
  summaryConversion: "{from} → {to} {rate}",
  summaryOverall: "overall {rate}",
  summaryPeak: "peak {value} ({at})",
  summaryActive: "{count} with a value",
  summaryOhlc: "opened at {open}, closed at {close}, low {low}, high {high}",
  kinds: {
    line: "Line chart",
    area: "Area chart",
    bar: "Bar chart",
    pie: "Pie chart",
    donut: "Donut chart",
    gauge: "Gauge",
    sparkline: "Sparkline",
    radar: "Radar chart",
    heatmap: "Heatmap",
    calendar: "Calendar heatmap",
    sankey: "Flow diagram",
    funnel: "Funnel",
    candlestick: "Candlestick chart",
    treemap: "Treemap",
    scatter: "Scatter chart",
    map: "Map",
    globe: "Globe",
    chart: "Chart",
  },
  category: "Category",
  value: "Value",
  total: "Total",
  noValue: "—",
};

/** The words an app or a chart passes: any of them, and any of the chart names. */
export type ChartLabelsInput = Partial<Omit<ChartLabels, "kinds">> & { kinds?: Partial<Record<ChartKind, string>> };

/** The default labels with an app's and a chart's on top (`kinds` merged too). */
export function mergeLabels(...layers: (ChartLabelsInput | undefined)[]): ChartLabels {
  let out = DEFAULT_LABELS;
  for (const layer of layers) {
    if (!layer) continue;
    out = { ...out, ...layer, kinds: { ...out.kinds, ...layer.kinds } };
  }
  return out;
}

/** A sentence's first letter in upper case (a template that may open a sentence: `total {total}`). */
export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/** `{name}` → its value; an unknown placeholder stays as written. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match));
}
