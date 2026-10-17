// Client (the chosen day). The next free times of a service as tappable chips: a strip of days, then the day's times.
// A time is a link (`href`: the booking page with the time chosen) or a toggle the reader presses (`value`,
// `onValueChange`). The app computes the slots (its availability is the truth) and formats the labels.
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
      "inline-flex min-h-11 min-w-[4.75rem] items-center justify-center gap-1.5 rounded-full border border-border-default bg-surface-1 px-4 text-sm font-semibold tabular-nums text-fg no-underline " +
      "transition-colors hover:border-accent/60 hover:bg-accent-soft focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring " +
      "aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent disabled:cursor-not-allowed disabled:opacity-50",
    note: "text-[11px] font-medium text-fg-secondary group-aria-pressed:text-on-accent",
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
  /** Not offered any more: shown, disabled. */
  disabled?: boolean;
  /** Makes the time a link to this address (the booking page with the slot chosen). */
  href?: string;
};

export type PickerDay = {
  /** A stable id (`2026-10-19`). */
  id: string;
  /** The day's name, translated (`Today`, `Mon`). */
  label: string;
  /** Under it (`19 Oct`). */
  sub?: string;
  /** Its free times, in order. */
  slots: readonly PickerSlot[];
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
  /** The app's link component for the times that have an `href`. */
  linkAs?: LinkComponent;
};

/** Tappable free times by day: the day strip, then the day's chips — links or toggles. */
export function SlotPicker({ days, label, emptyLabel, value, onValueChange, defaultDay, linkAs, className, ...props }: SlotPickerProps) {
  const [dayId, setDayId] = React.useState(defaultDay ?? days[0]?.id);
  const active = days.find((d) => d.id === dayId) ?? days[0];
  if (!active) return <p className={s.empty({ className })}>{emptyLabel}</p>;
  return (
    <div className={s.root({ className })} {...props}>
      <div className={s.days()} role="group" aria-label={label}>
        {days.map((day) => (
          <button key={day.id} type="button" aria-pressed={day.id === active.id} onClick={() => setDayId(day.id)} className={s.day()}>
            <span className={s.dayName()}>{day.label}</span>
            {day.sub && <span className={s.daySub()}>{day.sub}</span>}
          </button>
        ))}
      </div>
      <ul className={s.times()} aria-label={`${active.label}${active.sub ? ` ${active.sub}` : ""}`}>
        {active.slots.map((slot) => (
          <li key={slot.id}>
            {slot.href ? (
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
    </div>
  );
}
