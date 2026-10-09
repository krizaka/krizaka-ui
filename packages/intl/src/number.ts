import { getNumberFormat, type Locale } from "./cache";

/** The `Intl.NumberFormat` options a number formatter accepts, plus the (required) locale. */
export type FormatNumberOptions = Omit<Intl.NumberFormatOptions, "style" | "currency" | "currencyDisplay"> & {
  locale: Locale;
};

/** A plain number with the locale's separators: `1234567.891` → `"1,234,567.891"` (en-US), `"1 234 567,891"` (fr-CA). */
export function formatNumber(value: number | bigint, { locale, ...options }: FormatNumberOptions): string {
  return getNumberFormat(locale, options).format(value);
}

/**
 * A short count for a badge or a stat: `12345` → `"12.3K"` (en-US), `"12,3 k"` (fr-CA); `1234567` → `"1.2M"`,
 * `"1,2 M"`. One decimal at most unless `maximumFractionDigits` says otherwise.
 */
export function formatCompact(
  value: number | bigint,
  { locale, maximumFractionDigits = 1, ...options }: Omit<FormatNumberOptions, "notation">,
): string {
  return getNumberFormat(locale, { ...options, notation: "compact", maximumFractionDigits }).format(value);
}

/** A ratio as a percentage: `0.125` → `"13%"` (en-US), `"13 %"` (fr-CA); pass `maximumFractionDigits` for decimals. */
export function formatPercent(ratio: number, { locale, ...options }: FormatNumberOptions): string {
  return getNumberFormat(locale, { ...options, style: "percent" }).format(ratio);
}
