// Client. Two ways to give a memorable date — a birth date, an expiry — that a calendar would make slow to reach:
// `DateField` (day · month · year typed in the locale's order, the next box focused once one is full; the web form's
// `entry="parts"`) and `DateWheel` (three wheels: the touch idiom, bounded by `min` / `max` — an age gate is
// `max={latestBirthDate(18)}`). The value is `YYYY-MM-DD` either way, like the native `DateField` and `DateWheel`.
import * as React from "react";

import { useControllable } from "../media";
import { tv } from "../tv";
import { composeDate, DATE_PART_LENGTH, type DatePart, datePartsOrder, daysInMonth, isoOf, isoParts, monthNames, splitDate, todayIso, yearRange } from "./parts";
import { Wheel, WheelPicker } from "./wheel";

export const dateField = tv({
  slots: {
    root: "flex flex-col gap-1.5 border-0 p-0",
    legend: "mb-1.5 p-0 text-xs font-semibold text-fg-secondary",
    row: "flex gap-2",
    part: "flex flex-col gap-1 text-xs text-fg-secondary",
    input:
      "h-11 rounded-lg border border-border-control bg-surface-2 px-2 text-center text-base tabular-nums text-fg inset-shadow-well transition-[border-color,box-shadow] " +
      "placeholder:text-fg-muted focus-visible:border-accent focus-visible:outline-hidden focus-visible:focus-ring-inset aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50",
    hint: "text-xs text-fg-secondary",
    error: "flex items-center gap-1.5 text-xs font-medium text-fg-danger before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-danger",
  },
});

export type DateFieldLabels = {
  /** The name of the day ("Day"). */
  day: string;
  /** The name of the month ("Month"). */
  month: string;
  /** The name of the year ("Year"). */
  year: string;
};

export const dateFieldLabels: DateFieldLabels = { day: "Day", month: "Month", year: "Year" };

type Common = {
  /** The visible label, passed translated (the group's name). */
  label: string;
  /** The BCP 47 locale: the order of the parts, the names of the months. */
  locale: string;
  /** A help text under the field ("For example, 27 3 1990"). */
  hint?: string;
  /** An error under the field: marks it invalid and is read with it. Replaces the hint. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** The name of a hidden input holding the value, for a plain `<form>` post. */
  name?: string;
  /** The names of the parts, passed translated; English by default. */
  labels?: Partial<DateFieldLabels>;
  /** Classes merged on the root. */
  className?: string;
};

export type DateFieldProps = Common & {
  /** The date, `YYYY-MM-DD` (controlled); `""` for none. What is typed comes back as it is, real date or not: the schema decides. */
  value?: string;
  /** The date at first, uncontrolled. */
  defaultValue?: string;
  /** Called on every key with the date typed so far (`""` when the boxes are empty). */
  onValueChange?: (value: string) => void;
  /** Called when the focus leaves the field. */
  onBlur?: () => void;
  /** `bday` for a date of birth: the browser offers to fill it. */
  autoComplete?: "bday" | "off";
};

function Caption({ id, hint, error }: { id: string; hint?: string; error?: string }) {
  const s = dateField();
  if (error)
    return (
      <p id={`${id}-error`} className={s.error()}>
        {error}
      </p>
    );
  return hint ? (
    <p id={`${id}-hint`} className={s.hint()}>
      {hint}
    </p>
  ) : null;
}

/** Day · month · year typed in the locale's order: numeric keyboards, the next box focused when one is full. */
export function DateField({ label, locale, hint, error, disabled, name, labels: given, className, value: valueProp, defaultValue = "", onValueChange, onBlur, autoComplete }: DateFieldProps) {
  const labels = { ...dateFieldLabels, ...given };
  const s = dateField();
  const id = React.useId();
  const [value, setValue] = useControllable<string>(valueProp, defaultValue, onValueChange);
  const order = React.useMemo(() => datePartsOrder(locale), [locale]);
  const [parts, setParts] = React.useState(() => splitDate(value));
  // A value set from outside (a reset, a suggestion) replaces what is in the boxes.
  if ((value ?? "") !== composeDate(parts) && composeDate(splitDate(value)) === (value ?? "")) setParts(splitDate(value));
  const refs = { day: React.useRef<HTMLInputElement>(null), month: React.useRef<HTMLInputElement>(null), year: React.useRef<HTMLInputElement>(null) };
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <fieldset className={s.root({ className })} aria-describedby={describedBy} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && onBlur?.()}>
      <legend className={s.legend()}>{label}</legend>
      <div className={s.row()}>
        {order.map((part: DatePart) => (
          <label key={part} className={s.part()}>
            {labels[part]}
            <input
              ref={refs[part]}
              inputMode="numeric"
              autoComplete={autoComplete === "bday" ? `bday-${part}` : "off"}
              maxLength={DATE_PART_LENGTH[part]}
              value={parts[part]}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              className={s.input({ className: part === "year" ? "w-20" : "w-14" })}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, DATE_PART_LENGTH[part]);
                const next = { ...parts, [part]: digits };
                setParts(next);
                setValue(composeDate(next));
                const following = order[order.indexOf(part) + 1];
                if (digits.length === DATE_PART_LENGTH[part] && following) refs[following].current?.focus();
              }}
            />
          </label>
        ))}
      </div>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <Caption id={id} hint={hint} error={error} />
    </fieldset>
  );
}

export type DateWheelProps = Common & {
  /** The date, `YYYY-MM-DD` (controlled); `""` or `null` for none (the wheels then rest on `defaultView`). */
  value?: string | null;
  /** The date at first, uncontrolled. */
  defaultValue?: string | null;
  /** Called with the date under the band, always a real date within `min` / `max`. */
  onValueChange?: (value: string) => void;
  /** The earliest date (ISO): the years start there, the days before it are refused. Default: 120 years ago. */
  min?: string;
  /** The latest date (ISO): `latestBirthDate(18)` for an age gate. Default: today. */
  max?: string;
  /** Where the wheels rest while there is no value. Default: `max` (a birth date: the youngest allowed). */
  defaultView?: string;
};

/** Day, month and year as three wheels in the locale's order, bounded by `min` and `max`: always a real date. */
export function DateWheel({ label, locale, hint, error, disabled, name, labels: given, className, value: valueProp, defaultValue = null, onValueChange, min, max, defaultView }: DateWheelProps) {
  const labels = { ...dateFieldLabels, ...given };
  const id = React.useId();
  const [value, setValue] = useControllable<string | null>(valueProp, defaultValue, (v) => v && onValueChange?.(v));
  const today = todayIso();
  const hi = max ?? today;
  const lo = min ?? isoOf(Number(today.slice(0, 4)) - 120, 1, 1);
  const shown = value || defaultView || hi;
  const { year, month, day } = isoParts(shown);
  const order = React.useMemo(() => datePartsOrder(locale), [locale]);
  const months = React.useMemo(() => monthNames(locale, "long"), [locale]);
  const number = React.useMemo(() => new Intl.NumberFormat(locale, { useGrouping: false }), [locale]);
  const inBounds = (iso: string) => iso >= lo && iso <= hi;
  const set = (y: number, m: number, d: number) => {
    let next = isoOf(y, m, d);
    if (next > hi) next = hi;
    if (next < lo) next = lo;
    setValue(next);
  };
  const lastDay = daysInMonth(year, month);
  const columns: Record<DatePart, React.ReactNode> = {
    day: (
      <Wheel
        key="day"
        label={labels.day}
        disabled={disabled}
        options={Array.from({ length: lastDay }, (_, i) => ({ value: String(i + 1), label: number.format(i + 1), disabled: !inBounds(isoOf(year, month, i + 1)) }))}
        value={String(Math.min(day, lastDay))}
        onValueChange={(v) => set(year, month, Number(v))}
        className="min-w-14"
      />
    ),
    month: (
      <Wheel
        key="month"
        label={labels.month}
        disabled={disabled}
        options={months.map((n, i) => ({ value: String(i + 1), label: n, disabled: isoOf(year, i + 1, daysInMonth(year, i + 1)) < lo || isoOf(year, i + 1, 1) > hi }))}
        value={String(month)}
        onValueChange={(v) => set(year, Number(v), day)}
        className="min-w-32 capitalize"
      />
    ),
    year: (
      <Wheel
        key="year"
        label={labels.year}
        disabled={disabled}
        options={yearRange(Number(hi.slice(0, 4)), Number(lo.slice(0, 4))).map((y) => ({ value: String(y), label: number.format(y) }))}
        value={String(year)}
        onValueChange={(v) => set(Number(v), month, day)}
        className="min-w-20"
      />
    ),
  };
  return (
    <div className={dateField().root({ className })}>
      <span aria-hidden className={dateField().legend()}>
        {label}
      </span>
      <WheelPicker label={label} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} invalid={Boolean(error)} unset={!value}>{order.map((part) => columns[part])}</WheelPicker>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <Caption id={id} hint={hint} error={error} />
    </div>
  );
}
