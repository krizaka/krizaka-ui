import { createI18n, type MessageKey, type Placeholders, type ValuesArgs } from "../src";

const en = {
  home: { title: "Welcome", lead: "{count} repositories in {org}" },
  auction: {
    phase: { SOLD: "Sold", OPEN: "Open" },
    bids: { zero: "No bid", one: "{count} bid", other: "{count} bids" },
  },
  steps: [{ title: "One" }],
  onlyEn: "English only",
};
const fr: typeof en = {
  home: { title: "Bienvenue", lead: "{count} dépôts chez {org}" },
  auction: {
    phase: { SOLD: "Vendu", OPEN: "Ouvert" },
    bids: { zero: "Aucune enchère", one: "{count} enchère", other: "{count} enchères" },
  },
  steps: [{ title: "Un" }],
  onlyEn: "",
};
delete (fr as Partial<typeof en>).onlyEn;

const i18n = createI18n<typeof en, "en" | "fr">({ en, fr }, { defaultLocale: "en" });

describe("createI18n", () => {
  it("lists the locales and narrows values to them", () => {
    expect(i18n.locales).toEqual(["en", "fr"]);
    expect(i18n.defaultLocale).toBe("en");
    expect(i18n.isLocale("fr")).toBe(true);
    expect(i18n.isLocale("de")).toBe(false);
    expect(i18n.isLocale(3)).toBe(false);
    expect(i18n.asLocale("fr")).toBe("fr");
    expect(i18n.asLocale("de")).toBe("en");
    expect(i18n.asLocale(undefined)).toBe("en");
  });

  it("returns a locale's catalogue, the default one for anything unknown", () => {
    expect(i18n.getDictionary("fr").home.title).toBe("Bienvenue");
    expect(i18n.getDictionary("xx")).toBe(en);
  });

  it("translates typed keys with their placeholders", () => {
    expect(i18n.t("home.title")).toBe("Welcome");
    expect(i18n.t("auction.phase.SOLD")).toBe("Sold");
    expect(i18n.t("home.lead", { count: 3, org: "krizaka" })).toBe("3 repositories in krizaka");
    expect(i18n.translator("fr")("home.lead", { count: 3, org: "krizaka" })).toBe("3 dépôts chez krizaka");
    expect(i18n.format).toBeTypeOf("function");
  });

  it("chooses the plural form through @krizaka/intl", () => {
    const t = i18n.t;
    expect(t("auction.bids", { count: 0 })).toBe("No bid");
    expect(t("auction.bids", { count: 1 })).toBe("1 bid");
    expect(t("auction.bids", { count: 2 })).toBe("2 bids");
    const tFr = i18n.translator("fr");
    expect(tFr("auction.bids", { count: 1 })).toBe("1 enchère");
    expect(tFr("auction.bids", { count: 1.5 })).toBe("1.5 enchère");
    expect(tFr("auction.bids", { count: 3 })).toBe("3 enchères");
  });

  it("uses `other` when the count is not a number", () => {
    expect(i18n.t("auction.bids", { count: Number.NaN })).toBe("NaN bids");
    const loose = i18n.t as unknown as (key: string, values?: object) => string;
    expect(loose("auction.bids")).toBe("{count} bids");
  });

  it("falls back to the default locale, then to the key", () => {
    expect(i18n.translator("fr")("onlyEn")).toBe("English only");
    const loose = i18n.t as unknown as (key: string) => string;
    expect(loose("home.missing")).toBe("home.missing");
    expect(loose("home.title.deeper")).toBe("home.title.deeper");
    expect(loose("steps")).toBe("steps");
    expect(loose("steps.0")).toBe("steps.0");
    expect(loose("toString")).toBe("toString");
  });

  it("refuses a default locale without a catalogue", () => {
    expect(() => createI18n({ en }, { defaultLocale: "fr" as "en" })).toThrow(RangeError);
  });
});

describe("types", () => {
  it("types the keys by path, plural sets included, lists excluded", () => {
    expectTypeOf<MessageKey<typeof en>>().toEqualTypeOf<
      "home.title" | "home.lead" | "auction.phase.SOLD" | "auction.phase.OPEN" | "auction.bids" | "onlyEn"
    >();
  });

  it("types the placeholders of literal messages", () => {
    expectTypeOf<Placeholders<"{count} of {total}">>().toEqualTypeOf<"count" | "total">();
    expectTypeOf<Placeholders<"none">>().toEqualTypeOf<never>();
    expectTypeOf<Placeholders<"{ not one }">>().toEqualTypeOf<never>();
    expectTypeOf<ValuesArgs<"{count} items">[0]>().toMatchTypeOf<{ readonly count: string | number }>();
    expectTypeOf<ValuesArgs<{ one: string; other: string }>[0]>().toMatchTypeOf<{ readonly count: number }>();
    expectTypeOf<ValuesArgs<string>>().toEqualTypeOf<[values?: Readonly<Record<string, string | number | null | undefined>>]>();
  });

  it("requires the placeholders of a catalogue written `as const`", () => {
    const strict = createI18n({ en: { lead: "{count} items" } } as const, { defaultLocale: "en" });
    expect(strict.t("lead", { count: 2 })).toBe("2 items");
    // @ts-expect-error — `count` is required by the message.
    expect(strict.t("lead", {})).toBe("{count} items");
    // @ts-expect-error — not a key of the catalogue.
    expect(strict.t("nope")).toBe("nope");
  });
});
