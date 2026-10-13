// React Native: the dates and times of the web's `@krizaka/ui/date-picker`, with the same ISO values (`YYYY-MM-DD`,
// `YYYY-MM`, `HH:mm`) and the same helpers (`../date-picker/parts`): `Calendar`, `MonthPicker`, `DayStrip`,
// `TimePicker` (wheels or slots) and `DateWheel`. Words come from Intl for the `locale` given; the hand feels each
// choice (`selection` haptic, when the app passes `haptics` to the ThemeProvider).
import * as React from "react";
import { Pressable, ScrollView, type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  addDays,
  addMonths,
  datePartsOrder,
  dayPeriods,
  daysInMonth,
  formatTime,
  isoOf,
  isoParts,
  monthGrid,
  monthNames,
  timeToMinutes,
  type TimeValue,
  todayIso,
  toLocalDate,
  uses12Hours,
  weekStartOf,
  yearRange,
} from "../date-picker/parts";
import { useTheme } from "./theme";
import { Wheel, WheelDivider, type WheelOption, WheelPicker } from "./wheel";

const longDate = (locale: string, iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(toLocalDate(iso));
const useOwn = <T,>(value: T | undefined, initial: T) => {
  const [own, setOwn] = React.useState(initial);
  return [value !== undefined ? value : own, (next: T) => value === undefined && setOwn(next)] as const;
};

function Chevron({ direction, color }: { direction: "left" | "right"; color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <Path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </Svg>
  );
}

function NavButton({ label, direction, disabled, onPress }: { label: string; direction: "left" | "right"; disabled?: boolean; onPress: () => void }) {
  const { theme, radius } = useTheme();
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.nav, { borderRadius: radius.md, backgroundColor: pressed ? theme.surface3 : theme.surface2, borderColor: theme.borderSubtle }, disabled ? styles.disabled : null]}
    >
      <Chevron direction={direction} color={theme.textSecondary} />
    </Pressable>
  );
}

/** The node of the marks (a small diamond): today. */
function Node({ color, style }: { color: string; style?: StyleProp<ViewStyle> }) {
  return <View aria-hidden style={[styles.node, { backgroundColor: color }, style]} />;
}

export type CalendarLabels = {
  /** The previous-month button ("Previous month"). */
  previousMonth: string;
  /** The next-month button ("Next month"). */
  nextMonth: string;
};

export const calendarLabels: CalendarLabels = { previousMonth: "Previous month", nextMonth: "Next month" };

export type CalendarProps = {
  /** The BCP 47 locale of the names: always explicit. */
  locale: string;
  /** The chosen date (one-date mode). */
  value?: string | null;
  /** The chosen range (range mode): its ends lit, the days between one band. */
  range?: { start: string; end: string | null } | null;
  /** Called with the day pressed. */
  onSelect?: (date: string) => void;
  /** The month shown at first (any day of it). Default: the value's, or today's. */
  defaultMonth?: string;
  /** The earliest date that can be picked. */
  min?: string;
  /** The latest date that can be picked. */
  max?: string;
  /** Refuses some dates. */
  isDateDisabled?: (date: string) => boolean;
  /** The first day of the week, 0 = Sunday. Default: the locale's. */
  weekStartsOn?: number;
  /** Today (marked by the node). Default: the device's date. */
  today?: string;
  /** The words, passed translated; English by default. */
  labels?: Partial<CalendarLabels>;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A month to pick a day or the ends of a period — the web `Calendar`: 44-pt days, today's node, the range as a band. */
export function Calendar({ locale, value, range, onSelect, defaultMonth, min, max, isDateDisabled, weekStartsOn, today: todayProp, labels: given, style }: CalendarProps) {
  const labels = { ...calendarLabels, ...given };
  const { theme, radius, haptic } = useTheme();
  const today = todayProp ?? todayIso();
  const [month, setMonth] = React.useState(`${(defaultMonth ?? value ?? range?.start ?? today).slice(0, 7)}-01`);
  const start = weekStartsOn ?? weekStartOf(locale);
  const weeks = monthGrid(month, start);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(toLocalDate(month));
  const [lo, hi] = range?.end ? (range.start <= range.end ? [range.start, range.end] : [range.end, range.start]) : [null, null];
  const off = (iso: string) => Boolean((min && iso < min) || (max && iso > max) || isDateDisabled?.(iso));
  return (
    <View style={[styles.calendar, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.xl }, style]}>
      <View style={styles.header}>
        <NavButton label={labels.previousMonth} direction="left" disabled={Boolean(min && addDays(month, -1) < min)} onPress={() => setMonth(addMonths(month, -1))} />
        <Text role="heading" aria-live="polite" style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
        <NavButton label={labels.nextMonth} direction="right" disabled={Boolean(max && addMonths(month, 1) > max)} onPress={() => setMonth(addMonths(month, 1))} />
      </View>
      <View style={styles.week} aria-hidden>
        {weeks[0]!.map((iso) => (
          <Text key={iso} style={[styles.weekday, { color: theme.textSecondary }]}>
            {weekday.format(toLocalDate(iso))}
          </Text>
        ))}
      </View>
      <View role="radiogroup" aria-label={title}>
      {weeks.map((week) => (
        <View key={week[0]} style={styles.week}>
          {week.map((iso) => {
            const outside = iso.slice(0, 7) !== month.slice(0, 7);
            const selected = iso === value || Boolean(range && (iso === range.start || iso === range.end));
            const disabled = off(iso);
            const band = lo && hi && lo !== hi && iso >= lo && iso <= hi;
            return (
              <View
                key={iso}
                style={[
                  styles.cell,
                  band ? { backgroundColor: theme.accentSoft } : null,
                  band && iso === lo ? { borderTopLeftRadius: radius.lg, borderBottomLeftRadius: radius.lg } : null,
                  band && iso === hi ? { borderTopRightRadius: radius.lg, borderBottomRightRadius: radius.lg } : null,
                ]}
              >
                <Pressable
                  role="radio"
                  aria-label={longDate(locale, iso)}
                  aria-checked={selected}
                  aria-disabled={disabled || undefined}
                  aria-current={iso === today ? "date" : undefined}
                  disabled={disabled}
                  onPress={() => {
                    haptic("selection");
                    onSelect?.(iso);
                  }}
                  style={({ pressed }) => [
                    styles.day,
                    { borderRadius: radius.lg },
                    selected ? { backgroundColor: theme.accent } : pressed ? { backgroundColor: theme.surface3 } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: selected ? theme.onAccent : disabled ? theme.textMuted : iso === today ? theme.accentText : outside ? theme.textSecondary : theme.textPrimary,
                        fontWeight: selected || iso === today ? "700" : "400",
                        textDecorationLine: disabled ? "line-through" : "none",
                      },
                    ]}
                  >
                    {Number(iso.slice(8))}
                  </Text>
                  {iso === today ? <Node color={selected ? theme.onAccent : theme.accent} style={styles.todayNode} /> : null}
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
      </View>
    </View>
  );
}

export type MonthPickerProps = {
  /** The BCP 47 locale of the month names: always explicit. */
  locale: string;
  /** The chosen month, `YYYY-MM` (controlled); `null` for none. */
  value?: string | null;
  /** Called with the month pressed. */
  onValueChange?: (value: string) => void;
  /** The earliest month, `YYYY-MM`. */
  min?: string;
  /** The latest month, `YYYY-MM`. */
  max?: string;
  /** The words of the year buttons, passed translated. */
  labels?: { previousYear?: string; nextYear?: string };
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A month of a year: the twelve months in a grid, the year above them — the web `MonthPicker`. */
export function MonthPicker({ locale, value, onValueChange, min, max, labels, style }: MonthPickerProps) {
  const { theme, radius, haptic } = useTheme();
  const [year, setYear] = React.useState(Number((value ?? todayIso()).slice(0, 4)));
  const names = monthNames(locale, "short").map((n) => n.replace(/\.$/, ""));
  const long = monthNames(locale, "long");
  return (
    <View style={[styles.calendar, { backgroundColor: theme.surface1, borderColor: theme.borderDefault, borderRadius: radius.xl }, style]}>
      <View style={styles.header}>
        <NavButton label={labels?.previousYear ?? "Previous year"} direction="left" disabled={Boolean(min && year - 1 < Number(min.slice(0, 4)))} onPress={() => setYear(year - 1)} />
        <Text role="heading" aria-live="polite" style={[styles.title, { color: theme.textPrimary }]}>
          {year}
        </Text>
        <NavButton label={labels?.nextYear ?? "Next year"} direction="right" disabled={Boolean(max && year + 1 > Number(max.slice(0, 4)))} onPress={() => setYear(year + 1)} />
      </View>
      <View role="radiogroup" aria-label={String(year)} style={styles.months}>
        {names.map((name, i) => {
          const id = `${year}-${String(i + 1).padStart(2, "0")}`;
          const selected = id === value;
          const disabled = Boolean((min && id < min) || (max && id > max));
          return (
            <Pressable
              key={id}
              role="radio"
              aria-checked={selected}
              aria-label={`${long[i]} ${year}`}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              onPress={() => {
                haptic("selection");
                onValueChange?.(id);
              }}
              style={({ pressed }) => [styles.month, { borderRadius: radius.lg, backgroundColor: selected ? theme.accent : pressed ? theme.surface3 : "transparent" }, disabled ? styles.disabled : null]}
            >
              <Text style={[styles.monthText, { color: selected ? theme.onAccent : theme.textPrimary, fontWeight: selected ? "700" : "500" }]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export type DayStripProps = {
  /** The group's accessible name ("Delivery day"), passed translated. */
  label: string;
  /** The BCP 47 locale: always explicit. */
  locale: string;
  /** The chosen day, ISO (controlled); `null` for none. */
  value?: string | null;
  /** The chosen day at first, uncontrolled. */
  defaultValue?: string | null;
  /** Called with the day pressed. */
  onValueChange?: (value: string) => void;
  /** The first day. Default: today. */
  start?: string;
  /** How many days. Default 14. */
  days?: number;
  /** Refuses some days (closed, full). */
  isDateDisabled?: (date: string) => boolean;
  /** Marks the days that have something: a dot, and `markedLabel` in their name. */
  isDateMarked?: (date: string) => boolean;
  /** Added to the name of a marked day ("has events"), passed translated. */
  markedLabel?: string;
  /** Today (the node). Default: the device's date. */
  today?: string;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** The days ahead in a row that scrolls sideways — the web `DayStrip`: a radio group of 56×72-pt days. */
export function DayStrip({ label, locale, value: valueProp, defaultValue = null, onValueChange, start, days = 14, isDateDisabled, isDateMarked, markedLabel = "has events", today: todayProp, style }: DayStripProps) {
  const { theme, radius, haptic } = useTheme();
  const today = todayProp ?? todayIso();
  const first = start ?? today;
  const [value, setValue] = useOwn(valueProp, defaultValue);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const list = Array.from({ length: days }, (_, i) => addDays(first, i));
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} role="radiogroup" aria-label={label} contentContainerStyle={styles.strip} style={style}>
      {list.map((iso) => {
        const selected = iso === value;
        const disabled = Boolean(isDateDisabled?.(iso));
        const marked = Boolean(isDateMarked?.(iso));
        const name = longDate(locale, iso);
        return (
          <Pressable
            key={iso}
            role="radio"
            aria-checked={selected}
            aria-label={marked ? `${name}, ${markedLabel}` : name}
            aria-disabled={disabled || undefined}
            aria-current={iso === today ? "date" : undefined}
            disabled={disabled}
            onPress={() => {
              haptic("selection");
              setValue(iso);
              onValueChange?.(iso);
            }}
            style={({ pressed }) => [
              styles.stripDay,
              {
                borderRadius: radius.xl,
                backgroundColor: selected ? theme.accent : disabled ? "transparent" : theme.surface2,
                borderColor: selected ? theme.accent : theme.borderDefault,
                borderStyle: disabled ? "dashed" : "solid",
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            {iso === today ? <Node color={selected ? theme.onAccent : theme.accent} style={styles.stripNode} /> : null}
            <Text style={[styles.stripWeekday, { color: selected ? theme.onAccent : disabled ? theme.textMuted : theme.textSecondary }]}>{weekday.format(toLocalDate(iso)).replace(/\.$/, "").toUpperCase()}</Text>
            <Text style={[styles.stripNumber, { color: selected ? theme.onAccent : disabled ? theme.textMuted : theme.textPrimary }]}>{Number(iso.slice(8))}</Text>
            <View style={[styles.dot, marked ? { backgroundColor: selected ? theme.onAccent : theme.textSecondary } : null]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export type TimePickerLabels = {
  /** The hours' wheel ("Hours"). */
  hours: string;
  /** The minutes' wheel ("Minutes"). */
  minutes: string;
  /** The day period's wheel ("AM/PM"). */
  period: string;
};

export type TimePickerProps = {
  /** The accessible name ("Pick-up time"), passed translated. */
  label: string;
  /** The BCP 47 locale: how times are written, 12 or 24 hours. */
  locale: string;
  /** The time, `HH:mm` on 24 hours (controlled); `null` for none. */
  value?: TimeValue | null;
  /** The time at first, uncontrolled. */
  defaultValue?: TimeValue | null;
  /** Called with the time chosen. */
  onValueChange?: (value: TimeValue) => void;
  /** `wheel` (default: hours, minutes and the period as wheels) or `slots` (the free times as buttons). */
  variant?: "wheel" | "slots";
  /** Wheels: the minutes' step. Default 5. */
  minuteStep?: number;
  /** Wheels: forces 12 or 24 hours. Default: the locale's. */
  hour12?: boolean;
  /** Wheels: the names of the wheels, passed translated. */
  labels?: Partial<TimePickerLabels>;
  /** Slots: the times offered, `HH:mm` (`timeSlots("09:00", "17:00", 30)`). */
  slots?: readonly TimeValue[];
  /** Slots: refuses some (taken). */
  isTimeDisabled?: (time: TimeValue) => boolean;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** A time of day: wheels to set one, or slots to book one — the web `TimePicker`. */
export function TimePicker({ label, locale, value: valueProp, defaultValue = null, onValueChange, variant = "wheel", minuteStep = 5, hour12, labels: given, slots = [], isTimeDisabled, disabled, style }: TimePickerProps) {
  const { theme, radius, haptic } = useTheme();
  const [value, setOwn] = useOwn(valueProp, defaultValue);
  const set = (next: TimeValue) => {
    setOwn(next);
    onValueChange?.(next);
  };
  if (variant === "slots")
    return (
      <View role="radiogroup" aria-label={label} style={[styles.slots, style]}>
        {slots.map((t) => {
          const selected = t === value;
          const off = disabled || Boolean(isTimeDisabled?.(t));
          return (
            <Pressable
              key={t}
              role="radio"
              aria-checked={selected}
              aria-label={formatTime(locale, t)}
              aria-disabled={off || undefined}
              disabled={off}
              onPress={() => {
                haptic("selection");
                set(t);
              }}
              style={({ pressed }) => [
                styles.slot,
                {
                  borderRadius: radius.lg,
                  backgroundColor: selected ? theme.accent : off ? "transparent" : theme.surface2,
                  borderColor: selected ? theme.accent : theme.borderDefault,
                  borderStyle: off ? "dashed" : "solid",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={[styles.slotText, { color: selected ? theme.onAccent : off ? theme.textMuted : theme.textPrimary, textDecorationLine: off ? "line-through" : "none" }]}>{formatTime(locale, t)}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  const labels = { hours: "Hours", minutes: "Minutes", period: "AM/PM", ...given };
  const twelve = hour12 ?? uses12Hours(locale);
  const total = timeToMinutes(value) ?? 9 * 60;
  const h24 = Math.floor(total / 60);
  const minute = total % 60;
  const pm = h24 >= 12;
  const two = (n: number) => String(n).padStart(2, "0");
  const put = (h: number, m: number) => set(`${two(h)}:${two(m)}`);
  const hours: WheelOption[] = twelve ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => ({ value: String(h), label: String(h) })) : Array.from({ length: 24 }, (_, h) => ({ value: String(h), label: two(h) }));
  const minutes: WheelOption[] = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => ({ value: String(i * minuteStep), label: two(i * minuteStep) }));
  const [am, pmLabel] = dayPeriods(locale);
  return (
    <WheelPicker label={value ? `${label}, ${formatTime(locale, value)}` : label} style={style}>
      <Wheel label={labels.hours} options={hours} disabled={disabled} value={twelve ? String(h24 % 12 === 0 ? 12 : h24 % 12) : String(h24)} onValueChange={(v) => put(twelve ? (Number(v) % 12) + (pm ? 12 : 0) : Number(v), minute)} />
      <WheelDivider>:</WheelDivider>
      <Wheel label={labels.minutes} options={minutes} disabled={disabled} value={String(Math.min(60 - minuteStep, Math.round(minute / minuteStep) * minuteStep))} onValueChange={(v) => put(h24, Number(v))} />
      {twelve ? (
        <Wheel
          label={labels.period}
          options={[
            { value: "am", label: am },
            { value: "pm", label: pmLabel },
          ]}
          disabled={disabled}
          value={pm ? "pm" : "am"}
          onValueChange={(v) => put((h24 % 12) + (v === "pm" ? 12 : 0), minute)}
        />
      ) : null}
    </WheelPicker>
  );
}

export type DateWheelProps = {
  /** The visible label, passed translated (the group's name). */
  label: string;
  /** The BCP 47 locale: the order of the wheels, the month names. */
  locale: string;
  /** The date, `YYYY-MM-DD` (controlled); `""` or `null` for none. */
  value?: string | null;
  /** The date at first, uncontrolled. */
  defaultValue?: string | null;
  /** Called with the date under the band: always a real date within `min` / `max`. */
  onValueChange?: (value: string) => void;
  /** The earliest date (ISO). Default: 120 years ago. */
  min?: string;
  /** The latest date (ISO): `latestBirthDate(18)` for an age gate. Default: today. */
  max?: string;
  /** Where the wheels rest while there is no value. Default: `max`. */
  defaultView?: string;
  /** A help text under the wheels. */
  hint?: string;
  /** An error under the wheels: a danger edge, read and announced. Replaces the hint. */
  error?: string;
  /** The names of the wheels (`day`, `month`, `year`), passed translated. */
  labels?: Partial<Record<"day" | "month" | "year", string>>;
  /** Not available. */
  disabled?: boolean;
  /** Styles merged last. */
  style?: StyleProp<ViewStyle>;
};

/** Day, month and year as three wheels in the locale's order, bounded by `min` and `max` — the web `DateWheel`. */
export function DateWheel({ label, locale, value: valueProp, defaultValue = null, onValueChange, min, max, defaultView, hint, error, labels: given, disabled, style }: DateWheelProps) {
  const { theme } = useTheme();
  const names = { day: "Day", month: "Month", year: "Year", ...given };
  const [value, setOwn] = useOwn(valueProp, defaultValue);
  const today = todayIso();
  const hi = max ?? today;
  const lo = min ?? isoOf(Number(today.slice(0, 4)) - 120, 1, 1);
  const { year, month, day } = isoParts(value || defaultView || hi);
  const months = monthNames(locale, "long");
  const set = (y: number, m: number, d: number) => {
    let next = isoOf(y, m, d);
    if (next > hi) next = hi;
    if (next < lo) next = lo;
    setOwn(next);
    onValueChange?.(next);
  };
  const last = daysInMonth(year, month);
  const columns = {
    day: <Wheel key="day" label={names.day} disabled={disabled} options={Array.from({ length: last }, (_, i) => ({ value: String(i + 1), label: String(i + 1), disabled: isoOf(year, month, i + 1) > hi || isoOf(year, month, i + 1) < lo }))} value={String(Math.min(day, last))} onValueChange={(v) => set(year, month, Number(v))} style={styles.dayWheel} />,
    month: <Wheel key="month" label={names.month} disabled={disabled} options={months.map((n, i) => ({ value: String(i + 1), label: n, disabled: isoOf(year, i + 1, 1) > hi || isoOf(year, i + 1, daysInMonth(year, i + 1)) < lo }))} value={String(month)} onValueChange={(v) => set(year, Number(v), day)} style={styles.monthWheel} />,
    year: <Wheel key="year" label={names.year} disabled={disabled} options={yearRange(Number(hi.slice(0, 4)), Number(lo.slice(0, 4))).map((y) => ({ value: String(y), label: String(y) }))} value={String(year)} onValueChange={(v) => set(Number(v), month, day)} style={styles.yearWheel} />,
  };
  const caption = error ?? hint;
  return (
    <View style={[styles.field, style]}>
      <Text aria-hidden style={[styles.fieldLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <WheelPicker label={label} invalid={Boolean(error)} unset={!value}>
        {datePartsOrder(locale).map((part) => columns[part])}
      </WheelPicker>
      {caption ? (
        <Text role={error ? "alert" : undefined} aria-live={error ? "polite" : undefined} style={[styles.caption, { color: error ? theme.dangerText : theme.textSecondary }]}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: { padding: 12, gap: 4, borderWidth: StyleSheet.hairlineWidth, alignSelf: "flex-start" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 8 },
  title: { fontSize: 15, fontWeight: "700", textTransform: "capitalize" },
  nav: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth },
  week: { flexDirection: "row" },
  weekday: { width: 44, textAlign: "center", fontSize: 11, fontWeight: "700", paddingBottom: 4 },
  cell: { width: 44, height: 44, marginVertical: 1 },
  day: { flex: 1, alignItems: "center", justifyContent: "center" },
  dayText: { fontSize: 15, fontVariant: ["tabular-nums"] },
  node: { width: 5, height: 5, borderRadius: 1, transform: [{ rotate: "45deg" }] },
  todayNode: { position: "absolute", bottom: 5 },
  months: { flexDirection: "row", flexWrap: "wrap", width: 264, gap: 6 },
  month: { width: 84, height: 44, alignItems: "center", justifyContent: "center" },
  monthText: { fontSize: 14, textTransform: "capitalize" },
  strip: { gap: 8, paddingVertical: 4 },
  stripDay: { width: 56, height: 72, alignItems: "center", justifyContent: "center", gap: 2, borderWidth: 1 },
  stripNode: { position: "absolute", top: 6 },
  stripWeekday: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  stripNumber: { fontSize: 19, fontWeight: "700", fontVariant: ["tabular-nums"] },
  dot: { width: 6, height: 6, borderRadius: 3 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignSelf: "stretch" },
  slot: { minWidth: 88, height: 44, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  slotText: { fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
  field: { gap: 6, alignSelf: "stretch" },
  fieldLabel: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  caption: { fontSize: 12, lineHeight: 16 },
  dayWheel: { minWidth: 56 },
  monthWheel: { minWidth: 128 },
  yearWheel: { minWidth: 76 },
  disabled: { opacity: 0.4 },
});
