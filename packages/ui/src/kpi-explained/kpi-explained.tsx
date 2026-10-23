// Server-safe. A figure whose meaning, formula, source and freshness travel with its value.
import { type DateInput, formatDate, formatMoney, formatNumber, formatPercent, type Locale } from "@krizaka/intl";
import * as React from "react";

export type KpiNumberOptions = Omit<Intl.NumberFormatOptions, "style" | "currency" | "currencyDisplay">;

export type KpiFormat =
  | { type: "money"; currency: string; minorUnitDigits?: number }
  | { type: "number"; options?: KpiNumberOptions }
  | { type: "percent"; options?: KpiNumberOptions };

export type KpiState = "ok" | "watch" | "act";

export interface KpiExplainedProps extends Omit<React.ComponentProps<"article">, "children"> {
  /** The figure's name. */
  label: React.ReactNode;
  /** The raw number: money is integer minor units; percentages are ratios such as 0.125. */
  value: number;
  /** How to format the value with `@krizaka/intl`. */
  format: KpiFormat;
  /** The app's locale, e.g. `fr-CA`. */
  locale: Locale;
  /** One plain-language sentence about what the figure means. */
  meaning: string;
  /** The localized label for the formula row. */
  formulaLabel: React.ReactNode;
  /** The calculation in words, e.g. “dépenses TTC ÷ ventes TTC”. */
  formula: string;
  /** The localized label for the source row. */
  sourceLabel: React.ReactNode;
  /** The source link or file name, supplied by the host. */
  source: React.ReactNode;
  /** A host-provided action such as “Verify”, next to the source. */
  verify?: React.ReactNode;
  /** Host-provided thresholds in the same units as `value`. */
  thresholds: {
    direction: "above" | "below";
    watchAt: number;
    actAt: number;
  };
  /** Host-provided words for the derived state. */
  stateLabels: Record<KpiState, React.ReactNode>;
  /** Reading time and the expected next reading time (the host derives it from its cadence). */
  freshness: {
    lastRead: DateInput;
    expectedAt: DateInput;
    now: DateInput;
    lastReadLabel: React.ReactNode;
    staleLabel: React.ReactNode;
  };
  /** An optional Sparkline from `@krizaka/charts`, with its own accessible summary. */
  sparkline?: React.ReactNode;
  /** Replace every non-space character in the value while preserving its formatted shape. */
  masked?: boolean;
  /** The accessible name shown instead of the value when masked. */
  maskedLabel: string;
}

function formatValue(value: number, format: KpiFormat, locale: Locale): string {
  switch (format.type) {
    case "money":
      return formatMoney(value, { currency: format.currency, locale, minorUnitDigits: format.minorUnitDigits });
    case "percent":
      return formatPercent(value, { locale, ...format.options });
    case "number":
      return formatNumber(value, { locale, ...format.options });
  }
}

function stateFor(value: number, thresholds: KpiExplainedProps["thresholds"]): KpiState {
  if (thresholds.direction === "above") {
    return value >= thresholds.actAt ? "act" : value >= thresholds.watchAt ? "watch" : "ok";
  }
  return value <= thresholds.actAt ? "act" : value <= thresholds.watchAt ? "watch" : "ok";
}

function maskValue(value: string): string {
  return value.replace(/[^\s]/gu, "•");
}

/** A key figure that explains what it means, how it is calculated and where it came from. */
export function KpiExplained({
  label,
  value,
  format,
  locale,
  meaning,
  formulaLabel,
  formula,
  sourceLabel,
  source,
  verify,
  thresholds,
  stateLabels,
  freshness,
  sparkline,
  masked = false,
  maskedLabel,
  className,
  ...props
}: KpiExplainedProps) {
  const id = React.useId();
  const state = stateFor(value, thresholds);
  const formattedValue = formatValue(value, format, locale);
  const lastRead = new Date(freshness.lastRead);
  const stale = new Date(freshness.now) >= new Date(freshness.expectedAt);

  return (
    <article aria-labelledby={`${id}-label`} className={["kz-kpi", className].filter(Boolean).join(" ")} data-state={state} {...props}>
      <header className="kz-kpi-head">
        <h3 id={`${id}-label`} className="kz-kpi-label">{label}</h3>
        <span className="kz-kpi-state" data-state={state}>{stateLabels[state]}</span>
      </header>
      <p className="kz-kpi-value" aria-label={masked ? maskedLabel : undefined}>
        {masked ? maskValue(formattedValue) : formattedValue}
      </p>
      <p className="kz-kpi-meaning">{meaning}</p>
      <dl className="kz-kpi-details">
        <div><dt>{formulaLabel}</dt><dd>{formula}</dd></div>
        <div><dt>{sourceLabel}</dt><dd>{source}{verify ? <span className="kz-kpi-verify">{verify}</span> : null}</dd></div>
      </dl>
      <p className="kz-kpi-freshness">
        <span>{freshness.lastReadLabel}: </span>
        <time dateTime={lastRead.toISOString()}>{formatDate(lastRead, { locale, style: "medium", timeStyle: "short" })}</time>
        {stale ? <span className="kz-kpi-stale" role="status">{freshness.staleLabel}</span> : null}
      </p>
      {sparkline ? <div className="kz-kpi-sparkline">{sparkline}</div> : null}
    </article>
  );
}
