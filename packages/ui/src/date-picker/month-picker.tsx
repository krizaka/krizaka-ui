// Client. The twelve months of a year as a grid (three columns): the arrows walk them (Up / Down by a row), Page Up /
// Page Down change the year, Enter or Space picks. The value is `YYYY-MM` — a billing month, a card's expiry, a report.
// The calendar's title opens it, so a year away is two clicks, not twelve pages.
import * as React from "react";

import { tv } from "../tv";
import { ChevronGlyph } from "../glyphs";
import { monthNames } from "./parts";

/** A calendar month, `YYYY-MM`. */
export type IsoMonth = string;

export const monthPicker = tv({
  slots: {
    root: "inline-flex select-none flex-col gap-3 text-sm text-fg",
    header: "flex items-center justify-between gap-2",
    year: "text-sm font-semibold tabular-nums",
    nav:
      "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-2 bg-sheen text-fg-secondary inset-shadow-edge " +
      "transition-colors hover:border-border-strong hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-35",
    grid: "kz-fade grid grid-cols-3 gap-1.5",
    month:
      "relative h-11 min-w-[5.5rem] rounded-xl px-2 text-sm font-medium capitalize text-fg transition-[background-color,box-shadow,transform] duration-150 " +
      "hover:bg-surface-3 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-hidden focus-visible:focus-ring " +
      "data-[current]:font-bold data-[current]:not-data-[selected]:text-fg-accent " +
      "data-[selected]:bg-accent data-[selected]:bg-fill-shade data-[selected]:font-semibold data-[selected]:text-on-accent data-[selected]:shadow-glow data-[selected]:inset-shadow-edge-fill " +
      "disabled:cursor-not-allowed disabled:text-fg-muted disabled:opacity-50 disabled:hover:bg-transparent",
  },
  variants: {
    variant: {
      plain: {},
      card: { root: "rounded-2xl border border-border-default bg-surface-1 bg-sheen p-4 shadow-raised inset-shadow-edge" },
    },
  },
  defaultVariants: { variant: "plain" },
});

export type MonthPickerLabels = {
  /** The previous-year button ("Previous year"). */
  previousYear: string;
  /** The next-year button ("Next year"). */
  nextYear: string;
};

export const monthPickerLabels: MonthPickerLabels = { previousYear: "Previous year", nextYear: "Next year" };

export type MonthPickerProps = {
  /** The BCP 47 locale of the month names: always explicit. */
  locale: string;
  /** The chosen month, `YYYY-MM` (controlled); `null` for none. */
  value?: IsoMonth | null;
  /** The chosen month at first, uncontrolled. */
  defaultValue?: IsoMonth | null;
  /** Called with the month picked. */
  onValueChange?: (value: IsoMonth | null) => void;
  /** The year shown (controlled). */
  year?: number;
  /** Called when the year shown changes. */
  onYearChange?: (year: number) => void;
  /** The earliest month that can be picked, `YYYY-MM`. */
  min?: IsoMonth;
  /** The latest month that can be picked, `YYYY-MM`. */
  max?: IsoMonth;
  /** This month (marked): inject it for a stable render or a test. Default: the device's. */
  current?: IsoMonth;
  /** Moves the focus to the active month when it mounts. */
  autoFocus?: boolean;
  /** Without its own year header (inside the calendar, which has one). */
  bare?: boolean;
  /** `plain` or `card` (its own raised surface). */
  variant?: "plain" | "card";
  /** The words, passed translated; English by default. */
  labels?: Partial<MonthPickerLabels>;
  /** Classes merged on the root. */
  className?: string;
};

/** A month of a year: twelve months in a grid, the year above them. */
export function MonthPicker({ locale, value: valueProp, defaultValue = null, onValueChange, year: yearProp, onYearChange, min, max, current, autoFocus, bare, variant, labels: given, className }: MonthPickerProps) {
  const labels = { ...monthPickerLabels, ...given };
  const s = monthPicker({ variant });
  const [own, setOwn] = React.useState<IsoMonth | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : own;
  const now = new Date();
  const thisMonth = current ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [ownYear, setOwnYear] = React.useState(() => Number((value ?? thisMonth).slice(0, 4)));
  const year = yearProp ?? ownYear;
  const setYear = (y: number) => {
    if (yearProp === undefined) setOwnYear(y);
    onYearChange?.(y);
  };
  const names = React.useMemo(() => monthNames(locale, "short").map((n) => n.replace(/\.$/, "")), [locale]);
  const longNames = React.useMemo(() => monthNames(locale, "long"), [locale]);
  const iso = (y: number, m: number) => `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}`;
  const disabled = (m: IsoMonth) => Boolean((min && m < min) || (max && m > max));
  const [focused, setFocused] = React.useState(() => (value && Number(value.slice(0, 4)) === year ? Number(value.slice(5, 7)) : Number(thisMonth.slice(5, 7))));
  const grid = React.useRef<HTMLDivElement>(null);
  const moved = React.useRef(Boolean(autoFocus));
  React.useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-month="${iso(year, focused)}"]`)?.focus();
  }, [year, focused]);

  const pick = (m: IsoMonth) => {
    if (valueProp === undefined) setOwn(m);
    onValueChange?.(m);
  };
  const move = (to: number) => {
    moved.current = true;
    const y = year + Math.floor((to - 1) / 12);
    const m = ((((to - 1) % 12) + 12) % 12) + 1;
    if (y !== year) setYear(y);
    setFocused(m);
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3, PageUp: -12, PageDown: 12 };
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      moved.current = true;
      setFocused(event.key === "Home" ? 1 : 12);
      return;
    }
    const by = moves[event.key];
    if (by === undefined) return;
    event.preventDefault();
    move(focused + by);
  };
  const rows = [0, 1, 2, 3].map((r) => [1, 2, 3].map((c) => r * 3 + c));
  return (
    <div className={s.root({ className })}>
      {bare ? null : (
        <div className={s.header()}>
          <button type="button" className={s.nav()} aria-label={labels.previousYear} disabled={Boolean(min && year - 1 < Number(min.slice(0, 4)))} onClick={() => setYear(year - 1)}>
            <ChevronGlyph direction="left" className="h-4 w-4" />
          </button>
          <span className={s.year()} aria-live="polite">
            {year}
          </span>
          <button type="button" className={s.nav()} aria-label={labels.nextYear} disabled={Boolean(max && year + 1 > Number(max.slice(0, 4)))} onClick={() => setYear(year + 1)}>
            <ChevronGlyph direction="right" className="h-4 w-4" />
          </button>
        </div>
      )}
      <div ref={grid} role="grid" aria-label={String(year)} className={s.grid()} key={year} onKeyDown={onKeyDown}>
        {rows.map((row) => (
          <div role="row" key={row[0]} className="contents">
            {row.map((m) => {
              const id = iso(year, m);
              return (
                <div role="gridcell" key={m} aria-selected={id === value || undefined} className="flex">
                  <button
                    type="button"
                    data-month={id}
                    tabIndex={m === focused ? 0 : -1}
                    aria-current={id === thisMonth ? "date" : undefined}
                    data-current={id === thisMonth ? "" : undefined}
                    data-selected={id === value ? "" : undefined}
                    disabled={disabled(id)}
                    className={s.month({ className: "w-full" })}
                    onClick={() => {
                      setFocused(m);
                      pick(id);
                    }}
                  >
                    <span aria-hidden>{names[m - 1]}</span>
                    <span className="sr-only">{`${longNames[m - 1]} ${year}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
