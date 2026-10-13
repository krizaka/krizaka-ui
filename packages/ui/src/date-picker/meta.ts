import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Date picker",
  summary: "A date or a period chosen on a calendar — ISO values (`2026-10-11`) the form, the address and the API share, read in the locale's own words through @krizaka/intl.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "To schedule something on a day: a publication, an auction's end, a reminder.",
    "With `DateRangePicker` for a period: an earnings report, an audit log, a campaign — with presets.",
    "With `Calendar` alone when the month itself is the interface (availability, a booking).",
  ],
  whenNotToUse: [
    { when: "For a date of birth or a date far away: three fields (day, month, year) are faster than paging through years.", use: "field" },
    { when: "For a relative choice (“last 7 days”, “this month”) without a calendar: chips.", use: "chip" },
  ],
  bestPractices: [
    "Always pass the person's `locale`: month and day names, the first day of the week and the date's format follow it.",
    "Keep the value as an ISO date in state and in the address; format it only for display.",
    "Bound the choice with `min` / `max` and `isDateDisabled` rather than refusing after the fact.",
    "Offer presets on a period picker: most people want “Last 30 days”, not two clicks.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Move by a day or a week." },
      { keys: "Home / End", action: "First or last day of the week." },
      { keys: "Page Up / Page Down", action: "Previous or next month (with Shift: year)." },
      { keys: "Enter / Space", action: "Pick the focused day." },
      { keys: "Esc", action: "Close the calendar and return to the field." },
    ],
    notes: [
      "The APG date picker: the month is a `grid` labelled by its title, one day in the tab order, each day named by its full date.",
      "Today carries `aria-current=\"date\"`; chosen days `aria-selected`; unavailable days are disabled buttons.",
      "The month's title is a polite live region: a change of month is heard.",
      "The field is a button named by its `<label>`, with `aria-haspopup=\"dialog\"`; Radix returns the focus to it on close.",
    ],
  },
  related: ["field", "popover", "filter-bar"],
  web: {
    imports: ["DatePicker", "DateRangePicker", "Calendar"],
    examples: [
      { name: "schedule", title: "Schedule", description: "A publication date, from today on, written the way the locale writes it." },
      { name: "open", title: "Calendar open", description: "The popover open on the month: today marked, the chosen day filled." },
      { name: "range", title: "Period with presets", description: "`DateRangePicker` for an earnings report: presets beside the calendar." },
      { name: "french", title: "In French", description: "`locale=\"fr-CA\"`: the names, the order and the first day of the week follow." },
      { name: "calendar", title: "Calendar alone", description: "`Calendar` inline: the month is the interface, weekends unavailable." },
    ],
  },
  native: {
    imports: ["DateField", "datePartsOrder", "composeDate"],
    differences: [
      "`DateField` is a date typed as day, month and year (a memorable date: a birth date, an expiry), not a calendar: numeric keypads, the boxes in the locale's order, the next one focused when a box is full.",
      "The value is a `YYYY-MM-DD` string of what was typed (`\"\"` when empty), real date or not: the form's schema decides (and the server again). No native module.",
    ],
    examples: [
      { name: "birth-date", title: "Date of birth", description: "Day, month and year with `autoComplete=\"bday\"`, and the error of an under-18 date." },
    ],
  },
} satisfies ComponentMeta;
