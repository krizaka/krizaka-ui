// Client. A month as an ARIA grid (the APG date picker): one day in the tab order, the arrows walk the days, Home /
// End the week, Page Up / Page Down the months (Shift: the years), Enter or Space picks. Dates are ISO calendar dates
// (`"2026-10-11"`): no time zone, nothing to convert, safe in an address. Month and day names come from
// `@krizaka/intl` for the `locale` given — never the runtime's default.
import { formatDate, getDateTimeFormat } from "@krizaka/intl";
import * as React from "react";

import { ChevronGlyph } from "../glyphs";
import { tv } from "../tv";

/** A calendar date, `YYYY-MM-DD`. */
export type IsoDate = string;
/** A range of calendar dates; `end` is `null` while the second date is not chosen. */
export type DateRange = { start: IsoDate; end: IsoDate | null };

export const calendar = tv({
  slots: {
    root: "w-[17.5rem] select-none text-sm text-fg",
    header: "mb-2 flex items-center justify-between gap-2",
    title: "text-sm font-semibold capitalize",
    nav:
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-3 hover:text-fg " +
      "focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-40",
    grid: "w-full border-collapse",
    weekday: "h-8 w-10 text-center font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-fg-secondary",
    cell: "p-0 text-center",
    day:
      "relative h-10 w-10 rounded-lg text-sm tabular-nums text-fg transition-[background-color,box-shadow,scale] duration-(--kz-duration-fast) ease-spring " +
      "hover:bg-surface-3 active:scale-95 focus-visible:focus-ring-inset " +
      // Today carries the node under its figure; the chosen day is the accent, lit from above, on the brand's glow.
      "data-[outside]:text-fg-secondary data-[today]:font-bold data-[today]:not-data-[selected]:text-fg-accent " +
      "data-[today]:after:absolute data-[today]:after:bottom-1.5 data-[today]:after:left-1/2 data-[today]:after:size-1 data-[today]:after:-translate-x-1/2 " +
      "data-[today]:after:rotate-45 data-[today]:after:rounded-[1px] data-[today]:after:bg-current " +
      "data-[in-range]:rounded-none data-[in-range]:bg-accent-soft " +
      "data-[selected]:bg-accent data-[selected]:bg-fill-shade data-[selected]:text-on-accent data-[selected]:shadow-glow data-[selected]:inset-shadow-edge-fill data-[selected]:hover:bg-accent " +
      "disabled:cursor-not-allowed disabled:text-fg-muted disabled:line-through disabled:opacity-50 disabled:hover:bg-transparent",
  },
});

export const pad = (n: number) => String(n).padStart(2, "0");
const parts = (iso: IsoDate) => iso.split("-").map(Number) as [number, number, number];
/** A local `Date` at midnight for an ISO date (for formatting). */
export const toLocalDate = (iso: IsoDate) => {
  const [y, m, d] = parts(iso);
  return new Date(y, m - 1, d);
};
/** The ISO date of a local `Date`. */
export const toIsoDate = (date: Date): IsoDate => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const addDays = (iso: IsoDate, days: number) => {
  const date = toLocalDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};
export const addMonths = (iso: IsoDate, months: number) => {
  const [y, m, d] = parts(iso);
  const first = new Date(y, m - 1 + months, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return toIsoDate(new Date(first.getFullYear(), first.getMonth(), Math.min(d, last)));
};
const monthOf = (iso: IsoDate) => `${iso.slice(0, 7)}-01`;
const clampIso = (iso: IsoDate, min?: IsoDate, max?: IsoDate) => (min && iso < min ? min : max && iso > max ? max : iso);

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

export type CalendarLabels = {
  /** The previous-month button ("Previous month"). */
  previousMonth: string;
  /** The next-month button ("Next month"). */
  nextMonth: string;
};

export const calendarLabels: CalendarLabels = { previousMonth: "Previous month", nextMonth: "Next month" };

export type CalendarProps = {
  /** The BCP 47 locale of the month and day names (`"en-US"`, `"fr-CA"`): always explicit. */
  locale: string;
  /** The chosen date (one-date mode). */
  value?: IsoDate | null;
  /** The chosen range (range mode): its ends are marked, the days between tinted. */
  range?: DateRange | null;
  /** Called with the day picked. */
  onSelect?: (date: IsoDate) => void;
  /** The month shown, any day of it (controlled). */
  month?: IsoDate;
  /** The month shown at first. Default: the value's, or today's. */
  defaultMonth?: IsoDate;
  /** Called when the month shown changes. */
  onMonthChange?: (month: IsoDate) => void;
  /** The earliest date that can be picked. */
  min?: IsoDate;
  /** The latest date that can be picked. */
  max?: IsoDate;
  /** Refuses some dates (`(d) => isWeekend(d)`). */
  isDateDisabled?: (date: IsoDate) => boolean;
  /** The first day of the week, 0 = Sunday. Default: the locale's. */
  weekStartsOn?: number;
  /** Today (marked): inject it for a stable server render or a test. Default: the device's date. */
  today?: IsoDate;
  /** Moves the focus to the active day when it mounts (inside a popover). */
  autoFocus?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<CalendarLabels>;
  /** Classes merged on the root. */
  className?: string;
};

/** A month grid to pick a date or the ends of a range, with the full keyboard of the APG date picker. */
export function Calendar({
  locale,
  value,
  range,
  onSelect,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  today: todayProp,
  autoFocus,
  labels: given,
  className,
}: CalendarProps) {
  const labels = { ...calendarLabels, ...given };
  const s = calendar();
  const today = todayProp ?? toIsoDate(new Date());
  const anchor = value ?? range?.start ?? clampIso(today, min, max);
  const [innerMonth, setInnerMonth] = React.useState(monthOf(defaultMonth ?? anchor));
  const month = monthProp ? monthOf(monthProp) : innerMonth;
  const [focused, setFocused] = React.useState<IsoDate>(anchor.slice(0, 7) === month.slice(0, 7) ? anchor : month);
  const [hover, setHover] = React.useState<IsoDate | null>(null);
  const grid = React.useRef<HTMLTableElement>(null);
  const moved = React.useRef(Boolean(autoFocus));
  const titleId = React.useId();

  const setMonth = (next: IsoDate) => {
    const m = monthOf(next);
    if (!monthProp) setInnerMonth(m);
    onMonthChange?.(m);
  };
  // The focused day follows the month shown when it is changed from outside (the buttons, a controlled `month`).
  const active = focused.slice(0, 7) === month.slice(0, 7) ? focused : month;

  React.useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${active}"]`)?.focus();
  }, [active]);

  const disabled = (iso: IsoDate) => Boolean((min && iso < min) || (max && iso > max) || isDateDisabled?.(iso));
  const start = weekStartsOn ?? weekStartOf(locale);
  const first = toLocalDate(month);
  const lead = (first.getDay() - start + 7) % 7;
  const gridStart = addDays(month, -lead);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7)).filter((week, w) => w < 5 || week[0]!.slice(0, 7) === month.slice(0, 7));
  const weekdayShort = getDateTimeFormat(locale, { weekday: "short" });
  const weekdayLong = getDateTimeFormat(locale, { weekday: "long" });
  const title = getDateTimeFormat(locale, { month: "long", year: "numeric" }).format(first);

  const rangeEnd = range ? (range.end ?? hover) : null;
  const [lo, hi] = range && rangeEnd ? (range.start <= rangeEnd ? [range.start, rangeEnd] : [rangeEnd, range.start]) : [null, null];

  const focusDay = (iso: IsoDate) => {
    moved.current = true;
    setFocused(iso);
    if (iso.slice(0, 7) !== month.slice(0, 7)) setMonth(iso);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const weekday = (toLocalDate(active).getDay() - start + 7) % 7;
    const moves: Record<string, () => IsoDate> = {
      ArrowLeft: () => addDays(active, -1),
      ArrowRight: () => addDays(active, 1),
      ArrowUp: () => addDays(active, -7),
      ArrowDown: () => addDays(active, 7),
      Home: () => addDays(active, -weekday),
      End: () => addDays(active, 6 - weekday),
      PageUp: () => addMonths(active, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(active, event.shiftKey ? 12 : 1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    focusDay(move());
  };

  const prevDisabled = Boolean(min && addDays(month, -1) < min);
  const nextDisabled = Boolean(max && addMonths(month, 1) > max);

  return (
    <div className={s.root({ className })}>
      <div className={s.header()}>
        <button type="button" className={s.nav()} aria-label={labels.previousMonth} disabled={prevDisabled} onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronGlyph direction="left" />
        </button>
        <h2 id={titleId} className={s.title()} aria-live="polite">
          {title}
        </h2>
        <button type="button" className={s.nav()} aria-label={labels.nextMonth} disabled={nextDisabled} onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronGlyph direction="right" />
        </button>
      </div>
      <table ref={grid} role="grid" aria-labelledby={titleId} className={s.grid()} onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {days.slice(0, 7).map((iso) => (
              <th key={iso} scope="col" abbr={weekdayLong.format(toLocalDate(iso))} className={s.weekday()}>
                {weekdayShort.format(toLocalDate(iso)).replace(/\.$/, "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]}>
              {week.map((iso) => {
                const selected = iso === value || (range && (iso === range.start || iso === range.end));
                const inRange = Boolean(lo && hi && iso > lo && iso < hi);
                return (
                  <td key={iso} role="gridcell" aria-selected={selected || inRange || undefined} className={s.cell()}>
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={iso === active ? 0 : -1}
                      aria-label={formatDate(toLocalDate(iso), { locale, style: "long" })}
                      aria-current={iso === today ? "date" : undefined}
                      data-today={iso === today ? "" : undefined}
                      data-outside={iso.slice(0, 7) !== month.slice(0, 7) ? "" : undefined}
                      data-selected={selected ? "" : undefined}
                      data-in-range={inRange ? "" : undefined}
                      disabled={disabled(iso)}
                      className={s.day()}
                      onClick={() => {
                        setFocused(iso);
                        onSelect?.(iso);
                      }}
                      onMouseEnter={range && !range.end ? () => setHover(iso) : undefined}
                      onFocus={range && !range.end ? () => setHover(iso) : undefined}
                    >
                      {Number(iso.slice(8))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
