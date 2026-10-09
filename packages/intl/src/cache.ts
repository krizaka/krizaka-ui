/**
 * One Intl formatter per (locale, options), built once and reused: constructing an Intl object is the expensive part,
 * formatting with it is cheap. The key is the locale plus the options in a stable order.
 */

/** A BCP 47 locale (`"en-US"`, `"fr-CA"`) or a priority list of them. Always explicit: never the runtime's default. */
export type Locale = string | readonly string[];

const cache = new Map<string, unknown>();

function keyOf(kind: string, locale: Locale, options: object): string {
  const entries = Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : 1));
  return `${kind}|${String(locale)}|${JSON.stringify(entries)}`;
}

function cached<T>(kind: string, locale: Locale, options: object, create: () => T): T {
  const key = keyOf(kind, locale, options);
  let formatter = cache.get(key) as T | undefined;
  if (formatter === undefined) {
    formatter = create();
    cache.set(key, formatter);
  }
  return formatter;
}

/** The cached `Intl.NumberFormat` for these locale and options. */
export function getNumberFormat(locale: Locale, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  return cached("number", locale, options, () => new Intl.NumberFormat(locale as string | string[], options));
}

/** The cached `Intl.DateTimeFormat` for these locale and options. */
export function getDateTimeFormat(locale: Locale, options: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat {
  return cached("date", locale, options, () => new Intl.DateTimeFormat(locale as string | string[], options));
}

/** The cached `Intl.RelativeTimeFormat` for these locale and options. */
export function getRelativeTimeFormat(
  locale: Locale,
  options: Intl.RelativeTimeFormatOptions = {},
): Intl.RelativeTimeFormat {
  return cached("relative", locale, options, () => new Intl.RelativeTimeFormat(locale as string | string[], options));
}

/** The cached `Intl.PluralRules` for these locale and options. */
export function getPluralRules(locale: Locale, options: Intl.PluralRulesOptions = {}): Intl.PluralRules {
  return cached("plural", locale, options, () => new Intl.PluralRules(locale as string | string[], options));
}
