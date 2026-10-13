// Shared by the web and React Native ActivityFeed: the events grouped by day (“Today”, “Yesterday”, a date), the same
// events of one actor in a row folded into one (“Mina tipped 3 times”), and how long ago each happened — Intl only.

export type ActivityTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export type ActivityEvent = {
  /** A stable id. */
  id: string;
  /** When it happened: an ISO date-time, an epoch in ms or a `Date`. */
  at: string | number | Date;
  /** What happened, in a sentence — passed translated (“Mina tipped your video $5”). */
  title: string;
  /** A detail under it. */
  description?: string;
  /** Who did it (folds a run of the same `kind` by the same actor). */
  actor?: string;
  /** The kind of event (`tip`, `bid`, `job.done`): with `actor`, what folds. */
  kind?: string;
  /** The tone of its marker: success for a payout, danger for a failure. */
  tone?: ActivityTone;
};

export type ActivityGroup<T extends ActivityEvent> = {
  /** The day's heading (“Today”, “Yesterday”, “Monday, Oct 6”). */
  label: string;
  /** Its events, newest first; a folded run is its newest event with `count` > 1. */
  events: { event: T; count: number }[];
};

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/** Groups events (any order) by day, newest first, folding runs of the same actor and kind when `fold` is set. */
export function groupActivity<T extends ActivityEvent>(
  events: readonly T[],
  { now = new Date(), locale = "en-US", today = "Today", yesterday = "Yesterday", fold = true }: { now?: Date; locale?: string; today?: string; yesterday?: string; fold?: boolean } = {},
): ActivityGroup<T>[] {
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const day = new Intl.DateTimeFormat(locale, { weekday: "long", month: "short", day: "numeric" });
  const todayKey = dayKey(now);
  const yesterdayKey = dayKey(new Date(now.getTime() - 86_400_000));
  const groups: ActivityGroup<T>[] = [];
  let current: ActivityGroup<T> | null = null;
  let currentKey = "";
  for (const event of sorted) {
    const date = new Date(event.at);
    const key = dayKey(date);
    if (!current || key !== currentKey) {
      currentKey = key;
      current = { label: key === todayKey ? today : key === yesterdayKey ? yesterday : day.format(date), events: [] };
      groups.push(current);
    }
    const last = current.events[current.events.length - 1];
    if (fold && last && event.actor && event.kind && last.event.actor === event.actor && last.event.kind === event.kind) last.count += 1;
    else current.events.push({ event, count: 1 });
  }
  return groups;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.35],
  ["month", 12],
  ["year", Number.POSITIVE_INFINITY],
];

/** “2 minutes ago”, “yesterday”: how long ago, in the largest unit that reads well (`style` short: “2 min. ago”). */
export function timeAgo(at: string | number | Date, { now = new Date(), locale = "en-US", style = "short" }: { now?: Date; locale?: string; style?: "long" | "short" | "narrow" } = {}): string {
  let value = (new Date(at).getTime() - now.getTime()) / 1000;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [name, size] of UNITS) {
    unit = name;
    if (Math.abs(value) < size - 0.5) break;
    value /= size;
  }
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto", style }).format(Math.round(value) + 0, unit);
}
