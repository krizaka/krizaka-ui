"use client";
// A key figure with its trend and, under it, the shape of the period: the kit's Stat with a Sparkline in its chart
// slot. The change against the previous period is computed here and written in words (the arrow is decoration);
// `good="down"` for a figure that is better when it falls (latency, failures): the arrow's colour follows.
import { getNumberFormat } from "@krizaka/intl";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Stat, type StatProps } from "@krizaka/ui/stat";
import type { ReactNode } from "react";

import { valueFormatter } from "../core/format";
import { fill } from "../core/labels";
import type { SeriesColor, ValueFormat } from "../core/types";
import { Sparkline } from "../sparkline/sparkline";
import type { ChartsSettings } from "../web/context";
import { useChartSettings } from "../web/context";
import { ChartStyles } from "../web/styles";

export interface KpiStatProps extends ChartsSettings, Omit<StatProps, "value" | "trend" | "trendLabel" | "chart" | "label" | "color"> {
  /** What the figure is (“Jobs”). */
  label: string;
  /** The figure for the period. */
  value: number;
  /** How it is written. Default `"number"`. */
  format?: ValueFormat;
  /** The same figure for the previous period: the trend is computed from it. */
  previous?: number;
  /** Which direction is good news. Default `"up"`; `"down"` for latency, failures, spend. */
  good?: "up" | "down";
  /** The shape of the period, oldest first (`null` for a gap). Without it, no sparkline. */
  data?: readonly (number | null)[];
  /** The labels of `data` (dates), for the sparkline's summary and table. */
  categories?: readonly unknown[];
  /** `bar` for discrete counts (jobs per day), `area` (default) or `line`. */
  variant?: "line" | "area" | "bar";
  /** The sparkline's colour. Default: the brand's. */
  color?: SeriesColor;
  /** Your own words for the change instead of “+12 % vs previous period”. */
  trendLabel?: ReactNode;
}

const FLAT = 0.005;

/** A key figure, its change against the previous period and the shape of the period. */
export function KpiStat({ label, value, format, previous, good = "up", data, categories, variant = "area", color, trendLabel, hint, locale, brand, labels, className, ...rest }: KpiStatProps) {
  const settings = useChartSettings({ locale, brand, labels });
  const write = valueFormatter(format, settings.locale, settings.labels.noValue);
  const change = previous === undefined ? null : previous === 0 ? (value === 0 ? 0 : null) : value / previous - 1;
  const direction = change === null ? undefined : Math.abs(change) < FLAT ? "flat" : change > 0 ? "up" : "down";
  const tag = Array.isArray(settings.locale) ? settings.locale[0] : (settings.locale as string);
  const pct = change === null ? null : getNumberFormat(settings.locale, { style: "percent", maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(change);
  const words = trendLabel ?? (pct !== null ? fill(settings.labels.trendVsPrevious, { change: pct }) : undefined);
  const plain = format === undefined || format === "number" || format === "integer";
  const figure = plain ? <NumberTicker value={value} locale={tag} format={{ maximumFractionDigits: format === "number" || format === undefined ? 2 : 0 }} /> : write(value);

  return (
    <div className="kzc-kpistat" data-good={good} data-brand={settings.brand}>
      <ChartStyles />
      <Stat
        className={className}
        label={label}
        value={figure}
        hint={hint}
        trend={direction}
        trendLabel={direction && words ? words : undefined}
        chart={data && data.length > 1 ? <Sparkline title={label} data={data} categories={categories} variant={variant} color={color} format={format} height={40} locale={settings.locale} brand={settings.brand} labels={labels} /> : undefined}
        {...rest}
      />
    </div>
  );
}
