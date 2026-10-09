import { format, isPluralMessage, placeholdersOf,PLURAL_CATEGORIES } from "../src";

describe("format", () => {
  it("replaces the placeholders it has values for", () => {
    expect(format("{count} repositories", { count: 23 })).toBe("23 repositories");
    expect(format("{a} and {b}, {a}", { a: "x", b: 0 })).toBe("x and 0, x");
  });

  it("keeps a placeholder without a value as written", () => {
    expect(format("{count} of {total}", { count: 1 })).toBe("1 of {total}");
    expect(format("{a}{b}", { a: null, b: undefined })).toBe("{a}{b}");
    expect(format("no placeholder")).toBe("no placeholder");
  });

  it("never reads inherited properties", () => {
    expect(format("{toString}", {})).toBe("{toString}");
  });
});

describe("placeholdersOf", () => {
  it("lists the names, sorted and unique", () => {
    expect(placeholdersOf("{b} {a} {b} { c }")).toEqual(["a", "b"]);
    expect(placeholdersOf("none")).toEqual([]);
  });
});

describe("isPluralMessage", () => {
  it("recognises a set of plural forms with `other`", () => {
    expect(isPluralMessage({ one: "{count} bid", other: "{count} bids" })).toBe(true);
    expect(isPluralMessage({ zero: "none", other: "some" })).toBe(true);
  });

  it("refuses anything else", () => {
    expect(isPluralMessage("text")).toBe(false);
    expect(isPluralMessage(null)).toBe(false);
    expect(isPluralMessage(["other"])).toBe(false);
    expect(isPluralMessage({ one: "a" })).toBe(false);
    expect(isPluralMessage({ other: "a", vault: "b" })).toBe(false);
    expect(isPluralMessage({ other: "a", one: 1 })).toBe(false);
  });

  it("knows the CLDR categories", () => {
    expect(PLURAL_CATEGORIES).toEqual(["zero", "one", "two", "few", "many", "other"]);
  });
});
