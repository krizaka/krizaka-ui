// Platform-neutral: a date typed as day, month and year (the native `DateField`, the form's `DateField entry="parts"`).
// Values are ISO calendar dates, `YYYY-MM-DD`, compared as strings.

/** A part of a typed date. */
export type DatePart = "day" | "month" | "year";

/** The digits of each part. */
export const DATE_PART_LENGTH: Readonly<Record<DatePart, number>> = { day: 2, month: 2, year: 4 };

/** The order of day, month and year in a locale (`en-US` → month, day, year; `fr` → day, month, year). */
export function datePartsOrder(locale: string): DatePart[] {
  try {
    const parts = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(new Date(2001, 10, 22));
    const order = parts.map((p) => p.type).filter((t): t is DatePart => t === "day" || t === "month" || t === "year");
    if (order.length === 3) return order;
  } catch {
    // An engine without Intl's parts: day, month, year.
  }
  return ["day", "month", "year"];
}

/** The ISO-ordered value of what was typed: `""` when nothing is, `YYYY-MM-DD` otherwise (not necessarily a real date). */
export function composeDate(parts: Readonly<Record<DatePart, string>>): string {
  if (!parts.day && !parts.month && !parts.year) return "";
  const pad = (v: string) => (v.length === 1 ? `0${v}` : v);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** The parts of a value (`""` → three empty parts). */
export function splitDate(value: string | null | undefined): Record<DatePart, string> {
  const m = /^(\d*)-(\d*)-(\d*)$/.exec(value ?? "");
  return m ? { year: m[1]!, month: m[2]!, day: m[3]! } : { day: "", month: "", year: "" };
}

/** True for a real calendar date written `YYYY-MM-DD` (not `2001-02-30`). */
export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** The latest date of birth of someone `age` years old today (`YYYY-MM-DD`): an age gate's `max`, `value <= latestBirthDate(18)`. */
export function latestBirthDate(age: number, today = new Date()): string {
  return new Date(Date.UTC(today.getFullYear() - age, today.getMonth(), today.getDate())).toISOString().slice(0, 10);
}
