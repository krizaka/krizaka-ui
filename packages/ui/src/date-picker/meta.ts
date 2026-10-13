import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Date picker",
  summary:
    "Dates and times chosen the way the task asks — a calendar, a period with presets, a strip of days, wheels, time slots, a month, a date of birth — as ISO values (`2026-10-11`, `2026-10`, `18:30`) the form, the address and the API share, in the locale's own words.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "`DatePicker`: a day near today in a form — a publication, an auction's end, a reminder.",
    "`DateRangePicker`: a period — an earnings report, an audit log — with presets and two months side by side.",
    "`Calendar` inline (`variant=\"card\"`): when the month itself is the interface (availability, a booking).",
    "`DayStrip`: the next days in a row (a delivery day, a session, an agenda) — one thumb away on a phone.",
    "`TimePicker`: wheels to set a time (a reminder); `variant=\"slots\"` to book one among the free times.",
    "`MonthPicker`: a month of a year (a billing month, a card's expiry, a report).",
    "`DateField` (typed) or `DateWheel` (wheels): a memorable date far away — a date of birth with an age gate.",
  ],
  whenNotToUse: [
    { when: "For a date of birth or any date years away: a calendar makes it slow — use `DateField` or `DateWheel`.", use: "field" },
    { when: "For a relative choice (“last 7 days”, “this month”) without a calendar: chips.", use: "chip" },
  ],
  bestPractices: [
    "Always pass the person's `locale`: names, the first day of the week, the order of day · month · year and 12/24 hours follow it.",
    "Keep values as ISO strings in state and in the address (`YYYY-MM-DD`, `YYYY-MM`, `HH:mm`); format them only for display.",
    "Bound the choice with `min` / `max`, `isDateDisabled` or `isTimeDisabled` rather than refusing after the fact — an age gate is `max={latestBirthDate(18)}`.",
    "Offer presets on a period picker: most people want “Last 30 days”, not two clicks.",
    "Mark the days that have something (`isDateMarked`) on a strip: the dot is read in the day's name too.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Calendar: move by a day or a week. Month picker: by a month or a row. Day strip and slots: move and pick." },
      { keys: "Home / End", action: "First or last day of the week (calendar), first or last item (strip, slots, wheel)." },
      { keys: "Page Up / Page Down", action: "Calendar: previous or next month (with Shift: year). Month picker: year. Wheel: by five values." },
      { keys: "Up / Down", action: "Wheel: the previous or next value." },
      { keys: "Enter / Space", action: "Pick the focused day or month." },
      { keys: "Esc", action: "Close the calendar and return to the field." },
    ],
    notes: [
      "The APG date picker: the month is a `grid` labelled by its month, one day in the tab order, each day named by its full date; today carries `aria-current=\"date\"`, chosen days `aria-selected`, unavailable days are disabled.",
      "The month's title is a button that opens the months of the year (`aria-expanded`); a change of month is announced by a polite live region.",
      "A wheel is a `spinbutton` (`aria-valuetext` reads the value as words); on React Native an adjustable control — swipe up or down with VoiceOver or TalkBack.",
      "The day strip and the time slots are radio groups: one tab stop, the arrows move and pick, taken or closed items are disabled and skipped.",
      "`DateField` is a fieldset named by its legend, each box named by its part; the error is read with the field (`aria-describedby`).",
      "Nothing moves under reduced motion: the month's slide stops; the wheel's curve is tied to the scroll, not to time.",
    ],
  },
  related: ["field", "popover", "filter-bar", "form"],
  web: {
    imports: ["DatePicker", "DateRangePicker", "Calendar", "MonthPicker", "DayStrip", "WheelPicker", "Wheel", "TimePicker", "DateField", "DateWheel", "latestBirthDate", "timeSlots"],
    examples: [
      { name: "schedule", title: "Schedule", description: "A publication date, from today on, written the way the locale writes it." },
      { name: "open", title: "Calendar open", description: "The popover open on the month: today's node, the chosen day lit." },
      { name: "range", title: "Period with presets", description: "`DateRangePicker` for an earnings report: presets beside two months, the period as one band." },
      { name: "french", title: "In French", description: "`locale=\"fr-CA\"`: the names, the order and the first day of the week follow." },
      { name: "calendar", title: "Inline calendar", description: "`Calendar variant=\"card\"`: the month is the interface, weekends unavailable; its title opens the months." },
      { name: "month-year", title: "Month and year", description: "`MonthPicker`: a billing month, nothing later than this one." },
      { name: "day-strip", title: "Day strip", description: "`DayStrip`: the next two weeks in a row, closed days dashed, the days with a session marked." },
      { name: "wheel", title: "Wheel", description: "`WheelPicker` + `Wheel`: any short list turned by the thumb or the arrows — a party size." },
      { name: "time-wheel", title: "Time, wheels", description: "`TimePicker`: hours, minutes by 5 and the period of a 12-hour locale; the value is `HH:mm`." },
      { name: "time-slots", title: "Time, slots", description: "`TimePicker variant=\"slots\"`: the free times of an agenda by part of the day, taken ones struck through." },
      { name: "birth-date", title: "Date of birth, typed", description: "`DateField`: day · month · year in the locale's order, autofilled, an under-18 date refused." },
      { name: "birth-date-wheel", title: "Date of birth, wheels", description: "`DateWheel` with `max` at the 18th birthday: an under-18 date cannot be chosen." },
    ],
  },
  native: {
    imports: ["Calendar", "MonthPicker", "DayStrip", "TimePicker", "DateWheel", "WheelPicker", "Wheel", "DateField", "latestBirthDate", "timeSlots"],
    differences: [
      "No popover field (`DatePicker`, `DateRangePicker`): on a phone, the `Calendar`, the `DayStrip` or the wheels sit in the screen or in a `Sheet`.",
      "`DateField` is typed (day · month · year, numeric keypads); `DateWheel` is the same date as three wheels — the native form's `DateField` uses the wheels.",
      "Each value a wheel passes, each day or slot pressed plays a `selection` haptic — when the app passes `haptics` to the `ThemeProvider` (expo-haptics): the platform has no native module.",
      "A wheel is an adjustable control for VoiceOver and TalkBack (swipe up or down), named by its `label`, its value read as words.",
    ],
    examples: [
      { name: "birth-date", title: "Date of birth, typed", description: "Day, month and year with `autoComplete=\"bday\"`, and the error of an under-18 date." },
      { name: "birth-date-wheel", title: "Date of birth, wheels", description: "`DateWheel` ending at the 18th birthday: an under-18 date cannot be chosen." },
      { name: "calendar", title: "Calendar", description: "A month to book a day: 44-pt days, today's node, the past unavailable." },
      { name: "day-strip", title: "Day strip", description: "The days ahead swiped sideways, closed days dashed, marked days with a dot." },
      { name: "time-wheel", title: "Time, wheels", description: "Hours, minutes by 5 and the period; the value is `HH:mm`." },
      { name: "time-slots", title: "Time, slots", description: "The free times of an agenda as buttons, taken ones dashed." },
      { name: "month-year", title: "Month and year", description: "`MonthPicker`: the twelve months, nothing later than this one." },
    ],
  },
} satisfies ComponentMeta;
