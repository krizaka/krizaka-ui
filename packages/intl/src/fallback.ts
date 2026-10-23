import type { Locale } from "./cache";

/** The first supported language in the explicit locale priority list, never the runtime default. */
export function fallbackLanguage(locale: Locale): string | undefined {
  const locales = typeof locale === "string" ? [locale] : locale;
  return locales
    .map((tag) => tag.toLowerCase().split("-")[0])
    .find((language) => language === "en" || language === "fr");
}

/** Minimal CLDR cardinal selection without digit options; unsupported languages use `other`. */
export function selectCardinal(count: number, language: string | undefined): Intl.LDMLPluralRule {
  const value = Math.abs(count);
  if (!Number.isFinite(value)) return "other";
  if (language === "en" && value === 1) return "one";
  if (language === "fr") {
    if (value < 2) return "one";
    if (value % 1_000_000 === 0) return "many";
  }
  return "other";
}

const UNITS = ["second", "minute", "hour", "day", "week", "month", "quarter", "year"];
const FRENCH_UNITS = ["seconde", "minute", "heure", "jour", "semaine", "mois", "trimestre", "an"];

function displayedMagnitude(value: number, numbers: Intl.NumberFormat): number {
  const parts = numbers.formatToParts(Math.abs(value));
  const integer = parts.filter((part) => part.type === "integer").map((part) => part.value).join("");
  const fraction = parts.filter((part) => part.type === "fraction").map((part) => part.value).join("");
  const digits = Array.from({ length: 10 }, (_, digit) => [
    numbers.formatToParts(digit).find((part) => part.type === "integer")?.value ?? String(digit),
    String(digit),
  ] as const).sort(([left], [right]) => right.length - left.length);
  const normalizeDigits = (value: string) =>
    digits.reduce((result, [localized, ascii]) => result.replaceAll(localized, ascii), value);
  return Number(`${normalizeDigits(integer)}${fraction ? `.${normalizeDigits(fraction)}` : ""}`);
}

/** Long numeric relative text (en/fr; English wording otherwise), using the cached number formatter. */
export function relativeText(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: string | undefined,
  numbers: Intl.NumberFormat,
): string {
  const singular = unit.replace(/s$/, "");
  const index = UNITS.indexOf(singular);
  if (!Number.isFinite(value) || index < 0) throw new RangeError("Invalid relative time");
  const french = language === "fr";
  const name = french ? FRENCH_UNITS[index] : singular;
  const plural = selectCardinal(displayedMagnitude(value, numbers), french ? "fr" : "en") !== "one";
  const suffix = plural && !(french && singular === "month") ? "s" : "";
  const text = `${numbers.format(Math.abs(value))} ${name}${suffix}`;
  const past = value < 0 || Object.is(value, -0);
  if (french) return past ? `il y a ${text}` : `dans ${text}`;
  return past ? `${text} ago` : `in ${text}`;
}
