import type { Price } from "./port";

/** A price in the visitor's language: « $39 » in English, « 39 $ » in French (Canadian conventions); cents only when there are some. */
export function formatPrice(price: Price, locale: "en" | "fr"): string {
  const whole = price.amount % 100 === 0;
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: price.currency.toUpperCase(),
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(price.amount / 100);
}
