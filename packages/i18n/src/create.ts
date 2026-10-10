import { plural } from "@krizaka/intl/plural";

import { format, isPluralMessage } from "./format";
import type { Dictionary, Translate, Values } from "./types";

export interface CreateI18nOptions<L extends string> {
  /** The reference locale: its catalogue gives the shape, and anything unknown falls back to it. */
  defaultLocale: L;
}

export interface I18n<D extends Dictionary, L extends string = string> {
  /** The supported locales, in the order the catalogues were given. */
  readonly locales: readonly L[];
  readonly defaultLocale: L;
  /** True when the value is a supported locale. */
  isLocale(value: unknown): value is L;
  /** Narrows any value (a route segment, a cookie) to a supported locale: the default one for anything else. */
  asLocale(value: unknown): L;
  /** The whole catalogue of a locale (the default one for an unknown locale) — for Server Components and branches. */
  getDictionary(locale: unknown): D;
  /** The translator bound to a locale: `translator("fr")("auction.bids", { count: 3 })`. */
  translator(locale: unknown): Translate<D>;
  /** The translator of the default locale. */
  t: Translate<D>;
  /** `{placeholder}` replacement, the same function as the package's `format`. */
  format: typeof format;
}

function lookup(dictionary: Dictionary, key: string): unknown {
  let node: unknown = dictionary;
  for (const part of key.split(".")) {
    if (!node || typeof node !== "object" || Array.isArray(node) || !Object.hasOwn(node, part)) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

/**
 * A translator over one catalogue: `messages` for `locale` (its plural rules), then `fallback` for a missing key, then
 * the key itself. `createI18n` builds its translators with it; `@krizaka/i18n/react` uses it for a provider given only
 * the active catalogue (`<I18nProvider messages>`).
 */
export function createTranslator<D extends Dictionary>(locale: string, messages: D, fallback?: Dictionary): Translate<D> {
  const translate = (key: string, values?: Values): string => {
    let message = lookup(messages, key);
    if (message === undefined && fallback) message = lookup(fallback, key);
    if (typeof message === "string") return format(message, values);
    if (isPluralMessage(message)) {
      const count = Number(values?.count);
      return format(Number.isFinite(count) ? plural(count, locale, message) : message.other, values);
    }
    return key;
  };
  return translate as Translate<D>;
}

/**
 * The i18n engine of a Krizaka app, bound to its catalogues:
 *
 * ```ts
 * import en from "@/messages/en.json";
 * import fr from "@/messages/fr.json";
 * export const i18n = createI18n<typeof en, "en" | "fr">({ en, fr }, { defaultLocale: "en" });
 * i18n.t("auction.phase.SOLD");                  // typed key
 * i18n.translator("fr")("auction.bids", { count: 2 }); // plural set → @krizaka/intl's plural rules
 * ```
 *
 * Giving the type arguments makes every catalogue type-check against the reference: a key missing from `fr.json`
 * fails to compile. A key missing at run time falls back to the default locale, then to the key itself (visible,
 * never an empty string).
 */
export function createI18n<D extends Dictionary, L extends string = string>(
  dictionaries: Readonly<Record<L, D>>,
  options: CreateI18nOptions<NoInfer<L>>,
): I18n<D, L> {
  const { defaultLocale } = options;
  const locales = Object.keys(dictionaries) as L[];
  if (!locales.includes(defaultLocale)) {
    throw new RangeError(`createI18n: no catalogue for the default locale "${defaultLocale}".`);
  }

  const isLocale = (value: unknown): value is L => typeof value === "string" && locales.includes(value as L);
  const asLocale = (value: unknown): L => (isLocale(value) ? value : defaultLocale);
  const getDictionary = (locale: unknown): D => dictionaries[asLocale(locale)];

  const translator = (locale: unknown): Translate<D> => {
    const current = asLocale(locale);
    return createTranslator(current, dictionaries[current], current === defaultLocale ? undefined : dictionaries[defaultLocale]);
  };

  return {
    locales,
    defaultLocale,
    isLocale,
    asLocale,
    getDictionary,
    translator,
    t: translator(defaultLocale),
    format,
  };
}
