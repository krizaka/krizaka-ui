// The vocabulary every chart shares, web and React Native: rows of data, the series drawn from them, how a value and
// a category are written, thresholds and markers. Pure types: no React, no DOM.

/** A row of data: any object; the chart reads the fields its `x`, `y` and `series` name. */
export type Datum = object;

/** A field of a row (`"month"`) or a function that reads it. */
export type Accessor<T, V> = (keyof T & string) | ((datum: T, index: number) => V);

/**
 * A Krizaka brand: its palette leads with the brand's own hue (Krizaka blue, Orazaka orange).
 * `"orochia"` (violet) is @deprecated Paused product (2026-10-25); removed in the next major.
 */
export type BrandId = "krizaka" | "orazaka" | "orochia";

/** A BCP 47 locale (`"en-US"`, `"fr-FR"`), always explicit: server and client write the same figures. */
export type Locale = string | readonly string[];

/**
 * How a value is written, through `@krizaka/intl`:
 * - `"number"` (default) `12,345.6`, `"integer"` `12,346`, `"compact"` `12.3K`, `"percent"` (a ratio: `0.42` → `42%`);
 * - `{ style: "money", currency }`: the values are **integer minor units** (cents), as the ledger stores them;
 * - `{ style: "unit", unit }`: an `Intl` unit (`"second"`, `"megabyte"`);
 * - a function, for anything else.
 */
export type ValueFormat =
  | "number"
  | "integer"
  | "compact"
  | "percent"
  | { readonly style: "money"; readonly currency: string; readonly compact?: boolean }
  | { readonly style: "unit"; readonly unit: string; readonly compact?: boolean }
  | { readonly style: "number"; readonly options: Intl.NumberFormatOptions }
  | ((value: number, locale: Locale) => string);

/**
 * How a category of the x axis is written. A category that is a `Date`, an epoch or an ISO date (`"2026-04"`,
 * `"2026-04-12"`) is a date: `"month"` (`Apr 2026`), `"day"` (`Apr 12`), `"date"` (`Apr 12, 2026`), `"time"`
 * (`14:30`), `"datetime"`, `"year"`. `"text"` writes it as is (the default for anything that is not a date).
 */
export type CategoryFormat =
  | "text"
  | "year"
  | "month"
  | "day"
  | "date"
  | "time"
  | "datetime"
  | ((category: unknown, locale: Locale) => string);

/** A series to draw: the field holding its values and the words that name it. */
export interface SeriesSpec<T extends Datum = Datum> {
  /** The field (or a function) holding the series' value in each row. */
  readonly key: Accessor<T, number | null | undefined>;
  /** Its name: in the legend, the tooltip, the data table and the summary. */
  readonly label: string;
  /** A colour role instead of the next palette slot: `"accent"`, a status (`"success"`…) or a `var(--…)`. */
  readonly color?: SeriesColor;
  /** Draw it dashed (a forecast, a previous period). Lines and areas only. */
  readonly dashed?: boolean;
}

/** A status or brand role a series, a threshold or a marker may wear instead of a palette slot. */
export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

/** A palette slot (1–8), a tone, or any CSS colour (`var(--kz-…)` preferred). */
export type SeriesColor = Tone | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | (string & {});

/** A horizontal line at a value: a goal, a payout threshold, a quota. */
export interface Threshold {
  readonly value: number;
  /** What it means, written beside the line and in the summary: “Payout threshold”. */
  readonly label: string;
  /** Default `"neutral"`; a goal reads well in `"success"`, a limit in `"danger"`. */
  readonly tone?: Tone;
}

/** A vertical marker at a category: an event worth pointing at (“Campaign launch”). */
export interface Marker {
  /** The category it marks, as in the data (`"2026-04"`). */
  readonly x: unknown;
  readonly label: string;
  readonly tone?: Tone;
}

/** What a series says about itself, for the written summary. */
export interface SeriesSummary {
  readonly label: string;
  readonly count: number;
  readonly min: { readonly value: number; readonly category: string } | null;
  readonly max: { readonly value: number; readonly category: string } | null;
  readonly first: number | null;
  readonly last: number | null;
  readonly total: number;
  /** `last / first − 1`, or null when it cannot be said (no first value, a first value of 0). */
  readonly change: number | null;
  readonly trend: "up" | "down" | "flat" | "none";
}
