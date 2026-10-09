import { formatCompact, formatNumber, formatPercent } from "../src/number";

const nb = (s: string) => s.replace(/ /g, " ");

describe("formatNumber", () => {
  it("uses the locale's separators", () => {
    expect(formatNumber(1234567.891, { locale: "en-US" })).toBe("1,234,567.891");
    expect(formatNumber(1234567.891, { locale: "fr-CA" })).toBe(nb("1 234 567,891"));
  });

  it("rounds half away from zero to the digits asked", () => {
    expect(formatNumber(2.345, { locale: "en-US", maximumFractionDigits: 2 })).toBe("2.35");
    expect(formatNumber(2.345, { locale: "fr-CA", maximumFractionDigits: 2 })).toBe("2,35");
    expect(formatNumber(2.5, { locale: "en-US", maximumFractionDigits: 0 })).toBe("3");
    expect(formatNumber(-2.5, { locale: "fr-CA", maximumFractionDigits: 0 })).toBe("-3");
  });

  it("formats a bigint exactly", () => {
    expect(formatNumber(12345678901234567890n, { locale: "en-US" })).toBe("12,345,678,901,234,567,890");
  });
});

describe("formatCompact", () => {
  it.each([
    [999, "999", "999"],
    [12345, "12.3K", nb("12,3 k")],
    [1234567, "1.2M", nb("1,2 M")],
    [1250000000, "1.3B", nb("1,3 G")],
  ])("%d → %s / %s", (value, en, fr) => {
    expect(formatCompact(value, { locale: "en-US" })).toBe(en);
    expect(formatCompact(value, { locale: "fr-CA" })).toBe(fr);
  });

  it("takes another number of decimals", () => {
    expect(formatCompact(12345, { locale: "en-US", maximumFractionDigits: 0 })).toBe("12K");
  });
});

describe("formatPercent", () => {
  it("formats a ratio", () => {
    expect(formatPercent(0.125, { locale: "en-US" })).toBe("13%");
    expect(formatPercent(0.125, { locale: "fr-CA" })).toBe(nb("13 %"));
    expect(formatPercent(0.1256, { locale: "en-US", maximumFractionDigits: 1 })).toBe("12.6%");
    expect(formatPercent(0.1256, { locale: "fr-CA", maximumFractionDigits: 1 })).toBe(nb("12,6 %"));
  });
});
