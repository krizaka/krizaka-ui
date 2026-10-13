// Platform-neutral: an amount typed in a field ↔ integer minor units (cents), never a float on the way.
import { currencyDigits } from "@krizaka/intl";

/** The decimal separator of a locale (`en` → `.`, `fr` → `,`). */
export function decimalSeparator(locale: string): string {
  return new Intl.NumberFormat(locale).formatToParts(1.5).find((p) => p.type === "decimal")?.value ?? ".";
}

/** The currency's sign in a locale (`USD`, `en-US` → `$`; `EUR`, `fr` → `€`). */
export function currencySymbol(currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")?.value ?? currency;
}

/**
 * An amount as typed (`12.5`, `12,50`, `1,234.56`, `1 234,56`) → integer minor units (`1250`). `undefined` when empty,
 * `null` when it is not an amount (letters, more decimals than the currency has).
 */
export function parseMoney(text: string, currency: string, locale = "en"): number | null | undefined {
  const digits = currencyDigits(currency);
  const t = text.replace(/[\s\u00a0\u202f']/g, "");
  if (!t) return undefined;
  const negative = t.startsWith("-");
  const body = negative ? t.slice(1) : t;
  if (!/^[\d.,]+$/.test(body)) return null;
  let int = body;
  let frac = "";
  const last = Math.max(body.lastIndexOf("."), body.lastIndexOf(","));
  if (last >= 0) {
    const tail = body.slice(last + 1);
    // The last separator is the decimal one when it is the locale's, or when it is not followed by a group of three.
    if (body[last] === decimalSeparator(locale) || tail.length !== 3) {
      if (tail.length > digits || !/^\d*$/.test(tail)) return null;
      int = body.slice(0, last);
      frac = tail;
    }
  }
  // What is left before the decimals: digits, grouped by three when separated (`1,234,567`).
  if (!/^(\d*|\d{1,3}([.,]\d{3})+)$/.test(int)) return null;
  int = int.replace(/[.,]/g, "");
  if (!int && !frac) return null;
  const units = BigInt(int || "0") * 10n ** BigInt(digits) + BigInt((frac || "").padEnd(digits, "0") || "0");
  const value = Number(negative ? -units : units);
  return Number.isSafeInteger(value) ? value : null;
}

/** Minor units as the field writes them while editing (`1250`, `USD`, `fr` → `12,50`): no symbol, no grouping. */
export function moneyInputText(minorUnits: number | null | undefined, currency: string, locale = "en"): string {
  if (minorUnits === null || minorUnits === undefined || !Number.isFinite(minorUnits)) return "";
  const digits = currencyDigits(currency);
  const sign = minorUnits < 0 ? "-" : "";
  const abs = String(Math.abs(Math.trunc(minorUnits))).padStart(digits + 1, "0");
  return digits === 0 ? sign + abs : `${sign}${abs.slice(0, -digits)}${decimalSeparator(locale)}${abs.slice(-digits)}`;
}
