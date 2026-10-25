// Client (the chosen day). The next free times of a service as tappable chips: a strip of days, then the day's times.
// A time is a link (`href`: the booking page with the time chosen) or a toggle the reader presses (`value`,
// `onValueChange`). The app computes the slots (its availability is the truth) and formats the labels. With `week` the
// picker moves through the weeks (← Today →): the host loads the days of the week it is asked for, the picker never computes.
import * as React from "react";
import { tv } from "tailwind-variants";

import { BlockLink, type LinkComponent } from "../block-link";

export const slotPicker = tv({
  slots: {
    root: "flex min-w-0 flex-col gap-3",
    days: "flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    day:
      "flex min-h-12 min-w-[4.5rem] shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border border-border-default bg-surface-1 px-3 py-1.5 text-center leading-tight text-fg-secondary " +
      "transition-colors hover:border-border-strong hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-fg",
    dayName: "text-xs font-bold",
    daySub: "text-[11px] tabular-nums text-fg-muted",
    times: "m-0 flex list-none flex-wrap gap-2 p-0",
    time:
      "inline-flex min-h-11 min-w-[4.75rem] items-center justify-center gap-1.5 rounded-sm border border-border-default bg-surface-1 px-4 text-sm font-semibold tabular-nums text-fg no-underline " +
      "transition-colors hover:border-accent/60 hover:bg-accent-soft focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-fg-muted disabled:line-through disabled:hover:border-border-default disabled:hover:bg-transparent",
    note: "text-[11px] font-medium text-fg-secondary group-aria-pressed:text-on-accent",
    weekBar: "flex flex-wrap items-center justify-between gap-2",
    weekLabel: "m-0 min-w-0 text-sm font-semibold tabular-nums text-fg",
    weekNav: "flex items-center gap-1.5",
    weekBtn:
      "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-border-default bg-surface-1 px-3 text-sm font-semibold text-fg no-underline " +
      "transition-colors hover:border-border-strong focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    groups: "m-0 flex list-none flex-col gap-3 p-0",
    groupLabel: "m-0 mb-1.5 text-xs font-bold text-fg-secondary",
    footer: "m-0 text-xs text-fg-secondary",
    empty: "m-0 rounded-xl border border-dashed border-border-default px-4 py-6 text-center text-sm text-fg-secondary",
  },
});
const s = slotPicker();

export type PickerSlot = {
  /** A stable id (the slot's start as an ISO string). */
  id: string;
  /** The time in words, formatted by the app (`9 h 30`). */
  label: string;
  /** What to know about it (`2 places left`), shown beside the time and read with it. */
  note?: string;
  /** Not offered any more (full): shown struck out and disabled, its `note` (`Full`) read with the time — never colour alone. */
  disabled?: boolean;
  /** Makes the time a link to this address (the booking page with the slot chosen). */
  href?: string;
};

/** A part of a day (`Morning`, `Afternoon`): the label comes from the host's messages. */
export type PickerGroup = {
  id: string;
  label: string;
  slots: readonly PickerSlot[];
};

export type PickerDay = {
  /** A stable id (`2026-10-19`). */
  id: string;
  /** The day's name, translated (`Today`, `Mon`). */
  label: string;
  /** Under it (`19 Oct`). */
  sub?: string;
  /** Its times, in order — flat… */
  slots?: readonly PickerSlot[];
  /** …or in parts of the day (`Morning`, `Afternoon`), each under its own label. Wins over `slots`. */
  groups?: readonly PickerGroup[];
};

export type SlotPickerProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  /** The days that have free times, in order. */
  days: readonly PickerDay[];
  /** The name of the group (`Available times`), passed translated. */
  label: string;
  /** Said when no day has a free time. */
  emptyLabel: string;
  /** The chosen slot's id (controlled). */
  value?: string | null;
  /** Called with the chosen slot's id. */
  onValueChange?: (id: string) => void;
  /** The first day shown. Default: the first of `days`. */
  defaultDay?: string;
  /** The app's link component for the times that have an `href`, and for the week buttons when `weekHref` is set. */
  linkAs?: LinkComponent;
  /** The week shown, the ISO date of its first day (`2026-10-19`; controlled). Setting it turns on ← Today →. */
  week?: string;
  /** Called with the ISO date of the week asked for (± 7 days, or `todayWeek`). The host loads that week's days. */
  onWeekChange?: (week: string) => void;
  /** The earliest week the host offers (ISO date): ← is disabled there. */
  minWeek?: string;
  /** The latest week the host offers (ISO date): → is disabled there. */
  maxWeek?: string;
  /** The current week, where « Today » goes back to. Default: `minWeek`. */
  todayWeek?: string;
  /** The week in words, formatted by the host with `@krizaka/intl` (`19 – 25 Oct`); announced politely at every change. */
  weekLabel?: string;
  /** Names of the three week buttons, translated: `{ previous: "Previous week", today: "Today", next: "Next week" }`. */
  weekButtons?: { previous: string; today: string; next: string };
  /** Makes the week buttons links (the address holds the state: `?week=`), given the week they go to. */
  weekHref?: (week: string) => string;
  /** The context line under the times: time zone and duration (`Montréal (UTC−4) · 45 min`), formatted by the host. */
  footer?: React.ReactNode;
};

/** The ISO date `days` days after `iso` (UTC, so a time zone never moves it). */
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const focusables = (root: Element | null) => [...(root?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]") ?? [])];
/** Arrows move focus inside one list of controls (`dir` -1/+1 on the arrows that follow the reading order). */
function moveFocus(e: React.KeyboardEvent<HTMLElement>, keys: { prev: string[]; next: string[] }) {
  const dir = keys.prev.includes(e.key) ? -1 : keys.next.includes(e.key) ? 1 : 0;
  if (!dir) return;
  const items = focusables(e.currentTarget);
  const at = items.indexOf(document.activeElement as HTMLElement);
  if (at < 0) return;
  e.preventDefault();
  items[(at + dir + items.length) % items.length]?.focus();
}

/** Tappable free times by day: the day strip, then the day's chips (in parts of the day if asked) — links or toggles — and, with `week`, ← Today →. */
export function SlotPicker({
  days,
  label,
  emptyLabel,
  value,
  onValueChange,
  defaultDay,
  linkAs,
  week,
  onWeekChange,
  minWeek,
  maxWeek,
  todayWeek,
  weekLabel,
  weekButtons,
  weekHref,
  footer,
  className,
  ...props
}: SlotPickerProps) {
  const [dayId, setDayId] = React.useState(defaultDay ?? days[0]?.id);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const refocusDays = React.useRef(false);
  const active = days.find((d) => d.id === dayId) ?? days[0];
  // After a week change from the keyboard (Page Up / Down inside the times), focus goes to the day strip, which stays.
  React.useEffect(() => {
    if (!refocusDays.current) return;
    refocusDays.current = false;
    rootRef.current?.querySelector<HTMLElement>("[data-day][aria-pressed=true]")?.focus();
  }, [week]);

  const weeks = week !== undefined;
  const prev = weeks ? addDays(week, -7) : undefined;
  const next = weeks ? addDays(week, 7) : undefined;
  const current = todayWeek ?? minWeek;
  const prevOff = !!prev && !!minWeek && prev < minWeek;
  const nextOff = !!next && !!maxWeek && next > maxWeek;
  const todayOff = !current || current === week;
  const go = (to: string | undefined, off: boolean) => {
    if (to && !off) onWeekChange?.(to);
  };

  const weekButton = (kind: "previous" | "today" | "next", to: string | undefined, off: boolean, text: string, shown: React.ReactNode) =>
    weekHref && to && !off ? (
      <BlockLink key={kind} href={weekHref(to)} linkAs={linkAs} aria-label={text} className={s.weekBtn()}>
        {shown}
      </BlockLink>
    ) : (
      <button key={kind} type="button" aria-label={text} aria-disabled={off || undefined} onClick={() => go(to, off)} className={s.weekBtn()}>
        {shown}
      </button>
    );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!weeks || (e.key !== "PageUp" && e.key !== "PageDown")) return;
    const to = e.key === "PageUp" ? prev : next;
    if (!to || (e.key === "PageUp" ? prevOff : nextOff)) return;
    e.preventDefault();
    refocusDays.current = true;
    onWeekChange?.(to);
  };

  const timeList = (slots: readonly PickerSlot[], name: string) => (
    <ul className={s.times()} aria-label={name} onKeyDown={(e) => moveFocus(e, { prev: ["ArrowLeft", "ArrowUp"], next: ["ArrowRight", "ArrowDown"] })}>
      {slots.map((slot) => (
        <li key={slot.id}>
          {slot.href && !slot.disabled ? (
            <BlockLink href={slot.href} linkAs={linkAs} className={s.time()}>
              {slot.label}
              {slot.note && <span className={s.note()}>{slot.note}</span>}
            </BlockLink>
          ) : (
            <button type="button" aria-pressed={value === slot.id} disabled={slot.disabled} onClick={() => onValueChange?.(slot.id)} className={s.time({ className: "group" })}>
              {slot.label}
              {slot.note && <span className={s.note()}>{slot.note}</span>}
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  const dayName = active ? `${active.label}${active.sub ? ` ${active.sub}` : ""}` : "";
  return (
    <div ref={rootRef} className={s.root({ className })} onKeyDown={onKeyDown} {...props}>
      {weeks && weekButtons && (
        <div className={s.weekBar()}>
          {weekLabel && (
            <p className={s.weekLabel()} role="status" aria-live="polite">
              {weekLabel}
            </p>
          )}
          <div className={s.weekNav()}>
            {weekButton("previous", prev, prevOff, weekButtons.previous, <span aria-hidden="true">←</span>)}
            {weekButton("today", current, todayOff, weekButtons.today, weekButtons.today)}
            {weekButton("next", next, nextOff, weekButtons.next, <span aria-hidden="true">→</span>)}
          </div>
        </div>
      )}
      {!active ? (
        <p className={s.empty()}>{emptyLabel}</p>
      ) : (
        <>
          <div className={s.days()} role="group" aria-label={label} onKeyDown={(e) => moveFocus(e, { prev: ["ArrowLeft"], next: ["ArrowRight"] })}>
            {days.map((day) => (
              <button key={day.id} type="button" data-day="" aria-pressed={day.id === active.id} onClick={() => setDayId(day.id)} className={s.day()}>
                <span className={s.dayName()}>{day.label}</span>
                {day.sub && <span className={s.daySub()}>{day.sub}</span>}
              </button>
            ))}
          </div>
          {active.groups ? (
            <ul className={s.groups()} aria-label={dayName}>
              {active.groups.map((group) => (
                <li key={group.id}>
                  <p className={s.groupLabel()}>{group.label}</p>
                  {timeList(group.slots, `${dayName} · ${group.label}`)}
                </li>
              ))}
            </ul>
          ) : (
            timeList(active.slots ?? [], dayName)
          )}
        </>
      )}
      {footer && <p className={s.footer()}>{footer}</p>}
    </div>
  );
}
