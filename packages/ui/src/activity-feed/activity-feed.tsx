// Client (the clock of “… ago”, the announcement of new events). What happened, newest first: an activity feed
// grouped by day with folded runs and relative times, announced politely when it is live; and a `Timeline` — one
// thing's history on a rail, oldest first. Words are props.
import * as React from "react";
import { tv } from "tailwind-variants";

import { type ActivityEvent, type ActivityTone, groupActivity, timeAgo } from "./group";

export const activityFeed = tv({
  slots: {
    root: "flex flex-col gap-5",
    group: "flex flex-col gap-1",
    heading: "sticky top-0 z-10 bg-surface-0 py-1 text-xs font-semibold text-fg-secondary",
    ol: "m-0 flex list-none flex-col p-0",
    item: "relative flex gap-3 py-2.5",
    marker: "relative mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--kz-af-tone)] ring-4 ring-surface-0",
    rail: "absolute left-[4.5px] top-5 -bottom-1 w-px bg-border-default",
    body: "flex min-w-0 flex-1 flex-col",
    title: "text-sm text-fg",
    count: "ml-1.5 inline-flex rounded-sm bg-surface-3 px-1.5 text-xs font-semibold tabular-nums text-fg-secondary",
    description: "text-xs text-fg-secondary",
    time: "shrink-0 pt-0.5 text-xs tabular-nums text-fg-secondary",
    leading: "shrink-0",
  },
});

const TONE: Record<ActivityTone, string> = {
  neutral: "var(--kz-border-strong)",
  accent: "var(--kz-accent)",
  success: "var(--kz-success)",
  warning: "var(--kz-warning)",
  danger: "var(--kz-danger)",
  info: "var(--kz-info)",
};

export type ActivityFeedLabels = {
  /** The heading of today's events. */
  today: string;
  /** The heading of yesterday's. */
  yesterday: string;
  /** A folded run: `(n) => "×" + n` (“3 times”). */
  times: (count: number) => string;
  /** Announced when new events arrive in a live feed: `(n) => n + " new events"`. */
  newEvents: (count: number) => string;
};

export const activityFeedLabels: ActivityFeedLabels = {
  today: "Today",
  yesterday: "Yesterday",
  times: (count) => `×${count}`,
  newEvents: (count) => (count === 1 ? "1 new event" : `${count} new events`),
};

export type ActivityFeedProps<T extends ActivityEvent> = {
  /** The events, in any order. */
  events: readonly T[];
  /** The feed's accessible name (“Activity”). */
  "aria-label": string;
  /** The locale of the dates and the “… ago”. Default `en-US`. */
  locale?: string;
  /** Now, for the “… ago” and the day headings (pass it from the server for the same text on both sides). */
  now?: Date;
  /** Refresh the “… ago” every minute. Default true. */
  ticking?: boolean;
  /** Fold the runs of the same actor and kind. Default true. */
  fold?: boolean;
  /** Announce new events politely (a stream). */
  live?: boolean;
  /** Before an event's text: its actor's `Avatar`, an icon. */
  leading?: (event: T) => React.ReactNode;
  /** After an event's text: an action (Reply, View). */
  action?: (event: T) => React.ReactNode;
  /** The words, passed translated; English by default. */
  labels?: Partial<ActivityFeedLabels>;
  /** Shown when there is no event (an `EmptyState`). */
  empty?: React.ReactNode;
  /** Classes merged on the root. */
  className?: string;
};

function useNow(initial: Date | undefined, ticking: boolean) {
  const [now, setNow] = React.useState(() => initial ?? new Date());
  React.useEffect(() => {
    if (!ticking) return;
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [ticking]);
  return now;
}

/**
 * What happened, newest first: grouped by day, runs folded (“Mina tipped ×3”), “2 min ago” kept fresh, new events
 * announced when `live`. Orazaka's job activity, Orochia's notifications, the console's audit log.
 */
export function ActivityFeed<T extends ActivityEvent>({ events, "aria-label": label, locale = "en-US", now: given, ticking = true, fold = true, live, leading, action, labels: words, empty, className }: ActivityFeedProps<T>) {
  const labels = { ...activityFeedLabels, ...words };
  const s = activityFeed();
  const now = useNow(given, ticking && !given);
  const groups = groupActivity(events, { now, locale, today: labels.today, yesterday: labels.yesterday, fold });
  const seen = React.useRef(events.length);
  const [announcement, setAnnouncement] = React.useState("");
  React.useEffect(() => {
    const added = events.length - seen.current;
    seen.current = events.length;
    if (!live || added <= 0) return;
    const timer = setTimeout(() => setAnnouncement(labels.newEvents(added)), 0);
    return () => clearTimeout(timer);
  }, [events.length, live]); // eslint-disable-line react-hooks/exhaustive-deps -- announce on a new count only
  return (
    <section aria-label={label} className={s.root({ className })}>
      {live ? (
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      ) : null}
      {groups.length === 0 && empty ? empty : null}
      {groups.map((group) => (
        <div key={group.label} className={s.group()}>
          <h3 className={s.heading()}>{group.label}</h3>
          <ol className={s.ol()}>
            {group.events.map(({ event, count }) => {
              const date = new Date(event.at);
              return (
                <li key={event.id} className={s.item()} style={{ ["--kz-af-tone" as string]: TONE[event.tone ?? "neutral"] }}>
                  {leading ? <span className={s.leading()}>{leading(event)}</span> : <span aria-hidden className={s.marker()} />}
                  <span className={s.body()}>
                    <span className={s.title()}>
                      {event.title}
                      {count > 1 ? <span className={s.count()}>{labels.times(count)}</span> : null}
                    </span>
                    {event.description ? <span className={s.description()}>{event.description}</span> : null}
                  </span>
                  <time dateTime={date.toISOString()} title={date.toLocaleString(locale)} className={s.time()}>
                    {timeAgo(date, { now, locale })}
                  </time>
                  {action ? <span className="shrink-0">{action(event)}</span> : null}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
}

export type TimelineProps<T extends ActivityEvent> = {
  /** One thing's events, oldest first (a job's run, a payout's life). */
  events: readonly T[];
  /** The timeline's accessible name (“History of the payout”). */
  "aria-label": string;
  /** The locale of the times. Default `en-US`. */
  locale?: string;
  /** How a time is written: `time` (14:02, default), `datetime`, `date`. */
  timeStyle?: "time" | "datetime" | "date";
  /** Classes merged on the list. */
  className?: string;
};

/** One thing's history on a rail, oldest first: each event a marker in its tone, its time and its words. */
export function Timeline<T extends ActivityEvent>({ events, "aria-label": label, locale = "en-US", timeStyle = "time", className }: TimelineProps<T>) {
  const s = activityFeed();
  const options: Intl.DateTimeFormatOptions =
    timeStyle === "time" ? { hour: "2-digit", minute: "2-digit" } : timeStyle === "date" ? { dateStyle: "medium" } : { dateStyle: "medium", timeStyle: "short" };
  const write = new Intl.DateTimeFormat(locale, options);
  return (
    <ol aria-label={label} className={s.ol({ className })}>
      {events.map((event, i) => {
        const date = new Date(event.at);
        return (
          <li key={event.id} className={s.item()} style={{ ["--kz-af-tone" as string]: TONE[event.tone ?? "neutral"] }}>
            <span aria-hidden className={s.marker()} />
            {i < events.length - 1 ? <span aria-hidden className={s.rail()} /> : null}
            <span className={s.body()}>
              <span className={s.title()}>{event.title}</span>
              {event.description ? <span className={s.description()}>{event.description}</span> : null}
            </span>
            <time dateTime={date.toISOString()} className={s.time()}>
              {write.format(date)}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
