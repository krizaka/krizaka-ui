// Values and categories written the same way in the axes, the tooltips, the data table and the summary, through
// @krizaka/intl (one cached Intl formatter per locale and options).
import { currencyDigits, formatCompact, formatDate, formatMoney, formatNumber, formatPercent, getDateTimeFormat, getNumberFormat } from "@krizaka/intl";

import type { CategoryFormat, Locale, ValueFormat } from "./types";

export type ValueFormatter = (value: number | null | undefined) => string;

/**
 * A formatter for `format`. `axis` asks for the short form of the axis ticks (money and units go compact past 10 000).
 * A missing value is written `noValue`.
 */
export function valueFormatter(format: ValueFormat = "number", locale: Locale, noValue = "—", axis = false): ValueFormatter {
  const write = writerOf(format, locale, axis);
  return (value) => (value == null || Number.isNaN(value) ? noValue : write(value));
}

function writerOf(format: ValueFormat, locale: Locale, axis: boolean): (value: number) => string {
  if (typeof format === "function") return (value) => format(value, locale);
  if (format === "integer") return (value) => formatNumber(Math.round(value), { locale, maximumFractionDigits: 0 });
  if (format === "compact") return (value) => formatCompact(value, { locale });
  if (format === "percent") return (value) => formatPercent(value, { locale, maximumFractionDigits: axis ? 0 : 1 });
  if (format === "number") {
    return (value) => (axis && Math.abs(value) >= 10_000 ? formatCompact(value, { locale }) : formatNumber(value, { locale, maximumFractionDigits: 2 }));
  }
  if (format.style === "money") {
    const { currency } = format;
    const digits = currencyDigits(currency);
    return (value) => {
      const minor = Math.round(value);
      // Compact money on the axes (`€12K`): the amount in major units, Intl's compact currency notation.
      if ((axis || format.compact) && Math.abs(minor) >= 1_000_000) {
        const options = { style: "currency", currency, currencyDisplay: "narrowSymbol", notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 1 } as const;
        return getNumberFormat(locale, options).format(minor / 10 ** digits);
      }
      // An axis tick is a round amount: no cents to write (`€2,500`, not `€2,500.00`).
      if (axis && minor % 10 ** digits === 0) {
        return getNumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(minor / 10 ** digits);
      }
      return formatMoney(minor, { currency, locale });
    };
  }
  if (format.style === "unit") {
    const { unit } = format;
    const compact = axis || format.compact;
    const options: Intl.NumberFormatOptions = { style: "unit", unit, unitDisplay: "short", ...(compact ? { notation: "compact" } : {}), maximumFractionDigits: compact ? 1 : 2 };
    return (value) => getNumberFormat(locale, options).format(value);
  }
  const { options } = format;
  return (value) => formatNumber(value, { locale, ...options });
}

/** An ISO date (`2026-04`, `2026-04-12`, `2026-04-12T14:30Z`), a `Date` or an epoch → a `Date`; anything else → null. */
export function asDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number" && value > 10_000_000_000) return new Date(value);
  if (typeof value === "string" && /^\d{4}-\d{2}(-\d{2})?([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(value)) {
    // `2026-04` is the first of April, at midnight UTC: a month never slips to March in a negative time zone.
    const iso = value.length === 7 ? `${value}-01T00:00:00Z` : value.length === 10 ? `${value}T00:00:00Z` : value;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

const DATE_OPTIONS: Record<Exclude<CategoryFormat, "text" | ((category: unknown, locale: Locale) => string)>, Intl.DateTimeFormatOptions> = {
  year: { year: "numeric", timeZone: "UTC" },
  month: { month: "short", year: "numeric", timeZone: "UTC" },
  day: { month: "short", day: "numeric", timeZone: "UTC" },
  date: { dateStyle: "medium", timeZone: "UTC" },
  time: { timeStyle: "short", timeZone: "UTC" },
  datetime: { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" },
};

export type CategoryFormatter = (category: unknown) => string;

/**
 * A formatter for the categories. Without a format, a date category is written by its precision (`2026-04` → a month,
 * `2026-04-12` → a day) and anything else as text. Dates are written in UTC, the zone of an ISO date without one:
 * pass a function for a local time.
 */
export function categoryFormatter(format: CategoryFormat | undefined, locale: Locale): CategoryFormatter {
  if (typeof format === "function") return (category) => format(category, locale);
  if (format === "text") return (category) => String(category ?? "");
  return (category) => {
    const date = asDate(category);
    if (!date) return String(category ?? "");
    const kind = format ?? guessPrecision(category);
    if (kind === "date") return formatDate(date, { locale, style: "medium", timeZone: "UTC" });
    return getDateTimeFormat(locale, DATE_OPTIONS[kind]).format(date);
  };
}

function guessPrecision(category: unknown): "month" | "date" | "datetime" {
  if (typeof category === "string") {
    if (category.length === 7) return "month";
    if (category.length === 10) return "date";
    return "datetime";
  }
  const date = asDate(category);
  return date && date.getUTCHours() === 0 && date.getUTCMinutes() === 0 ? "date" : "datetime";
}

/** A ratio for the summary and the shares: `0.236` → `24%` (one decimal under 10 %). */
export function shareFormatter(locale: Locale): (ratio: number) => string {
  return (ratio) => formatPercent(ratio, { locale, maximumFractionDigits: Math.abs(ratio) < 0.1 ? 1 : 0 });
}
