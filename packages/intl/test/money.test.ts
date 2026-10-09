import { currencyDigits, formatMoney } from "../src/money";

const nb = (s: string) => s.replace(/ /g, " "); // Intl separates with no-break spaces

describe("formatMoney", () => {
  it.each([
    ["en-US", "USD", 123450, "$1,234.50"],
    ["en-US", "USD", -5, "-$0.05"],
    ["en-US", "EUR", 9999, "€99.99"],
    ["en-US", "JPY", 1500, "¥1,500"],
    ["en-US", "BHD", 1234, nb("BHD 1.234")],
    ["fr-CA", "USD", 123450, nb("1 234,50 $ US")],
    ["fr-CA", "USD", -5, nb("-0,05 $ US")],
    ["fr-CA", "EUR", 9999, nb("99,99 €")],
    ["fr-CA", "JPY", 1500, nb("1 500 ¥")],
    ["fr-CA", "BHD", 1234, nb("1,234 BHD")],
  ])("%s %s %d → %s", (locale, currency, minorUnits, expected) => {
    expect(formatMoney(minorUnits, { currency, locale })).toBe(expected);
  });

  it("writes zero and negative zero the same way", () => {
    expect(formatMoney(0, { currency: "USD", locale: "en-US" })).toBe("$0.00");
    expect(formatMoney(-0, { currency: "USD", locale: "en-US" })).toBe("$0.00");
  });

  it("formats the largest safe amount exactly, with no float on the way", () => {
    expect(formatMoney(Number.MAX_SAFE_INTEGER, { currency: "USD", locale: "en-US" })).toBe("$90,071,992,547,409.91");
  });

  it.each([
    ["code", "en-US", nb("USD 1,234.50")],
    ["narrowSymbol", "en-US", "$1,234.50"],
    ["code", "fr-CA", nb("1 234,50 USD")],
    ["narrowSymbol", "fr-CA", nb("1 234,50 $")],
  ] as const)("display %s in %s", (display, locale, expected) => {
    expect(formatMoney(123450, { currency: "USD", locale, display })).toBe(expected);
  });

  it("rounds half away from zero when the ledger unit is finer than the currency's", () => {
    // Mills of a dollar: 3 digits stored, 2 shown.
    expect(formatMoney(123_456_5, { currency: "USD", locale: "en-US", minorUnitDigits: 4 })).toBe("$123.46");
    expect(formatMoney(-1235, { currency: "USD", locale: "en-US", minorUnitDigits: 3 })).toBe("-$1.24");
    expect(formatMoney(1234, { currency: "USD", locale: "en-US", minorUnitDigits: 3 })).toBe("$1.23");
    // Hundredths of a yen: JPY shows none.
    expect(formatMoney(1250, { currency: "JPY", locale: "en-US", minorUnitDigits: 2 })).toBe("¥13");
    expect(formatMoney(1234, { currency: "JPY", locale: "fr-CA", minorUnitDigits: 2 })).toBe(nb("12 ¥"));
  });

  it("reads whole units when minorUnitDigits is 0", () => {
    expect(formatMoney(5, { currency: "USD", locale: "en-US", minorUnitDigits: 0 })).toBe("$5.00");
  });

  it("refuses a float, NaN, Infinity or an unsafe integer (TypeError)", () => {
    for (const bad of [12.5, 0.1, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53]) {
      expect(() => formatMoney(bad, { currency: "USD", locale: "en-US" })).toThrow(TypeError);
    }
  });

  it("refuses an invalid minorUnitDigits (RangeError)", () => {
    for (const bad of [-1, 1.5, 21]) {
      expect(() => formatMoney(100, { currency: "USD", locale: "en-US", minorUnitDigits: bad })).toThrow(RangeError);
    }
  });
});

describe("currencyDigits", () => {
  it("reads the minor-unit digits from Intl", () => {
    expect(currencyDigits("JPY")).toBe(0);
    expect(currencyDigits("USD")).toBe(2);
    expect(currencyDigits("EUR")).toBe(2);
    expect(currencyDigits("BHD")).toBe(3);
  });
});
