import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Slot picker",
  summary: "The next free times of a service as tappable chips: a strip of days, then the day's times — each a link to the booking page or a toggle the reader presses.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "The apps pick a time in their own booking flow; a native twin of the weeks follows the first app that needs it.", use: "date-picker" }, desktop: "web" },
  whenToUse: [
    "A booking page that offers the real availability in one tap: the next days and their free times.",
    "On a shop's public page, with each time a link that opens the booking with that time chosen.",
  ],
  whenNotToUse: [
    { when: "Picking any date of a calendar, free of availability.", use: "date-picker" },
    { when: "Choosing between a few options that are not times.", use: "choice-grid" },
  ],
  bestPractices: [
    "Compute the slots on the server from the shop's availability and pass only free ones: the picker never decides what is free.",
    "Format the labels for the reader's locale and the shop's time zone (`9 h 30` in French, `9:30 AM` in English).",
    "Show the days that have a free time only, a dozen at most; say plainly when none is (`emptyLabel`).",
    "With `week`, the host loads the days of the week it is asked for (`onWeekChange`) and sets `minWeek` / `maxWeek` to what it offers; pass `weekHref` to keep the address as the state (`?week=`, and `?slot=` through each time's `href`).",
    "Put the time zone and the duration in `footer`, formatted with `@krizaka/intl` (`Montréal (UTC−4) · 45 min`); the labels of the parts of the day come from the host's messages.",
    "Use `note` for what changes the choice (`2 spots left`), not for decoration.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab, Enter or Space", action: "Moves through the week buttons, the days, then the times; Enter or Space chooses." },
      { keys: "← →", action: "Moves between the days, and between the times of a day (a full time is skipped)." },
      { keys: "Page Up, Page Down", action: "Previous or next week (`week`); focus returns to the chosen day." },
    ],
    notes: [
      "The days are toggle buttons in a group named by `label`; the chosen day is `aria-pressed`.",
      "The times are a list named by the day; each is a link, or a toggle with `aria-pressed` when it is the chosen one.",
      "With `week`, the week in words (`weekLabel`) is a polite live region: a week change is announced. The week buttons are named (`weekButtons`); at an end (`minWeek`, `maxWeek`) they are `aria-disabled`.",
      "A full time is struck out and disabled, and its `note` (`Full`) is read with it — never colour alone. Parts of the day (`groups`) are lists named `day · part`.",
      "A time that is no longer offered is a disabled button, never removed silently under the reader's finger.",
    ],
  },
  related: ["service-card", "opening-hours", "date-picker", "chip"],
  web: {
    imports: ["SlotPicker"],
    examples: [
      { name: "times", title: "Times", description: "Three days of free times; the reader presses one, and a time with few seats says so." },
      { name: "weeks", title: "Weeks", description: "← Today →: the host loads each week; times in Morning and Afternoon, a full time struck out and announced, the time zone and the duration under them." },
    ],
  },
} satisfies ComponentMeta;
