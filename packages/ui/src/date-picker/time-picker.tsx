// Client. A time of day, `HH:mm` on 24 hours whatever the locale shows: as wheels (hours, minutes by a step, the day
// period where the locale uses one) or as slots (the free times of an agenda, a radio group: one tab stop, the arrows
// move and pick). The words come from Intl for the `locale` given.
import * as React from "react";

import { tv } from "../tv";
import { useControllable } from "../media";
import { dayPeriods, formatTime, timeToMinutes, type TimeValue, uses12Hours } from "./parts";
import { Wheel, WheelDivider, type WheelOption, WheelPicker } from "./wheel";

export const timePicker = tv({
  slots: {
    slots: "grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2",
    slot:
      "h-11 rounded-xl border border-border-default bg-surface-2 bg-sheen px-3 text-sm font-semibold tabular-nums text-fg inset-shadow-edge " +
      "transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-border-strong active:scale-[0.97] " +
      "motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-hidden focus-visible:focus-ring " +
      "aria-checked:border-transparent aria-checked:bg-accent aria-checked:bg-fill-shade aria-checked:text-on-accent aria-checked:shadow-glow aria-checked:inset-shadow-edge-fill " +
      "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:bg-none disabled:font-normal disabled:text-fg-muted disabled:line-through disabled:shadow-none",
    group: "flex flex-col gap-2",
    heading: "text-[11px] font-semibold uppercase tracking-wider text-fg-secondary",
  },
});

export type TimePickerLabels = {
  /** The hours' wheel ("Hours"). */
  hours: string;
  /** The minutes' wheel ("Minutes"). */
  minutes: string;
  /** The day period's wheel ("AM/PM"). */
  period: string;
};

export const timePickerLabels: TimePickerLabels = { hours: "Hours", minutes: "Minutes", period: "AM/PM" };

type Shared = {
  /** The accessible name of the picker ("Pick-up time"), passed translated. */
  label: string;
  /** The BCP 47 locale: how times are written, and whether the day has a period (AM/PM). */
  locale: string;
  /** The time, `HH:mm` on 24 hours (controlled); `null` for none. */
  value?: TimeValue | null;
  /** The time at first, uncontrolled. */
  defaultValue?: TimeValue | null;
  /** Called with the time chosen. */
  onValueChange?: (value: TimeValue) => void;
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

export type TimePickerProps = Shared &
  (
    | {
        /** `wheel`: hours and minutes (and the period) as wheels — a time you set (a reminder, an alarm). */
        variant?: "wheel";
        /** The minutes' step: 1, 5 (default), 10, 15, 30. */
        minuteStep?: number;
        /** Forces 12 or 24 hours. Default: the locale's. */
        hour12?: boolean;
        /** The words of the wheels, passed translated; English by default. */
        labels?: Partial<TimePickerLabels>;
        slots?: never;
        isTimeDisabled?: never;
        groupLabels?: never;
      }
    | {
        /** `slots`: the free times as buttons — a booking, a delivery window, an appointment. */
        variant: "slots";
        /** The times offered, `HH:mm` (`timeSlots("09:00", "17:00", 30)`). */
        slots: readonly TimeValue[];
        /** Refuses some slots (taken, too soon): drawn struck through, skipped by the arrows. */
        isTimeDisabled?: (time: TimeValue) => boolean;
        /** Splits the slots under headings by part of the day: `{ morning: "Morning", afternoon: "Afternoon", evening: "Evening" }`. */
        groupLabels?: { morning: string; afternoon: string; evening: string };
        minuteStep?: never;
        hour12?: never;
        labels?: never;
      }
  );

/** A time of day: wheels to set one, or slots to book one. */
export function TimePicker(props: TimePickerProps) {
  return props.variant === "slots" ? <TimeSlots {...props} /> : <TimeWheels {...props} />;
}

function TimeWheels({ label, locale, value: valueProp, defaultValue = null, onValueChange, disabled, className, minuteStep = 5, hour12, labels: given }: Extract<TimePickerProps, { variant?: "wheel" }>) {
  const labels = { ...timePickerLabels, ...given };
  const [value, setValue] = useControllable<TimeValue | null>(valueProp, defaultValue, (v) => v && onValueChange?.(v));
  const twelve = hour12 ?? uses12Hours(locale);
  const total = timeToMinutes(value) ?? 9 * 60;
  const h24 = Math.floor(total / 60);
  const minute = total % 60;
  const pm = h24 >= 12;
  const two = (n: number) => String(n).padStart(2, "0");
  const number = React.useMemo(() => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }), [locale]);
  const hours: WheelOption[] = twelve
    ? Array.from({ length: 12 }, (_, i) => ({ value: String(i === 0 ? 12 : i), label: String(i === 0 ? 12 : i) })).sort((a, b) => (Number(a.value) % 12) - (Number(b.value) % 12))
    : Array.from({ length: 24 }, (_, i) => ({ value: String(i), label: number.format(i) }));
  const minutes: WheelOption[] = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => ({ value: String(i * minuteStep), label: number.format(i * minuteStep) }));
  // A minute that is not on the step (an existing value) is rounded to the nearest one shown.
  const shownMinute = String(Math.min(60 - minuteStep, Math.round(minute / minuteStep) * minuteStep));
  const [am, pmLabel] = dayPeriods(locale);
  const set = (h: number, m: number) => setValue(`${two(h)}:${two(m)}`);
  return (
    <WheelPicker label={`${label}, ${value ? formatTime(locale, value) : ""}`.replace(/, $/, "")} className={className}>
      <Wheel
        label={labels.hours}
        options={hours}
        disabled={disabled}
        value={twelve ? String(h24 % 12 === 0 ? 12 : h24 % 12) : String(h24)}
        onValueChange={(v) => set(twelve ? (Number(v) % 12) + (pm ? 12 : 0) : Number(v), minute)}
      />
      <WheelDivider>:</WheelDivider>
      <Wheel label={labels.minutes} options={minutes} disabled={disabled} value={shownMinute} onValueChange={(v) => set(h24, Number(v))} />
      {twelve ? (
        <Wheel
          label={labels.period}
          options={[
            { value: "am", label: am },
            { value: "pm", label: pmLabel },
          ]}
          disabled={disabled}
          value={pm ? "pm" : "am"}
          onValueChange={(v) => set((h24 % 12) + (v === "pm" ? 12 : 0), minute)}
        />
      ) : null}
    </WheelPicker>
  );
}

function TimeSlots({ label, locale, value: valueProp, defaultValue = null, onValueChange, disabled, className, slots, isTimeDisabled, groupLabels }: Extract<TimePickerProps, { variant: "slots" }>) {
  const s = timePicker();
  const [value, setValue] = useControllable<TimeValue | null>(valueProp, defaultValue, (v) => v && onValueChange?.(v));
  const enabled = slots.filter((t) => !disabled && !isTimeDisabled?.(t));
  const tabStop = value && enabled.includes(value) ? value : enabled[0];
  const root = React.useRef<HTMLDivElement>(null);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = enabled.indexOf(tabStop ?? "");
    const moves: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: enabled.length - 1 };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = enabled[(to + enabled.length) % enabled.length];
    if (!next) return;
    setValue(next);
    root.current?.querySelector<HTMLButtonElement>(`[data-time="${next}"]`)?.focus();
  };
  const button = (t: TimeValue) => {
    const off = disabled || Boolean(isTimeDisabled?.(t));
    return (
      <button
        key={t}
        type="button"
        role="radio"
        data-time={t}
        aria-checked={t === value}
        tabIndex={t === tabStop ? 0 : -1}
        disabled={off}
        className={s.slot()}
        onClick={() => setValue(t)}
      >
        {formatTime(locale, t)}
      </button>
    );
  };
  const part = (t: TimeValue) => {
    const m = timeToMinutes(t) ?? 0;
    return m < 12 * 60 ? "morning" : m < 18 * 60 ? "afternoon" : "evening";
  };
  return (
    <div ref={root} role="radiogroup" aria-label={label} aria-disabled={disabled || undefined} className={className} onKeyDown={onKeyDown}>
      {groupLabels ? (
        <div className="flex flex-col gap-4">
          {(["morning", "afternoon", "evening"] as const).map((p) => {
            const inPart = slots.filter((t) => part(t) === p);
            if (!inPart.length) return null;
            return (
              <div key={p} role="group" aria-label={groupLabels[p]} className={s.group()}>
                <span aria-hidden className={s.heading()}>
                  {groupLabels[p]}
                </span>
                <div className={s.slots()}>{inPart.map(button)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={s.slots()}>{slots.map(button)}</div>
      )}
    </div>
  );
}


