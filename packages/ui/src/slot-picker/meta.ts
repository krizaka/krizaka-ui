import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Slot picker",
  summary: "The next free times of a service as tappable chips: a strip of days, then the day's times — each a link to the booking page or a toggle the reader presses.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "The apps pick a time in their own booking flow.", use: "date-picker" }, desktop: "web" },
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
    "Use `note` for what changes the choice (`2 spots left`), not for decoration.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter or Space", action: "Moves through the days, then the times; Enter or Space chooses." }],
    notes: [
      "The days are toggle buttons in a group named by `label`; the chosen day is `aria-pressed`.",
      "The times are a list named by the day; each is a link, or a toggle with `aria-pressed` when it is the chosen one.",
      "A time that is no longer offered is a disabled button, never removed silently under the reader's finger.",
    ],
  },
  related: ["service-card", "opening-hours", "date-picker", "chip"],
  web: {
    imports: ["SlotPicker"],
    examples: [{ name: "times", title: "Times", description: "Three days of free times; the reader presses one, and a time with few seats says so." }],
  },
} satisfies ComponentMeta;
