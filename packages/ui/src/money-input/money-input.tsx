// Client (the text being typed). An amount in INTEGER minor units (cents) plus a currency. The person types a
// decimal in their locale's way; it is read as a string (never a float) into cents, refused beyond the currency's own
// decimals, and written back grouped and padded on blur. The currency can be chosen among `currencies` (a native
// select). Words arrive as props.
import { currencyDigits } from "@krizaka/intl";
import * as React from "react";

import { cn } from "../cn";
import { Input, Select } from "../field/field";

export type MoneyInputProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "inputMode"> & {
  /** The amount in minor units (cents), an integer, or `null` when empty. */
  value: number | null;
  /** Called with the new amount in minor units, or `null` when the field is emptied. */
  onValueChange: (minorUnits: number | null) => void;
  /** ISO 4217 code: `"CAD"`. */
  currency: string;
  /** BCP 47 locale for the separators: `"fr-CA"`, `"en-CA"`. */
  locale: string;
  /** The currencies to choose among (ISO codes). Omitted: the currency is fixed. */
  currencies?: readonly string[];
  /** Called with the chosen currency (required with `currencies`). */
  onCurrencyChange?: (currency: string) => void;
  /** The currency select's accessible name, passed translated: "Currency". */
  currencyLabel?: string;
  /** Marks the amount invalid (pair it with a `Field.Error`). */
  invalid?: boolean;
};

const separators = (locale: string) => {
  const parts = new Intl.NumberFormat(locale, { useGrouping: true, minimumFractionDigits: 1 }).formatToParts(1234567.1);
  return { decimal: parts.find((p) => p.type === "decimal")?.value ?? ".", group: parts.find((p) => p.type === "group")?.value ?? "," };
};

/** "12,50" → 1250 without a float; `undefined` when the text is not an amount or has too many decimals. */
export function parseMinorUnits(text: string, locale: string, digits: number): number | null | undefined {
  const { decimal } = separators(locale);
  const cleaned = text.replace(/\s/g, "");
  if (cleaned === "") return null;
  // The locale's decimal mark, and "." or "," as a typed alternative; any other mark is a thousands separator.
  const marks = [...cleaned].filter((c) => c === "." || c === "," || c === decimal);
  if (!/^[\d.,]+$/.test(cleaned.replaceAll(decimal, ""))) return undefined;
  const last = marks.length ? Math.max(cleaned.lastIndexOf("."), cleaned.lastIndexOf(","), cleaned.lastIndexOf(decimal)) : -1;
  const whole = (last >= 0 ? cleaned.slice(0, last) : cleaned).replace(/\D/g, "");
  const fraction = last >= 0 ? cleaned.slice(last + 1) : "";
  if (!/^\d*$/.test(fraction) || fraction.length > digits || (digits === 0 && last >= 0)) return undefined;
  const minor = Number(`${whole || "0"}${fraction.padEnd(digits, "0")}`);
  return Number.isSafeInteger(minor) ? minor : undefined;
}

/** Minor units → "1 234,50" in the locale, exact (BigInt), padded to the currency's decimals. */
export function formatMinorUnits(minor: number, locale: string, digits: number): string {
  const { decimal } = separators(locale);
  const abs = BigInt(Math.abs(minor)).toString().padStart(digits + 1, "0");
  const whole = new Intl.NumberFormat(locale).format(BigInt(digits ? abs.slice(0, -digits) : abs));
  return `${minor < 0 ? "-" : ""}${whole}${digits ? decimal + abs.slice(-digits) : ""}`;
}

/** An amount field in minor units. The caller holds an integer; the person sees their locale's decimal. */
export function MoneyInput({ value, onValueChange, currency, locale, currencies, onCurrencyChange, currencyLabel, invalid, className, onBlur, disabled, ...props }: MoneyInputProps) {
  const digits = currencyDigits(currency);
  const [text, setText] = React.useState(() => (value === null ? "" : formatMinorUnits(value, locale, digits)));
  const typed = React.useRef<number | null>(value);
  // Follow the caller when the value changes from outside (a reset, another currency's digits).
  React.useEffect(() => {
    if (typed.current !== value) setText(value === null ? "" : formatMinorUnits(value, locale, digits));
    typed.current = value;
  }, [value, locale, digits]);
  return (
    <span className={cn("flex w-full items-stretch gap-2", className)}>
      <Input
        {...props}
        type="text"
        inputMode={digits ? "decimal" : "numeric"}
        autoComplete="off"
        disabled={disabled}
        invalid={invalid}
        data-currency={currency}
        value={text}
        onChange={(event) => {
          const parsed = parseMinorUnits(event.target.value, locale, digits);
          if (parsed === undefined) return; // refused: not an amount, or more decimals than the currency has
          setText(event.target.value);
          typed.current = parsed;
          onValueChange(parsed);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (value !== null) setText(formatMinorUnits(value, locale, digits));
        }}
      />
      {currencies ? (
        <Select aria-label={currencyLabel} disabled={disabled} value={currency} onChange={(event) => onCurrencyChange?.(event.target.value)} className="w-28">
          {currencies.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </Select>
      ) : (
        <span className="flex items-center text-sm font-medium text-fg-secondary">{currency}</span>
      )}
    </span>
  );
}
