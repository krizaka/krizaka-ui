// Client (a portal). A field-like button that opens the `Calendar` in a Popover (Radix: Escape closes, the focus
// returns to the button). The value is an ISO date (`"2026-10-11"`) — the same string in a form, an address and an
// API; the button reads it in the `locale`'s own format through `@krizaka/intl`.
import { formatDate, getDateTimeFormat } from "@krizaka/intl";
import * as React from "react";

import { CalendarGlyph, CloseGlyph } from "../glyphs";
import { useControllable } from "../media";
import { Popover } from "../popover";
import { tv } from "../tv";
import { Calendar, type CalendarLabels, calendarLabels, type CalendarProps, type DateRange, type IsoDate, toLocalDate } from "./calendar";

export const datePicker = tv({
  slots: {
    root: "flex w-full flex-col gap-1.5",
    label: "text-xs font-semibold text-fg-secondary",
    row: "relative flex w-full",
    // The field is a well (inset), the calendar opens on a raised, lit surface.
    trigger:
      "group flex h-11 w-full items-center gap-2.5 rounded-lg border border-border-default bg-surface-2 px-3 text-left text-sm text-fg inset-shadow-well " +
      "transition-[border-color,box-shadow] hover:border-border-strong focus-visible:border-accent focus-visible:outline-hidden focus-visible:focus-ring-inset " +
      "data-[state=open]:border-accent data-[placeholder]:text-fg-muted aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50 data-[clearable]:pr-10",
    icon: "h-4 w-4 shrink-0 text-fg-secondary transition-colors group-data-[state=open]:text-fg-accent",
    clear:
      "absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:focus-ring",
    content: "w-auto rounded-2xl bg-sheen p-4 shadow-floating inset-shadow-edge",
    layout: "flex flex-col gap-4 sm:flex-row",
    presets: "flex gap-1.5 overflow-x-auto pb-1 sm:w-40 sm:flex-col sm:overflow-visible sm:border-r sm:border-border-subtle sm:pb-0 sm:pr-4",
    preset:
      "inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-fg-secondary transition-colors " +
      "hover:bg-surface-3 hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring aria-pressed:bg-accent-soft aria-pressed:text-fg",
    presetNode: "node shrink-0 group-aria-pressed:node-lit",
    hint: "text-xs text-fg-secondary",
    error: "flex items-center gap-1.5 text-xs font-medium text-fg-danger before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-danger",
  },
});

export type DatePickerLabels = CalendarLabels & {
  /** The clear button ("Clear date"). */
  clear: string;
};

export const datePickerLabels: DatePickerLabels = { ...calendarLabels, clear: "Clear date" };

type Shared = Pick<CalendarProps, "locale" | "min" | "max" | "isDateDisabled" | "weekStartsOn" | "today"> & {
  /** The visible label, passed translated (also the button's accessible name, with the value). */
  label: string;
  /** Shown while nothing is chosen ("Pick a date"), passed translated. */
  placeholder?: string;
  /** `short` · `medium` (default) · `long`: how the button writes the date. */
  format?: "short" | "medium" | "long";
  /** Adds a button that empties the value. */
  clearable?: boolean;
  /** A help text under the field. */
  hint?: string;
  /** An error under the field: marks it invalid and is read with it. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** The name of a hidden input holding the ISO value, for a plain `<form>` post. */
  name?: string;
  /** Opens the calendar at first (a story, a test). */
  defaultOpen?: boolean;
  /** The words, passed translated; English by default. */
  labels?: Partial<DatePickerLabels>;
  /** Classes merged on the root. */
  className?: string;
};

export type DatePickerProps = Shared & {
  /** The chosen date, ISO (controlled); `null` for none. */
  value?: IsoDate | null;
  /** The chosen date at first, uncontrolled. */
  defaultValue?: IsoDate | null;
  /** Called with the date picked, or `null` when cleared. */
  onValueChange?: (value: IsoDate | null) => void;
};

function Field({
  shared,
  text,
  hasValue,
  onClear,
  hidden,
  open,
  setOpen,
  children,
}: {
  shared: Shared;
  text: string | null;
  hasValue: boolean;
  onClear: () => void;
  hidden: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const { label, placeholder, clearable, hint, error, disabled, name, className } = shared;
  const labels = { ...datePickerLabels, ...shared.labels };
  const s = datePicker();
  const id = React.useId();
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={s.root({ className })}>
      <label htmlFor={`${id}-trigger`} className={s.label()}>
        {label}
      </label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <div className={s.row()}>
          <Popover.Trigger asChild>
            <button
              id={`${id}-trigger`}
              type="button"
              aria-haspopup="dialog"
              aria-describedby={describedBy}
              aria-invalid={error ? true : undefined}
              disabled={disabled}
              data-placeholder={hasValue ? undefined : ""}
              data-clearable={clearable && hasValue ? "" : undefined}
              className={s.trigger()}
            >
              <CalendarGlyph className={s.icon()} />
              <span className="truncate">{text ?? placeholder ?? ""}</span>
            </button>
          </Popover.Trigger>
          {clearable && hasValue && !disabled ? (
            <button type="button" aria-label={labels.clear} className={s.clear()} onClick={onClear}>
              <CloseGlyph className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Popover.Content align="start" aria-label={label} className={s.content()}>
          {children}
        </Popover.Content>
      </Popover.Root>
      {name ? <input type="hidden" name={name} value={hidden} /> : null}
      {hint ? (
        <p id={`${id}-hint`} className={s.hint()}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={s.error()}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A date field: a button showing the date in the locale's format, a calendar in a popover, an ISO value. */
export function DatePicker({ value: valueProp, defaultValue = null, onValueChange, defaultOpen = false, ...shared }: DatePickerProps) {
  const [value, setValue] = useControllable<IsoDate | null>(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = React.useState(defaultOpen);
  const { locale, format = "medium" } = shared;
  return (
    <Field
      shared={shared}
      text={value ? formatDate(toLocalDate(value), { locale, style: format }) : null}
      hasValue={Boolean(value)}
      onClear={() => setValue(null)}
      hidden={value ?? ""}
      open={open}
      setOpen={setOpen}
    >
      <Calendar
        {...shared}
        autoFocus
        value={value}
        onSelect={(date) => {
          setValue(date);
          setOpen(false);
        }}
      />
    </Field>
  );
}

export type DateRangePreset = {
  /** Its name, passed translated ("Last 7 days"). */
  label: string;
  /** The first day, ISO. */
  start: IsoDate;
  /** The last day, ISO. */
  end: IsoDate;
};

export type DateRangePickerProps = Shared & {
  /** The chosen range (controlled); `null` for none. `end` is never `null` in a committed value. */
  value?: { start: IsoDate; end: IsoDate } | null;
  /** The range at first, uncontrolled. */
  defaultValue?: { start: IsoDate; end: IsoDate } | null;
  /** Called once both ends are chosen (or with `null` when cleared). */
  onValueChange?: (value: { start: IsoDate; end: IsoDate } | null) => void;
  /** Ranges one click away ("Last 7 days", "This month"), beside the calendar. */
  presets?: readonly DateRangePreset[];
  /** Two months side by side (default, from a phone's width up) or one. */
  numberOfMonths?: 1 | 2;
};

/** Formats a range as the locale writes one ("Oct 1 – 11, 2026"), through Intl's `formatRange` where available. */
function formatRange(locale: string, start: IsoDate, end: IsoDate, style: "short" | "medium" | "long") {
  const formatter = getDateTimeFormat(locale, { dateStyle: style }) as Intl.DateTimeFormat & { formatRange?: (a: Date, b: Date) => string };
  return formatter.formatRange
    ? formatter.formatRange(toLocalDate(start), toLocalDate(end))
    : `${formatter.format(toLocalDate(start))} – ${formatter.format(toLocalDate(end))}`;
}

/** A period field: two clicks on one calendar (the days between tinted as you hover), optional presets. */
export function DateRangePicker({ value: valueProp, defaultValue = null, onValueChange, presets, numberOfMonths = 2, defaultOpen = false, ...shared }: DateRangePickerProps) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [draft, setDraft] = React.useState<DateRange | null>(null);
  const [open, setOpenState] = React.useState(defaultOpen);
  const { locale, format = "medium" } = shared;
  const s = datePicker();
  const setOpen = (next: boolean) => {
    setOpenState(next);
    setDraft(null);
  };
  const shown: DateRange | null = draft ?? value;
  const pick = (date: IsoDate) => {
    if (!draft) setDraft({ start: date, end: null });
    else {
      const [start, end] = date < draft.start ? [date, draft.start] : [draft.start, date];
      setValue({ start, end });
      setOpen(false);
    }
  };
  return (
    <Field
      shared={shared}
      text={value ? formatRange(locale, value.start, value.end, format) : null}
      hasValue={Boolean(value)}
      onClear={() => setValue(null)}
      hidden={value ? `${value.start}/${value.end}` : ""}
      open={open}
      setOpen={setOpen}
    >
      <div className={s.layout()}>
        {presets?.length ? (
          <div className={s.presets()}>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                aria-pressed={value?.start === preset.start && value?.end === preset.end}
                className={s.preset({ className: "group" })}
                onClick={() => {
                  setValue({ start: preset.start, end: preset.end });
                  setOpen(false);
                }}
              >
                <span aria-hidden className={s.presetNode()} />
                {preset.label}
              </button>
            ))}
          </div>
        ) : null}
        <Calendar {...shared} autoFocus range={shown} onSelect={pick} numberOfMonths={numberOfMonths} />
      </div>
    </Field>
  );
}
