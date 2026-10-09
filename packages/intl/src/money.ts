import { getNumberFormat, type Locale } from "./cache";

/** How the currency is written: `$` / `US$` (`symbol`), `USD` (`code`), always `$` (`narrowSymbol`). */
export type MoneyDisplay = "symbol" | "code" | "narrowSymbol";

export interface FormatMoneyOptions {
  /** ISO 4217 code: `"USD"`, `"EUR"`, `"JPY"`. */
  currency: string;
  locale: Locale;
  /** Default `"symbol"`. */
  display?: MoneyDisplay;
  /**
   * How many decimal digits one minor unit stands for. Default: the currency's own (Intl: JPY 0, USD 2, BHD 3).
   * Override it when the ledger counts in another unit (e.g. `3` for mills of a dollar). The amount is still shown
   * with the currency's digits, rounded half away from zero.
   */
  minorUnitDigits?: number;
}

/** The currency's minor-unit digits according to Intl (JPY 0, USD 2, BHD 3). */
export function currencyDigits(currency: string): number {
  const { maximumFractionDigits } = getNumberFormat("en", { style: "currency", currency }).resolvedOptions();
  // Always set for a currency format; the `lib` typings of some TypeScript targets mark it optional.
  /* v8 ignore next */
  return maximumFractionDigits ?? 2;
}

/** An integer of minor units as an exact decimal string (`-12345`, 2 → `"-123.45"`): no float on the way. */
function toDecimalString(minorUnits: number, digits: number): string {
  const sign = minorUnits < 0 ? "-" : "";
  const abs = BigInt(Math.abs(minorUnits)).toString();
  if (digits === 0) return sign + abs;
  const padded = abs.padStart(digits + 1, "0");
  return `${sign}${padded.slice(0, -digits)}.${padded.slice(-digits)}`;
}

/**
 * An amount of money, from **integer minor units** (cents for USD, yen for JPY): `formatMoney(123450, { currency:
 * "USD", locale: "en-US" })` → `"$1,234.50"`. A non-integer (or an unsafe one, past 2^53) throws a `TypeError`: the cents are the ledger's money,
 * never a float.
 */
export function formatMoney(minorUnits: number, options: FormatMoneyOptions): string {
  // A safe integer only: past 2^53 a number no longer holds every cent exactly.
  if (!Number.isSafeInteger(minorUnits)) {
    throw new TypeError(`formatMoney expects an integer number of minor units, received ${String(minorUnits)}`);
  }
  const { currency, locale, display = "symbol" } = options;
  const digits = options.minorUnitDigits ?? currencyDigits(currency);
  if (!Number.isInteger(digits) || digits < 0 || digits > 20) {
    throw new RangeError(`minorUnitDigits must be an integer from 0 to 20, received ${String(digits)}`);
  }
  const format = getNumberFormat(locale, { style: "currency", currency, currencyDisplay: display });
  // Intl formats a decimal string exactly (ES2023); the cast covers the older `lib` typings.
  return format.format(toDecimalString(minorUnits, digits) as unknown as number);
}
