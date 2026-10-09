import { formatDate, formatRelative } from "../src/date";

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
