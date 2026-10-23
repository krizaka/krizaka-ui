import { getPluralRules, getRelativeTimeFormat } from "../src/cache";
import { formatRelative } from "../src/date";
import { plural } from "../src/plural";

describe("missing Intl constructors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function removeConstructor(name: "PluralRules" | "RelativeTimeFormat") {
    const partial = Object.defineProperties({}, Object.getOwnPropertyDescriptors(Intl)) as typeof Intl;
    Reflect.deleteProperty(partial, name);
    vi.stubGlobal("Intl", partial);
  }

  it("falls back even for a previously cached native plural formatter", () => {
    const native = getPluralRules("en-US");
    removeConstructor("PluralRules");
    const fallback = getPluralRules("en-US");
    expect(fallback).not.toBe(native);
    expect(getPluralRules("en-US")).toBe(fallback);
    expect(plural(1, "en-US", { one: "bid", other: "bids" })).toBe("bid");
    expect(plural(2, "en-US", { one: "bid", other: "bids" })).toBe("bids");
    vi.unstubAllGlobals();
    expect(getPluralRules("en-US")).toBe(native);
  });

  it.each(["en-US", "fr-CA"])("matches native cardinal rules for %s", (locale) => {
    const native = new Intl.PluralRules(locale);
    removeConstructor("PluralRules");
    for (const count of [0, 1, -1, 1.5, -1.5, 2, 1_000_000, -2_000_000, NaN, Infinity]) {
      expect(getPluralRules(locale).select(count)).toBe(native.select(count));
    }
  });

  it("uses the first supported language in a locale list, or other for unsupported plurals", () => {
    removeConstructor("PluralRules");
    expect(getPluralRules(["de", "fr-CA", "en-US"]).select(0)).toBe("one");
    expect(getPluralRules("FR-ca").select(1.5)).toBe("one");
    expect(getPluralRules("ar").select(1)).toBe("other");
    expect(getPluralRules([]).select(1)).toBe("other");
  });

  it("falls back for relative time without changing cached native formatters", () => {
    const native = getRelativeTimeFormat("en-US");
    removeConstructor("RelativeTimeFormat");
    const fallback = getRelativeTimeFormat("en-US");
    expect(fallback).not.toBe(native);
    expect(getRelativeTimeFormat("en-US")).toBe(fallback);
    expect(fallback.format(-3, "hours")).toBe("3 hours ago");
    expect(fallback.format(1, "day")).toBe("in 1 day");
    vi.unstubAllGlobals();
    expect(getRelativeTimeFormat("en-US")).toBe(native);
  });

  it("uses long numeric relative time when auto or an abbreviated style is requested", () => {
    removeConstructor("RelativeTimeFormat");
    const now = Date.UTC(2026, 9, 9);
    expect(formatRelative(now, { locale: "en-US", now })).toBe("in 0 seconds");
    expect(formatRelative(now, { locale: "fr-CA", now, style: "narrow" })).toBe("dans 0 seconde");
    expect(getRelativeTimeFormat("fr-CA", { numeric: "always", style: "short" }).format(-1, "day")).toBe(
      "il y a 1 jour",
    );
  });

  it.each([
    ["en-US", 1.0001, "second", "in 1 second"],
    ["fr-CA", 1.9999, "second", "dans 2 secondes"],
    [["de", "en-US"], 1.2345, "second", "in 1,235 seconds"],
  ] as const)("bases %s relative-time noun agreement on the rounded displayed number", (locale, value, unit, expected) => {
    removeConstructor("RelativeTimeFormat");
    expect(getRelativeTimeFormat(locale).format(value, unit)).toBe(expected);
  });

  it.each([
    ["second", "seconde"],
    ["minute", "minute"],
    ["hour", "heure"],
    ["day", "jour"],
    ["week", "semaine"],
    ["month", "mois"],
    ["quarter", "trimestre"],
    ["year", "an"],
  ] as const)("formats %s in both directions and languages", (unit, french) => {
    removeConstructor("RelativeTimeFormat");
    const en = getRelativeTimeFormat("en-US");
    const fr = getRelativeTimeFormat(["de", "fr-CA"]);
    expect(en.format(-1, unit)).toBe(`1 ${unit} ago`);
    expect(en.format(2, unit)).toBe(`in 2 ${unit}s`);
    expect(fr.format(-1, unit)).toBe(`il y a 1 ${french}`);
    expect(fr.format(2, unit)).toBe(`dans 2 ${french}${unit === "month" ? "" : "s"}`);
  });

  it("uses English wording for unsupported relative locales and localizes numbers", () => {
    removeConstructor("RelativeTimeFormat");
    expect(getRelativeTimeFormat("de").format(1234, "days")).toBe("in 1.234 days");
    expect(getRelativeTimeFormat("en-US").format(-0, "second")).toBe("0 seconds ago");
  });

  it("rejects non-finite relative values and invalid units", () => {
    removeConstructor("RelativeTimeFormat");
    const fallback = getRelativeTimeFormat("en-US");
    expect(() => fallback.format(NaN, "day")).toThrow(RangeError);
    expect(() => fallback.format(Infinity, "day")).toThrow(RangeError);
    expect(() => fallback.format(1, "invalid" as Intl.RelativeTimeFormatUnit)).toThrow(RangeError);
  });

  it("does not hide native constructor errors", () => {
    expect(() => getPluralRules("not_a_locale")).toThrow(RangeError);
    expect(() => getRelativeTimeFormat("not_a_locale")).toThrow(RangeError);
  });

  it("works when both constructors are missing", () => {
    removeConstructor("PluralRules");
    removeConstructor("RelativeTimeFormat");
    expect(plural(0, "fr-CA", { one: "enchère", other: "enchères" })).toBe("enchère");
    expect(plural(0, "en-US", { zero: "none", other: "bids" })).toBe("none");
    expect(getRelativeTimeFormat("fr-CA").format(2, "days")).toBe("dans 2 jours");
  });

  it("documents degraded plural options and preserves native-only methods when available", () => {
    const native = getPluralRules("en-US");
    expect("resolvedOptions" in native && native.resolvedOptions().type).toBe("cardinal");
    removeConstructor("PluralRules");
    const fallback = getPluralRules("en-US", { type: "ordinal", minimumFractionDigits: 1 });
    expect(fallback.select(1)).toBe("one");
    expect("resolvedOptions" in fallback).toBe(false);
  });
});
