import { formatDate, formatRelative, localDay } from "../src/date";

// ICU separates with no-break spaces (U+00A0, U+202F) that vary across its versions: compare the words, not the space.
const sp = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");
const NOW = Date.UTC(2026, 9, 9, 14, 30); // 9 October 2026, 14:30 UTC
const at = (ms: number) => new Date(NOW + ms);
const S = 1000;
const MIN = 60 * S;
const H = 60 * MIN;
const D = 24 * H;

describe("formatDate", () => {
  it.each([
    ["short", "10/9/26", "2026-10-09"],
    ["medium", "Oct 9, 2026", "9 oct. 2026"],
    ["long", "October 9, 2026", "9 octobre 2026"],
  ] as const)("%s", (style, en, fr) => {
    expect(formatDate(NOW, { locale: "en-US", style, timeZone: "UTC" })).toBe(en);
    expect(formatDate(NOW, { locale: "fr-CA", style, timeZone: "UTC" })).toBe(fr);
  });

  it("defaults to medium and accepts a Date or an ISO string", () => {
    expect(formatDate(new Date(NOW), { locale: "en-US", timeZone: "UTC" })).toBe("Oct 9, 2026");
    expect(formatDate("2026-10-09T14:30:00Z", { locale: "en-US", timeZone: "UTC" })).toBe("Oct 9, 2026");
  });

  it("adds the time of day and follows the time zone", () => {
    expect(sp(formatDate(NOW, { locale: "en-US", timeStyle: "short", timeZone: "UTC" }))).toBe("Oct 9, 2026, 2:30 PM");
    expect(sp(formatDate(NOW, { locale: "fr-CA", timeStyle: "short", timeZone: "UTC" }))).toBe("9 oct. 2026, 14 h 30");
    expect(formatDate(Date.UTC(2026, 9, 10, 2), { locale: "en-US", timeZone: "America/Montreal" })).toBe("Oct 9, 2026");
  });

  it("refuses an invalid date (RangeError)", () => {
    expect(() => formatDate("not a date", { locale: "en-US" })).toThrow(RangeError);
  });
});

describe("formatRelative", () => {
  it.each([
    [-45 * S, "45 seconds ago", "il y a 45 secondes"],
    [-3 * MIN, "3 minutes ago", "il y a 3 minutes"],
    [-2 * H, "2 hours ago", "il y a 2 heures"],
    [-3 * D, "3 days ago", "il y a 3 jours"],
    [31 * D, "next month", "le mois prochain"],
    [0, "now", "maintenant"],
    [-1 * D, "yesterday", "hier"],
    [-2 * 365 * D, "2 years ago", "il y a 2 ans"],
  ])("%d ms → %s / %s", (offset, en, fr) => {
    expect(formatRelative(at(offset), { locale: "en-US", now: NOW })).toBe(en);
    expect(formatRelative(at(offset), { locale: "fr-CA", now: NOW })).toBe(fr);
  });

  it("moves up a unit once the rounded value would reach it", () => {
    expect(formatRelative(at(59.6 * S), { locale: "en-US", now: NOW, numeric: "always" })).toBe("in 1 minute");
    expect(formatRelative(at(-6.6 * D), { locale: "en-US", now: NOW })).toBe("last week");
    expect(formatRelative(at(14 * D), { locale: "en-US", now: NOW })).toBe("in 2 weeks");
  });

  it("says numbers with numeric: always and abbreviates with style: short", () => {
    expect(formatRelative(at(-1 * D), { locale: "en-US", now: NOW, numeric: "always" })).toBe("1 day ago");
    expect(formatRelative(at(14 * D), { locale: "en-US", now: NOW, style: "short" })).toBe("in 2 wk.");
    expect(sp(formatRelative(at(-1 * D), { locale: "fr-CA", now: NOW, numeric: "always", style: "short" }))).toBe(
      "il y a 1 j",
    );
  });

  it("measures from Date.now() when now is not given", () => {
    vi.useFakeTimers({ now: NOW });
    try {
      expect(formatRelative(at(-3 * MIN), { locale: "en-US" })).toBe("3 minutes ago");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("localDay", () => {
  it.each([
    ["2026-10-24T01:30:00Z", "America/Toronto", "2026-10-23"], // 21:30 EDT the evening before
    ["2026-10-24T12:00:00Z", "America/Toronto", "2026-10-24"], // 08:00 EDT
    ["2026-01-15T04:30:00Z", "America/Toronto", "2026-01-14"], // 23:30 EST
    ["2026-10-24T01:30:00Z", "UTC", "2026-10-24"], // the UTC day is still the UTC day
  ])("%s in %s is %s", (instant, timeZone, day) => {
    expect(localDay(instant, timeZone)).toBe(day);
  });

  it("follows the spring change (2026-03-08, 02:00 EST becomes 03:00 EDT)", () => {
    expect(localDay("2026-03-08T04:30:00Z", "America/Toronto")).toBe("2026-03-07"); // 23:30 EST
    expect(localDay("2026-03-08T05:30:00Z", "America/Toronto")).toBe("2026-03-08"); // 00:30 EST
    expect(localDay("2026-03-08T07:30:00Z", "America/Toronto")).toBe("2026-03-08"); // 03:30 EDT
  });

  it("follows the autumn change (2026-11-01, 02:00 EDT becomes 01:00 EST)", () => {
    expect(localDay("2026-11-01T03:30:00Z", "America/Toronto")).toBe("2026-10-31"); // 23:30 EDT
    expect(localDay("2026-11-01T04:30:00Z", "America/Toronto")).toBe("2026-11-01"); // 00:30 EDT
    expect(localDay("2026-11-01T06:30:00Z", "America/Toronto")).toBe("2026-11-01"); // 01:30 EST, the second pass
    expect(localDay("2026-11-02T04:59:00Z", "America/Toronto")).toBe("2026-11-01"); // 23:59 EST
    expect(localDay("2026-11-02T05:00:00Z", "America/Toronto")).toBe("2026-11-02"); // 00:00 EST
  });

  it("takes a Date, an epoch or an ISO string", () => {
    expect(localDay(new Date("2026-10-24T01:30:00Z"), "America/Toronto")).toBe("2026-10-23");
    expect(localDay(Date.UTC(2026, 9, 24, 1, 30), "America/Toronto")).toBe("2026-10-23");
    expect(localDay("2026-10-24T01:30:00Z", "America/Toronto")).toBe("2026-10-23");
  });

  it("refuses an invalid date (RangeError)", () => {
    expect(() => localDay("not a date", "America/Toronto")).toThrow(RangeError);
  });
});
