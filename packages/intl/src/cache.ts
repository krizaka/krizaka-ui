/**
 * One Intl formatter per (locale, options), built once and reused: constructing an Intl object is the expensive part,
 * formatting with it is cheap. The key is the locale plus the options in a stable order.
 */
import { fallbackLanguage, relativeText, selectCardinal } from "./fallback";

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

/** The cached relative formatter; without Intl.RelativeTimeFormat, only long numeric `format` is available. */
export function getRelativeTimeFormat(
  locale: Locale,
  options: Intl.RelativeTimeFormatOptions = {},
): Intl.RelativeTimeFormat | Pick<Intl.RelativeTimeFormat, "format"> {
  if (typeof Intl.RelativeTimeFormat !== "function") {
    return cached("relative-fallback", locale, options, () => {
      const language = fallbackLanguage(locale);
      const numbers = getNumberFormat(locale);
      return {
        format: (value: number, unit: Intl.RelativeTimeFormatUnit) => relativeText(value, unit, language, numbers),
      };
    });
  }
  return cached("relative", locale, options, () => new Intl.RelativeTimeFormat(locale as string | string[], options));
}

/** The cached plural selector; without Intl.PluralRules, only unrounded en/fr cardinal `select` is available. */
export function getPluralRules(
  locale: Locale,
  options: Intl.PluralRulesOptions = {},
): Intl.PluralRules | Pick<Intl.PluralRules, "select"> {
  if (typeof Intl.PluralRules !== "function") {
    return cached("plural-fallback", locale, options, () => {
      const language = fallbackLanguage(locale);
      return { select: (count: number) => selectCardinal(count, language) };
    });
  }
  return cached("plural", locale, options, () => new Intl.PluralRules(locale as string | string[], options));
}
