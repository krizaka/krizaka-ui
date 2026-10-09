import { getDateTimeFormat, getNumberFormat, getPluralRules, getRelativeTimeFormat } from "../src/cache";
import * as root from "../src/index";
import { formatMoney } from "../src/money";

describe("formatter cache", () => {
  it("returns the same instance for the same locale and options, in any key order", () => {
    const a = getNumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });
    const b = getNumberFormat("en-US", { maximumFractionDigits: 1, style: "percent" });
    expect(b).toBe(a);
    expect(getNumberFormat("en-US", { maximumFractionDigits: 1, style: "percent", notation: undefined })).toBe(a);
  });

  it("returns another instance for another locale or other options", () => {
    const a = getNumberFormat("en-US", { style: "percent" });
    expect(getNumberFormat("fr-CA", { style: "percent" })).not.toBe(a);
    expect(getNumberFormat("en-US", { style: "decimal" })).not.toBe(a);
    expect(getNumberFormat(["fr-CA", "en-US"])).not.toBe(getNumberFormat("fr-CA"));
  });

  it("keeps the four kinds apart and caches each", () => {
    expect(getDateTimeFormat("en-US")).toBe(getDateTimeFormat("en-US", {}));
    expect(getRelativeTimeFormat("en-US")).toBe(getRelativeTimeFormat("en-US", {}));
    expect(getPluralRules("en-US")).toBe(getPluralRules("en-US", {}));
    expect(getDateTimeFormat("en-US")).not.toBe(getNumberFormat("en-US"));
  });

  it("builds a money formatter once", () => {
    const Real = Intl.NumberFormat;
    let built = 0;
    class Counting extends Real {
      constructor(...args: ConstructorParameters<typeof Real>) {
        super(...args);
        built += 1;
      }
    }
    Intl.NumberFormat = Counting as typeof Intl.NumberFormat;
    try {
      formatMoney(100, { currency: "CHF", locale: "de-CH" });
      expect(built).toBe(2); // the currency's digits, then the formatter
      formatMoney(250, { currency: "CHF", locale: "de-CH" });
      formatMoney(-75, { currency: "CHF", locale: "de-CH" });
      expect(built).toBe(2);
    } finally {
      Intl.NumberFormat = Real;
    }
  });
});

describe("root entry", () => {
  it("exposes every function", () => {
    expect(Object.keys(root).sort()).toEqual([
      "currencyDigits",
      "formatCompact",
      "formatDate",
      "formatMoney",
      "formatNumber",
      "formatPercent",
      "formatRelative",
      "getDateTimeFormat",
      "getNumberFormat",
      "getPluralRules",
      "getRelativeTimeFormat",
      "plural",
    ]);
  });
});
