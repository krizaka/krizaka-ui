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

// ─── Shared by the pickers, web and native (no DOM, no React) ───────────────────────────────────────────────────────

/** The days of a month (`month` 1–12). */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `2026-10-11` → `{ year: 2026, month: 10, day: 11 }` (no check: pair it with `isRealDate`). */
export function isoParts(iso: string): { year: number; month: number; day: number } {
  const [year = 0, month = 0, day = 0] = iso.split("-").map(Number);
  return { year, month, day };
}

/** `{ 2026, 10, 11 }` → `2026-10-11`, the day kept inside the month (`2026-02-31` → `2026-02-28`). */
export function isoOf(year: number, month: number, day: number): string {
  const d = Math.min(Math.max(day, 1), daysInMonth(year, month));
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** The ISO date of today on this device (or of the `Date` given). */
export function todayIso(now = new Date()): string {
  return isoOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** The age in whole years on `today` of someone born on `birth` (both ISO). */
export function ageOn(birth: string, today: string = todayIso()): number {
  const b = isoParts(birth);
  const t = isoParts(today);
  return t.year - b.year - (t.month < b.month || (t.month === b.month && t.day < b.day) ? 1 : 0);
}

/** The month names of a locale, January first (`long` · `short` · `narrow`). */
export function monthNames(locale: string, style: "long" | "short" | "narrow" = "long"): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: style, timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, i) => format.format(new Date(Date.UTC(2001, i, 1))));
}

/** The years from `from` to `to`, both included, in that order (descending when `from > to`). */
export function yearRange(from: number, to: number): number[] {
  const step = from <= to ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + i * step);
}

/** A time of day, `HH:mm` on 24 hours (`"09:30"`, `"18:00"`): the value of every time picker. */
export type TimeValue = string;

/** `"9:5"` / `"09:05"` → minutes since midnight; `null` when it is not a time. */
export function timeToMinutes(value: string | null | undefined): number | null {
  const m = /^(\d{1,2}):(\d{1,2})$/.exec(value ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : null;
}

/** Minutes since midnight → `HH:mm`. */
export function minutesToTime(minutes: number): TimeValue {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** The slots of a day from `start` to `end` (excluded) every `step` minutes: `timeSlots("09:00", "12:00", 30)`. */
export function timeSlots(start: TimeValue, end: TimeValue, step = 30): TimeValue[] {
  const a = timeToMinutes(start);
  const b = timeToMinutes(end);
  if (a === null || b === null || step <= 0) return [];
  const slots: TimeValue[] = [];
  for (let m = a; m < b; m += step) slots.push(minutesToTime(m));
  return slots;
}

/** True when the locale writes the time on 12 hours with a day period (`en-US` → true, `fr-CA` → false). */
export function uses12Hours(locale: string): boolean {
  try {
    const options = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions() as Intl.ResolvedDateTimeFormatOptions & { hourCycle?: string };
    return options.hourCycle ? options.hourCycle === "h12" || options.hourCycle === "h11" : Boolean(options.hour12);
  } catch {
    return false;
  }
}

/** The day periods of a locale, morning first (`["AM", "PM"]`, `["a.m.", "p.m."]`). */
export function dayPeriods(locale: string): [string, string] {
  const format = new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true, timeZone: "UTC" });
  const period = (h: number) => format.formatToParts(new Date(Date.UTC(2001, 0, 1, h))).find((p) => p.type === "dayPeriod")?.value ?? (h < 12 ? "AM" : "PM");
  return [period(9), period(15)];
}

/** A time written the locale's way (`"18:30"` → `"6:30 PM"` in en-US, `"18 h 30"` in fr-CA). */
export function formatTime(locale: string, value: TimeValue): string {
  const minutes = timeToMinutes(value);
  if (minutes === null) return "";
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2001, 0, 1, 0, minutes)));
}

/** A local `Date` at midnight for an ISO date (for formatting). */
export const toLocalDate = (iso: string) => {
  const { year, month, day } = isoParts(iso);
  return new Date(year, month - 1, day);
};
/** The ISO date of a local `Date`. */
export const toIsoDate = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
/** The ISO date `days` later (or earlier). */
export const addDays = (iso: string, days: number) => {
  const date = toLocalDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};
/** The ISO date `months` later (or earlier), the day kept inside the shorter months (`01-31` + 1 → `02-28`). */
export const addMonths = (iso: string, months: number) => {
  const { year, month, day } = isoParts(iso);
  const first = new Date(year, month - 1 + months, 1);
  return isoOf(first.getFullYear(), first.getMonth() + 1, day);
};

/** The first day of the week for a locale (0 = Sunday … 6 = Saturday), from `Intl.Locale` week info; Monday otherwise. */
export function weekStartOf(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number } };
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    return firstDay ? firstDay % 7 : 1;
  } catch {
    return 1;
  }
}

/** The weeks of a month's grid (six at most), each seven ISO dates from the locale's first day of the week. */
export function monthGrid(month: string, weekStartsOn: number): string[][] {
  const first = `${month.slice(0, 7)}-01`;
  const lead = (toLocalDate(first).getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  return Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7)).filter((week, w) => w < 5 || week[0]!.slice(0, 7) === first.slice(0, 7));
}
