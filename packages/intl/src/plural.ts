import { getPluralRules, type Locale } from "./cache";

/**
 * The forms of one message, by CLDR plural category. `other` is required (every language has it); `one`, `two`,
 * `few`, `many` are used where the locale has them; `zero` is an explicit form for a count of exactly 0, in any
 * language ("no bids" rather than "0 bids").
 */
export interface PluralForms<T = string> {
  zero?: T;
  one?: T;
  two?: T;
  few?: T;
  many?: T;
  other: T;
}

/**
 * The form that fits the count in this locale (Intl.PluralRules): `plural(1, "en-US", { one: "bid", other: "bids" })`
 * → `"bid"`; in French 0 and 1 are both `one`. A missing category falls back to `other`.
 */
export function plural<T = string>(count: number, locale: Locale, forms: PluralForms<T>): T {
  if (count === 0 && forms.zero !== undefined) return forms.zero;
  const category = getPluralRules(locale).select(count);
  return forms[category] ?? forms.other;
}
