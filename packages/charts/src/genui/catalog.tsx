"use client";
// The data entries of `krizaka:genui/v1` (ADR-082): `KpiStat` and `ChartCard`, drawn with this package's components.
// Merge with @krizaka/ui's base catalog: `{ ...baseGenUiCatalog, ...chartsGenUiCatalog }`. The checks are strict — a
// property outside the list, a format outside the closed list or data that is not a list of rows refuses the message.
import { allowKeys, checkBinding, checkCurrency, checkEnum, checkNumber, checkText, GENUI_FORMATS, type GenUiCatalog, type GenUiComponent, type GenUiEntry, type GenUiFormat } from "@krizaka/ui/genui";

import { BarChart } from "../bar/bar-chart";
import { ChartCard } from "../card/chart-card";
import { KpiStat } from "../card/kpi-stat";
import type { ValueFormat } from "../core/types";
import { AreaChart, LineChart } from "../line/line-chart";
import { PieChart } from "../pie/pie-chart";

/** The most rows a generated chart draws (a year of days). */
// @fixed: a safety bound of the renderer against an oversized model answer (one leap year of daily points), not a business parameter
export const GENUI_CHART_ROWS = 366;
const KINDS = ["line", "bar", "area", "pie"] as const;
const first = (...problems: (string | null)[]) => problems.find((p) => p !== null) ?? null;
const KEY = /^[A-Za-z0-9_]{1,64}$/;

/** A closed format of the spec as the charts' `ValueFormat`. */
export function chartFormat(format: unknown, currency: unknown): ValueFormat {
  if (format === "money" && typeof currency === "string") return { style: "money", currency };
  if (format === "integer" || format === "compact" || format === "percent") return format;
  return "number";
}

const text = (value: unknown) => (typeof value === "string" ? value : typeof value === "number" ? String(value) : "");
const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);

const kpiStat: GenUiEntry = {
  check: (c) =>
    first(
      allowKeys(c, ["label", "value", "previous", "format", "currency", "good"]),
      checkText(c.label, "label", true),
      checkNumber(c.value, "value", true),
      checkNumber(c.previous, "previous", false),
      checkEnum(c.format, "format", GENUI_FORMATS),
      checkCurrency(c.currency, c.format === "money"),
      checkEnum(c.good, "good", ["up", "down"]),
    ),
  render: (c, ctx) => (
    <KpiStat
      label={text(ctx.resolve(c.label))}
      value={num(ctx.resolve(c.value)) ?? 0}
      previous={num(ctx.resolve(c.previous))}
      format={chartFormat(c.format as GenUiFormat | undefined, c.currency)}
      good={(c.good as "up" | "down" | undefined) ?? "up"}
      locale={ctx.locale}
    />
  ),
};

function checkSeries(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 12) return "series is an array of 1 to 12";
  for (const s of value) {
    if (s === null || typeof s !== "object" || Array.isArray(s)) return "a series is an object";
    const extra = Object.keys(s).find((k) => k !== "key" && k !== "label");
    if (extra) return `a series has no key "${extra}"`;
    const { key, label } = s as Record<string, unknown>;
    if (typeof key !== "string" || !KEY.test(key)) return "a series key is 1-64 characters of [A-Za-z0-9_]";
    if (typeof label !== "string" || label.length > 80) return "a series label is a string";
  }
  return null;
}

type Row = Record<string, string | number | null>;

/** The rows a binding points at, as flat records of strings and numbers (anything else dropped). */
function rowsOf(value: unknown): Row[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, GENUI_CHART_ROWS).flatMap((r) => {
    if (r === null || typeof r !== "object" || Array.isArray(r)) return [];
    const row: Row = {};
    for (const [k, v] of Object.entries(r)) if (KEY.test(k)) row[k] = typeof v === "number" || typeof v === "string" ? v : null;
    return [row];
  });
}

function Chart({ c, rows, locale }: { c: GenUiComponent; rows: Row[]; locale: string }) {
  const series = (c.series as { key: string; label: string }[]).map((s) => ({ key: s.key, label: s.label }));
  const format = chartFormat(c.format, c.currency);
  const common = { data: rows, x: c.x as string, series, format, locale, height: 240 };
  switch (c.kind) {
    case "bar":
      return <BarChart {...common} />;
    case "area":
      return <AreaChart {...common} />;
    case "pie":
      return <PieChart data={rows} label={(r: Row) => text(r[c.x as string])} value={(r: Row) => num(r[series[0].key]) ?? 0} format={format} locale={locale} donut height={240} />;
    default:
      return <LineChart {...common} />;
  }
}

const chartCard: GenUiEntry = {
  check: (c) =>
    first(
      allowKeys(c, ["title", "insight", "kind", "x", "series", "data", "format", "currency"]),
      checkText(c.title, "title", true),
      checkText(c.insight, "insight", false),
      checkEnum(c.kind, "kind", KINDS, true),
      typeof c.x === "string" && KEY.test(c.x) ? null : "x is a column key",
      checkSeries(c.series),
      checkBinding(c.data, "data"),
      checkEnum(c.format, "format", GENUI_FORMATS),
      checkCurrency(c.currency, c.format === "money"),
    ),
  render: (c, ctx) => {
    const rows = rowsOf(ctx.resolve(c.data));
    return (
      <ChartCard title={text(ctx.resolve(c.title))} insight={c.insight === undefined ? undefined : text(ctx.resolve(c.insight))}>
        {rows.length === 0 ? <p className="text-sm text-fg-muted">{ctx.labels.noData}</p> : <Chart c={c} rows={rows} locale={ctx.locale} />}
      </ChartCard>
    );
  },
};

/** `KpiStat`, `ChartCard` — the data entries of the catalog `krizaka:genui/v1`. */
export const chartsGenUiCatalog: GenUiCatalog = { KpiStat: kpiStat, ChartCard: chartCard };
