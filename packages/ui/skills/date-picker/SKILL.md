---
name: krizaka-date-picker
description: Dates and times in a Krizaka app (Next.js or Expo) with @krizaka/ui/date-picker and @krizaka/ui/native — DatePicker, DateRangePicker (presets, two months), Calendar inline, MonthPicker, DayStrip, WheelPicker + Wheel, TimePicker (wheels or slots), DateField (typed) and DateWheel (an age gate), with ISO values (YYYY-MM-DD, YYYY-MM, HH:mm) and the helpers (latestBirthDate, timeSlots, ageOn, formatTime). Use it instead of <input type="date">, a date library's picker, @react-native-community/datetimepicker or a hand-made calendar.
---

# @krizaka/ui/date-picker · @krizaka/ui/native

## Rules

1. Values are ISO strings everywhere — state, address, form, API: a day `YYYY-MM-DD`, a month `YYYY-MM`, a time `HH:mm`
   (24 hours, whatever the locale shows). Format only for display (`formatTime`, `@krizaka/intl`'s `formatDate`).
2. Always pass the person's `locale`: month and day names, the first day of the week, the order of day · month · year
   and 12 / 24 hours follow it. Words of the controls (`labels`) arrive translated.
3. Pick by the task, not by habit:
   - a day near today in a form → `DatePicker`; a period → `DateRangePicker` with `presets`;
   - the month is the interface (availability, booking) → `<Calendar variant="card">` (native: `Calendar`);
   - the next days (delivery, session, agenda) → `DayStrip` (`isDateDisabled`, `isDateMarked`);
   - a time to set → `TimePicker` (wheels, `minuteStep`); a time to book → `<TimePicker variant="slots" slots={timeSlots("09:00", "17:00", 30)} isTimeDisabled={…}>`;
   - a month (billing, expiry, report) → `MonthPicker`;
   - a date of birth or any date years away → `DateField` (typed, `autoComplete="bday"`) or `DateWheel` — never a calendar.
4. Bound rather than refuse: `min` / `max`, `isDateDisabled`, `isTimeDisabled`. An age gate is
   `max={latestBirthDate(18)}` on `DateWheel`, and the same rule in the schema (`d <= latestBirthDate(18)`), checked again by the server.
5. Native haptics come from the app: `<ThemeProvider haptics={(k) => k === "selection" ? Haptics.selectionAsync() : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>`
   (expo-haptics). The platform has no native module.
6. In a form, use the form's `DateField` (`@krizaka/ui/form`: `entry="calendar" | "parts" | "wheel"`; native: wheels by
   default) — never wire a picker to a field by hand.

## Recipes

```tsx
import { DateRangePicker, DayStrip, TimePicker, timeSlots, DateWheel, latestBirthDate } from "@krizaka/ui/date-picker";

<DateRangePicker label={t("report.period")} locale={locale} value={period} onValueChange={setPeriod} max={today}
  presets={[{ label: t("report.last7"), start: addDays(today, -6), end: today }]} />
<DayStrip label={t("delivery.day")} locale={locale} value={day} onValueChange={setDay} isDateDisabled={isSunday} />
<TimePicker variant="slots" label={t("booking.time")} locale={locale} slots={timeSlots("09:00", "17:00", 30)}
  isTimeDisabled={(t) => taken.has(t)} value={time} onValueChange={setTime} />
<DateWheel label={t("signUp.birth")} locale={locale} max={latestBirthDate(18)} value={birth} onValueChange={setBirth} />
```

- Native has no popover field: put `Calendar`, `DayStrip` or the wheels in the screen or in a `Sheet`.
- A wheel is a `spinbutton` (web: ↑ ↓, Page Up / Down, Home / End) and an adjustable control on iOS / Android (swipe up
  or down with VoiceOver / TalkBack): always give each `Wheel` its `label`.
