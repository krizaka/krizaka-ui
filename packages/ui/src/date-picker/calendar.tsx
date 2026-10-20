// Client. A month as an ARIA grid (the APG date picker): one day in the tab order, the arrows walk the days, Home /
// End the week, Page Up / Page Down the months (Shift: the years), Enter or Space picks. Dates are ISO calendar dates
// (`"2026-10-11"`): no time zone, nothing to convert, safe in an address. Month and day names come from
// `@krizaka/intl` for the `locale` given — never the runtime's default.
//
// The material (BRAND.md §6): the chosen day is a lit fill (the accent, its shade, its glow), today carries the node —
// the diamond of the marks — and a range is one continuous band. The month's title opens the months of the year
// (`MonthPicker`): years are reached in a click, not by paging.
import { formatDate, getDateTimeFormat } from "@krizaka/intl";
import * as React from "react";

import { ChevronGlyph } from "../glyphs";
import { tv } from "../tv";
import { MonthPicker } from "./month-picker";
import { addDays, addMonths, toIsoDate, toLocalDate, weekStartOf } from "./parts";

export { addDays, addMonths, toIsoDate, toLocalDate, weekStartOf };

/** A calendar date, `YYYY-MM-DD`. */
export type IsoDate = string;
/** A range of calendar dates; `end` is `null` while the second date is not chosen. */
export type DateRange = { start: IsoDate; end: IsoDate | null };

export const calendar = tv({
  slots: {
    root: "inline-flex select-none flex-col text-sm text-fg",
    header: "mb-3 flex items-center justify-between gap-2",
    caption:
      "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold capitalize text-fg transition-colors hover:bg-surface-3 " +
      "focus-visible:outline-hidden focus-visible:focus-ring aria-expanded:bg-surface-3",
    nav:
      "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-2 bg-sheen text-fg-secondary inset-shadow-edge " +
      "transition-colors hover:border-border-strong hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring " +
      "disabled:pointer-events-none disabled:opacity-35",
    months: "flex flex-col gap-6 sm:flex-row",
    month: "kz-month flex flex-col gap-2",
    monthTitle: "px-1 text-xs font-semibold capitalize text-fg-secondary",
    grid: "border-separate border-spacing-y-1",
    weekday: "h-7 w-10 pb-1 text-center text-[11px] font-semibold text-fg-secondary",
    cell:
      "p-0 text-center data-[band]:bg-accent-soft data-[band=start]:rounded-l-xl data-[band=end]:rounded-r-xl data-[band=solo]:rounded-xl " +
      "data-[band=preview]:bg-surface-3",
    day:
      "relative h-10 w-10 rounded-xl text-sm tabular-nums text-fg transition-[background-color,box-shadow,transform] duration-150 " +
      "hover:bg-surface-3 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 " +
      "focus-visible:z-10 focus-visible:outline-hidden focus-visible:focus-ring " +
      "data-[outside]:text-fg-secondary data-[outside]:font-normal data-[weekend]:not-data-[selected]:text-fg-secondary " +
      "data-[today]:font-bold data-[today]:not-data-[selected]:text-fg-accent " +
      "data-[in-range]:hover:bg-accent/15 " +
      "data-[selected]:bg-accent data-[selected]:bg-fill-shade data-[selected]:font-semibold data-[selected]:text-on-accent " +
      "data-[selected]:shadow-glow data-[selected]:inset-shadow-edge-fill data-[selected]:hover:bg-accent " +
      "disabled:cursor-not-allowed disabled:text-fg-muted disabled:line-through disabled:opacity-50 disabled:hover:bg-transparent",
    // Today: the node under the number (the marks' diamond), on-accent when today is the chosen day.
    node: "pointer-events-none absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rotate-45 rounded-[1px] bg-accent group-data-[selected]:bg-on-accent",
    live: "sr-only",
  },
  variants: {
    variant: {
      plain: {},
      card: { root: "rounded-2xl border border-border-default bg-surface-1 bg-sheen p-4 shadow-raised inset-shadow-edge" },
    },
  },
  defaultVariants: { variant: "plain" },
});

const monthOf = (iso: IsoDate) => `${iso.slice(0, 7)}-01`;
const clampIso = (iso: IsoDate, min?: IsoDate, max?: IsoDate) => (min && iso < min ? min : max && iso > max ? max : iso);
const monthsBetween = (a: IsoDate, b: IsoDate) => (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(b.slice(5, 7)) - Number(a.slice(5, 7));

export type CalendarLabels = {
  /** The previous-month button ("Previous month"). */
  previousMonth: string;
  /** The next-month button ("Next month"). */
  nextMonth: string;
  /** The month's title as a button: opens the months of the year ("Choose month and year"). */
  chooseMonth: string;
  /** The previous-year button of the months view ("Previous year"). */
  previousYear: string;
  /** The next-year button of the months view ("Next year"). */
  nextYear: string;
};

export const calendarLabels: CalendarLabels = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  chooseMonth: "Choose month and year",
  previousYear: "Previous year",
  nextYear: "Next year",
};

export type CalendarProps = {
  /** The BCP 47 locale of the month and day names (`"en-US"`, `"fr-CA"`): always explicit. */
  locale: string;
  /** The chosen date (one-date mode). */
  value?: IsoDate | null;
  /** The chosen range (range mode): its ends are lit, the days between are one band. */
  range?: DateRange | null;
  /** Called with the day picked. */
  onSelect?: (date: IsoDate) => void;
  /** The month shown (the first one, with `numberOfMonths={2}`), any day of it (controlled). */
  month?: IsoDate;
  /** The month shown at first. Default: the value's, or today's. */
  defaultMonth?: IsoDate;
  /** Called when the month shown changes. */
  onMonthChange?: (month: IsoDate) => void;
  /** One month, or two side by side (a period: from a phone's width up, they stack on a phone). */
  numberOfMonths?: 1 | 2;
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
  /** `plain` (inside a popover, a card of the app) or `card` (the calendar is the interface: its own raised surface). */
  variant?: "plain" | "card";
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
  numberOfMonths = 1,
  min,
  max,
  isDateDisabled,
  weekStartsOn,
  today: todayProp,
  autoFocus,
  variant,
  labels: given,
  className,
}: CalendarProps) {
  const labels = { ...calendarLabels, ...given };
  const s = calendar({ variant });
  const today = todayProp ?? toIsoDate(new Date());
  const anchor = value ?? range?.start ?? clampIso(today, min, max);
  const [innerMonth, setInnerMonth] = React.useState(monthOf(defaultMonth ?? anchor));
  const month = monthProp ? monthOf(monthProp) : innerMonth;
  const shown = Array.from({ length: numberOfMonths }, (_, i) => addMonths(month, i));
  const lastShown = shown[shown.length - 1]!;
  const isShown = (iso: IsoDate) => iso.slice(0, 7) >= month.slice(0, 7) && iso.slice(0, 7) <= lastShown.slice(0, 7);
  const [focused, setFocused] = React.useState<IsoDate>(isShown(anchor) ? anchor : month);
  const [hover, setHover] = React.useState<IsoDate | null>(null);
  const [view, setView] = React.useState<"days" | "months">("days");
  const [direction, setDirection] = React.useState<"next" | "previous" | null>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const moved = React.useRef(Boolean(autoFocus));
  const titleId = React.useId();

  const setMonth = (next: IsoDate) => {
    const m = monthOf(next);
    setDirection(m > month ? "next" : m < month ? "previous" : null);
    if (!monthProp) setInnerMonth(m);
    onMonthChange?.(m);
  };
  // The focused day follows the months shown when they are changed from outside (the buttons, a controlled `month`).
  const active = isShown(focused) ? focused : month;

  React.useEffect(() => {
    if (!moved.current || view !== "days") return;
    moved.current = false;
    root.current?.querySelector<HTMLButtonElement>(`[data-date="${active}"]`)?.focus();
  }, [active, view]);

  const disabled = (iso: IsoDate) => Boolean((min && iso < min) || (max && iso > max) || isDateDisabled?.(iso));
  const start = weekStartsOn ?? weekStartOf(locale);
  const weekdayShort = getDateTimeFormat(locale, { weekday: "short" });
  const weekdayLong = getDateTimeFormat(locale, { weekday: "long" });
  const titleFormat = getDateTimeFormat(locale, { month: "long", year: "numeric" });
  const title = titleFormat.format(toLocalDate(month));
  const fullTitle = numberOfMonths === 2 ? `${title} – ${titleFormat.format(toLocalDate(lastShown))}` : title;

  const rangeEnd = range ? (range.end ?? hover) : null;
  const [lo, hi] = range && rangeEnd ? (range.start <= rangeEnd ? [range.start, rangeEnd] : [rangeEnd, range.start]) : [null, null];
  const previewing = Boolean(range && !range.end);

  const focusDay = (iso: IsoDate) => {
    moved.current = true;
    setFocused(iso);
    if (!isShown(iso)) setMonth(iso < month ? iso : addMonths(iso, -(numberOfMonths - 1)));
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
  const nextDisabled = Boolean(max && addMonths(lastShown, 1) > max);

  const band = (iso: IsoDate): string | undefined => {
    if (!lo || !hi) return undefined;
    if (iso < lo || iso > hi) return undefined;
    if (lo === hi) return undefined;
    if (previewing && iso !== range?.start) return iso === lo ? "start" : iso === hi ? "end" : "preview";
    return iso === lo ? "start" : iso === hi ? "end" : "middle";
  };

  const renderMonth = (first: IsoDate, index: number) => {
    const firstDate = toLocalDate(first);
    const lead = (firstDate.getDay() - start + 7) % 7;
    const gridStart = addDays(first, -lead);
    const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7)).filter((week, w) => w < 5 || week[0]!.slice(0, 7) === first.slice(0, 7));
    const monthTitle = titleFormat.format(firstDate);
    const gridLabelId = `${titleId}-m${index}`;
    return (
      <div key={first} className={s.month()} data-dir={direction ?? undefined}>
        {numberOfMonths === 2 ? (
          <div id={gridLabelId} className={s.monthTitle()}>
            {monthTitle}
          </div>
        ) : null}
        <table role="grid" aria-label={monthTitle} className={s.grid()} onKeyDown={onKeyDown}>
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
                  const outside = iso.slice(0, 7) !== first.slice(0, 7);
                  // With two months, a day outside its month is the other month's: drawn once, where it belongs.
                  if (outside && numberOfMonths === 2) return <td key={iso} role="gridcell" className={s.cell()} />;
                  const selected = iso === value || Boolean(range && (iso === range.start || iso === range.end));
                  const inRange = Boolean(lo && hi && iso > lo && iso < hi);
                  const dow = toLocalDate(iso).getDay();
                  return (
                    <td key={iso} role="gridcell" aria-selected={selected || inRange || undefined} data-band={band(iso)} className={s.cell()}>
                      <button
                        type="button"
                        data-date={iso}
                        tabIndex={iso === active ? 0 : -1}
                        aria-label={formatDate(toLocalDate(iso), { locale, style: "long" })}
                        aria-current={iso === today ? "date" : undefined}
                        data-today={iso === today ? "" : undefined}
                        data-outside={outside ? "" : undefined}
                        data-weekend={dow === 0 || dow === 6 ? "" : undefined}
                        data-selected={selected ? "" : undefined}
                        data-in-range={inRange ? "" : undefined}
                        disabled={disabled(iso)}
                        className={s.day({ className: "group" })}
                        onClick={() => {
                          setFocused(iso);
                          onSelect?.(iso);
                        }}
                        onMouseEnter={previewing ? () => setHover(iso) : undefined}
                        onFocus={previewing ? () => setHover(iso) : undefined}
                      >
                        {Number(iso.slice(8))}
                        {iso === today ? <span aria-hidden className={s.node()} /> : null}
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
  };

  return (
    <div ref={root} className={s.root({ className })}>
      <div className={s.header()}>
        <button
          type="button"
          className={s.nav()}
          aria-label={view === "days" ? labels.previousMonth : labels.previousYear}
          disabled={view === "days" ? prevDisabled : Boolean(min && Number(month.slice(0, 4)) - 1 < Number(min.slice(0, 4)))}
          onClick={() => setMonth(addMonths(month, view === "days" ? -1 : -12))}
        >
          <ChevronGlyph direction="left" className="h-4 w-4" />
        </button>
        <button type="button" className={s.caption()} aria-expanded={view === "months"} aria-label={`${labels.chooseMonth}, ${fullTitle}`} onClick={() => setView(view === "days" ? "months" : "days")}>
          <span aria-hidden>{view === "days" ? fullTitle : month.slice(0, 4)}</span>
          <ChevronGlyph direction={view === "months" ? "up" : "down"} className="h-3.5 w-3.5 text-fg-secondary" />
        </button>
        <button
          type="button"
          className={s.nav()}
          aria-label={view === "days" ? labels.nextMonth : labels.nextYear}
          disabled={view === "days" ? nextDisabled : Boolean(max && Number(month.slice(0, 4)) + 1 > Number(max.slice(0, 4)))}
          onClick={() => setMonth(addMonths(month, view === "days" ? 1 : 12))}
        >
          <ChevronGlyph direction="right" className="h-4 w-4" />
        </button>
      </div>
      <span id={titleId} className={s.live()} aria-live="polite">
        {fullTitle}
      </span>
      {view === "days" ? (
        <div className={s.months()}>{shown.map(renderMonth)}</div>
      ) : (
        <MonthPicker
          locale={locale}
          bare
          year={Number(month.slice(0, 4))}
          onYearChange={(y) => setMonth(`${y}-${month.slice(5, 7)}-01`)}
          value={month.slice(0, 7)}
          min={min?.slice(0, 7)}
          max={max?.slice(0, 7)}
          autoFocus
          onValueChange={(m) => {
            if (!m) return;
            const target = `${m}-01`;
            setMonth(target);
            setView("days");
            moved.current = true;
            setFocused(clampIso(addMonths(active, monthsBetween(monthOf(active), target)), min, max));
          }}
        />
      )}
    </div>
  );
}
