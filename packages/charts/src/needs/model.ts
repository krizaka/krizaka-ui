// The arithmetic of the ready-made charts (EarningsChart, JobThroughput, LatencyChart, CreditUsage, GoalProgress,
// PriceTicker), shared by the web and React Native: totals, the change between the last two periods, a success rate,
// the day a balance runs out at the current pace. Pure functions: no React, no DOM.
import { currencyDigits, getNumberFormat } from "@krizaka/intl";

import type { Accessor, Datum, Locale } from "../core/types";

/** Reads a field (or calls a function) of a row; `null` for anything that is not a finite number. */
export function numberOf<T extends Datum>(row: T, accessor: Accessor<T, number | null | undefined>, index: number): number | null {
  const value = typeof accessor === "function" ? accessor(row, index) : (row as Record<string, unknown>)[accessor];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** The sum of a column, `null` values left out. */
export function total<T extends Datum>(rows: readonly T[], accessor: Accessor<T, number | null | undefined>): number {
  return rows.reduce((sum, row, i) => sum + (numberOf(row, accessor, i) ?? 0), 0);
}

/**
 * The change of the last period against the one before, as a ratio (`0.12` = +12 %): `null` when it cannot be said
 * (fewer than two periods, a previous period at zero or missing).
 */
export function lastChange(values: readonly (number | null)[]): number | null {
  if (values.length < 2) return null;
  const last = values[values.length - 1];
  const previous = values[values.length - 2];
  if (last == null || previous == null || previous === 0) return null;
  return last / previous - 1;
}

/** `up`, `down` or `flat` (within ±0.5 %): the direction of a change, `null` when there is none. */
export function direction(change: number | null): "up" | "down" | "flat" | null {
  if (change == null) return null;
  return Math.abs(change) < 0.005 ? "flat" : change > 0 ? "up" : "down";
}

/** Succeeded out of finished (succeeded + failed); `null` when nothing finished. */
export function successRate(succeeded: number, failed: number): number | null {
  const finished = succeeded + failed;
  return finished > 0 ? succeeded / finished : null;
}

/**
 * When a balance runs out at the pace of the last `days` days of use (oldest first): the number of whole days left,
 * or `null` when nothing is being used (it never runs out) or there is no history.
 */
export function daysLeft(remaining: number, daily: readonly (number | null)[], days = 7): number | null {
  const recent = daily.slice(-days).filter((v): v is number => v != null && v >= 0);
  if (recent.length === 0) return null;
  const pace = recent.reduce((a, b) => a + b, 0) / recent.length;
  if (pace <= 0) return null;
  return Math.max(0, Math.floor(remaining / pace));
}

/** `from` + `days` days, at the same time of day. */
export const addDays = (from: Date, days: number) => new Date(from.getTime() + days * 86_400_000);

/** The level of a quota: `ok` below `warning` (default 0.8), `warning` below `danger` (0.95), then `danger`. */
export function quotaLevel(ratio: number, warning = 0.8, danger = 0.95): "ok" | "warning" | "danger" {
  return ratio >= danger ? "danger" : ratio >= warning ? "warning" : "ok";
}

/** Replaces `{name}` placeholders. */
export function fillIn(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** A signed ratio as a percentage for a change (`+12 %`, `−3 %`), in the locale's way. */
export function signedPercent(change: number, locale: Locale): string {
  return getNumberFormat(locale, { style: "percent", signDisplay: "exceptZero", maximumFractionDigits: Math.abs(change) < 0.1 ? 1 : 0 }).format(change);
}

/** Milliseconds as a duration: `840 ms`, `1.2 s`, `2.5 min` — the unit follows the size, through Intl. */
export function formatDuration(ms: number, locale: Locale): string {
  const unit = (value: number, name: string, digits: number) =>
    getNumberFormat(locale, { style: "unit", unit: name, unitDisplay: "short", maximumFractionDigits: digits }).format(value);
  const abs = Math.abs(ms);
  if (abs < 1000) return unit(Math.round(ms), "millisecond", 0);
  if (abs < 60_000) return unit(ms / 1000, "second", abs < 10_000 ? 1 : 0);
  if (abs < 3_600_000) return unit(ms / 60_000, "minute", 1);
  return unit(ms / 3_600_000, "hour", 1);
}

/** Money in minor units, without the cents of a round amount (`$500`, `$262.50`): a goal reads as people say it. */
export function roundMoney(currency: string): (value: number, locale: Locale) => string {
  const digits = currencyDigits(currency);
  return (value, locale) => {
    const minor = Math.round(value);
    const whole = minor % 10 ** digits === 0;
    return getNumberFormat(locale, { style: "currency", currency, minimumFractionDigits: whole ? 0 : digits, maximumFractionDigits: whole ? 0 : digits }).format(minor / 10 ** digits);
  };
}
