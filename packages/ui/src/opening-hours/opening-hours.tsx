// Server-safe: no hook, no context (a native <details>). A shop's weekly hours in one quiet row — « Open now · closes at 5 pm »
// and today's hours — that unfolds into the whole week with today marked. The app computes the status and formats the
// times (the shop's zone and the reader's locale are its business); this block only lays them out.
import * as React from "react";
import { tv } from "tailwind-variants";

import { ChevronGlyph } from "../glyphs";

export const openingHours = tv({
  slots: {
    root: "group/hours rounded-xl border border-border-default bg-surface-1 text-fg",
    summary:
      "flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-xl px-4 py-3 outline-hidden marker:hidden focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden",
    dot: "h-2.5 w-2.5 shrink-0 rounded-full bg-fg-muted data-[open=true]:bg-success data-[open=true]:motion-safe:animate-pulse",
    status: "flex min-w-0 flex-1 flex-col leading-tight",
    state: "text-sm font-bold text-fg",
    detail: "text-xs text-fg-secondary",
    today: "hidden shrink-0 text-sm tabular-nums text-fg-secondary sm:block",
    chevron: "h-4 w-4 shrink-0 text-fg-secondary transition-transform group-open/hours:rotate-180 motion-reduce:transition-none",
    list: "m-0 flex list-none flex-col gap-0.5 border-t border-border-subtle p-2 sm:p-3",
    row: "flex items-baseline justify-between gap-4 rounded-lg px-2 py-1.5 text-sm text-fg-secondary data-[today]:bg-accent-soft data-[today]:font-bold data-[today]:text-fg",
    day: "shrink-0",
    hours: "text-right tabular-nums",
  },
});
const s = openingHours();

export type OpeningDay = {
  /** A stable id (`mon`, `1`). */
  id: string;
  /** The day's name, translated (`Lundi`). */
  label: string;
  /** The day's hours, formatted by the app (`8 h – 12 h, 13 h – 17 h`); the app's word for closed when there are none. */
  hours: string;
};

export type OpeningStatus = {
  /** Open at this moment. */
  open: boolean;
  /** The state in words (`Open now`, `Closed`). */
  label: string;
  /** What follows (`closes at 5 pm`, `opens tomorrow at 8 am`). */
  detail?: string;
};

export type OpeningHoursProps = Omit<React.ComponentProps<"details">, "children"> & {
  /** The week, in reading order. */
  days: readonly OpeningDay[];
  /** The id of today's day: its row is marked (`aria-current="date"`) and its hours show on the closed row. */
  today?: string;
  /** Open or closed right now, in words. */
  status: OpeningStatus;
  /** The name of the list (`Hours`), passed translated. */
  label: string;
};

/** The weekly hours in one row — open now, closes at… — that unfolds into the week, today highlighted. */
export function OpeningHours({ days, today, status, label, className, ...props }: OpeningHoursProps) {
  const todayHours = days.find((d) => d.id === today)?.hours;
  return (
    <details className={s.root({ className })} {...props}>
      <summary className={s.summary()}>
        <span aria-hidden data-open={status.open} className={s.dot()} />
        <span className={s.status()}>
          <span className={s.state()}>{status.label}</span>
          {status.detail && <span className={s.detail()}>{status.detail}</span>}
        </span>
        {todayHours && <span className={s.today()}>{todayHours}</span>}
        <ChevronGlyph className={s.chevron()} />
        <span className="sr-only">{label}</span>
      </summary>
      <ul className={s.list()} aria-label={label}>
        {days.map((day) => (
          <li key={day.id} className={s.row()} data-today={day.id === today ? "" : undefined} aria-current={day.id === today ? "date" : undefined}>
            <span className={s.day()}>{day.label}</span>
            <span className={s.hours()}>{day.hours}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
