import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Agenda",
  summary: "One day's appointments in time order: the times in tabular figures, the client, the service, a status chip, a small action — and a « now » line between the ones past and the ones to come.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "The native twin ships with Akinaza's mobile Today (the same props over the native List); the web one is first because the owner's day is read on a computer at the counter." }, desktop: "web" },
  whenToUse: ["The owner's day in a booking product: who comes, when, and what is next.", "Any day-bound list where the time is the key and « now » matters (a shift, a timetable)."],
  whenNotToUse: [
    { when: "What happened, newest first.", use: "activity-feed" },
    { when: "Records to sort, filter and page.", use: "data-table" },
    { when: "Picking a free time to book.", use: "slot-picker" },
  ],
  bestPractices: [
    "Pass the shop's `timeZone` and the page's `locale`, and `now` from the server, so both sides print the same times.",
    "Put the day in the URL (a `DayStrip` above) and the open appointment in the URL too (`href` + `linkAs`).",
    "One small contextual action per row (`action`), a quiet `Button` or an icon: never a full-width one.",
    "Say the status in words in a `Badge`; the dot's colour only repeats it.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter or Space", action: "Each row is one link or button; its action is the next stop." }],
    notes: ["An ordered list named by `aria-label`; the open row is `aria-current`.", "The « now » line is a list item with its time in words.", "The action is never inside the row's link."],
  },
  related: ["date-picker", "stat", "badge", "avatar", "split-view"],
  web: {
    imports: ["Agenda"],
    examples: [{ name: "day", title: "A day", description: "Four appointments, the past dimmed, the « now » line between them, a quiet action on the next ones." }],
  },
} satisfies ComponentMeta;
