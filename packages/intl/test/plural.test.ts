import { plural } from "../src/plural";

const bids = { one: "bid", other: "bids" };

describe("plural", () => {
  it("follows English: 1 is one, 0 and 1.5 are other", () => {
    expect(plural(1, "en-US", bids)).toBe("bid");
    expect(plural(0, "en-US", bids)).toBe("bids");
    expect(plural(2, "en-US", bids)).toBe("bids");
    expect(plural(1.5, "en-US", bids)).toBe("bids");
  });

  it("follows French: 0, 1 and 1.5 are one, a million is many", () => {
    const forms = { one: "enchère", many: "d'enchères", other: "enchères" };
    expect(plural(0, "fr-CA", forms)).toBe("enchère");
    expect(plural(1.5, "fr-CA", forms)).toBe("enchère");
    expect(plural(2, "fr-CA", forms)).toBe("enchères");
    expect(plural(1_000_000, "fr-CA", forms)).toBe("d'enchères");
  });

  it("falls back to other when the locale's category has no form", () => {
    expect(plural(1_000_000, "fr-CA", { one: "enchère", other: "enchères" })).toBe("enchères");
    expect(plural(3, "ar", { other: "other" })).toBe("other");
  });

  it("uses zero for exactly 0, in any language", () => {
    const forms = { zero: "no bids", one: "bid", other: "bids" };
    expect(plural(0, "en-US", forms)).toBe("no bids");
    expect(plural(0, "fr-CA", forms)).toBe("no bids");
    expect(plural(1, "en-US", forms)).toBe("bid");
  });

  it("uses the locale's own categories (Arabic: zero, two, few, many)", () => {
    const forms = { zero: "0", one: "1", two: "2", few: "few", many: "many", other: "other" };
    expect(plural(2, "ar", forms)).toBe("2");
    expect(plural(3, "ar", forms)).toBe("few");
    expect(plural(11, "ar", forms)).toBe("many");
    expect(plural(100, "ar", forms)).toBe("other");
  });

  it("returns any value type, not only strings", () => {
    expect(plural(1, "en-US", { one: 1, other: 2 })).toBe(1);
  });
});
