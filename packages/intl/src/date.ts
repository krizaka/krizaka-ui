import { getDateTimeFormat, getRelativeTimeFormat, type Locale } from "./cache";

/** A date as a `Date`, an epoch in milliseconds or an ISO 8601 string. */
export type DateInput = Date | number | string;

export interface FormatDateOptions {
  locale: Locale;
  /** `short` → `10/9/26`, `medium` (default) → `Oct 9, 2026`, `long` → `October 9, 2026` (en-US). */
  style?: "short" | "medium" | "long";
  /** Adds the time of day in this style. */
  timeStyle?: "short" | "medium" | "long";
  /** IANA time zone (`"UTC"`, `"America/Montreal"`). Default: the runtime's — pass it when server and client differ. */
  timeZone?: string;
}

function toDate(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid date: ${String(input)}`);
  return date;
}

/** A calendar date in the locale's own order and words. */
export function formatDate(date: DateInput, { locale, style = "medium", timeStyle, timeZone }: FormatDateOptions): string {
  return getDateTimeFormat(locale, { dateStyle: style, timeStyle, timeZone }).format(toDate(date));
}

export interface FormatRelativeOptions {
  locale: Locale;
  /** The reference instant. Default: `Date.now()` — inject it for tests and for a stable server render. */
  now?: DateInput;
  /** `auto` (default) says "yesterday", "next month"; `always` says "1 day ago", "in 1 month". */
  numeric?: "auto" | "always";
  /** Default `long`. */
  style?: "long" | "short" | "narrow";
}

/** Each unit and how many of it make the next one (a month is 365.25 / 12 days). */
const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 365.25 / 12 / 7],
  ["month", 12],
  ["year", Number.POSITIVE_INFINITY],
];

/**
 * How far a date is from now, in the largest unit that keeps a whole number readable: `−45 s` → `"45 seconds ago"`,
 * `−3 h` → `"3 hours ago"`, `+31 days` → `"next month"`. Rounds to the nearest unit.
 */
export function formatRelative(
  date: DateInput,
  { locale, now = Date.now(), numeric = "auto", style = "long" }: FormatRelativeOptions,
): string {
  let value = (toDate(date).getTime() - toDate(now).getTime()) / 1000;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [name, size] of UNITS) {
    unit = name;
    // Moves up once the rounded value would reach the next unit (59.6 s reads "1 minute", not "60 seconds").
    if (Math.abs(value) < size - 0.5) break;
    value /= size;
  }
  // `+ 0` turns a −0 into 0 ("now", not "0 seconds ago").
  return getRelativeTimeFormat(locale, { numeric, style }).format(Math.round(value) + 0, unit);
}
