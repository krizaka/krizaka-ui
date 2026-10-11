import type { ComponentMeta } from "./types";

export const meta = {
  title: "Credit usage",
  summary: "What is left of an allowance: the remaining amount in large, a meter that turns to warning then danger, the use per day and the day it runs out.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "Orazaka's billing: the credits left this month and when they run out at the current pace.",
    "A storage plan (Orochia's console): gigabytes used of the plan, with a unit format.",
    "Any quota that renews: API calls, minutes of video.",
  ],
  whenNotToUse: [
    { when: "Money raised towards a goal.", use: "goal-progress" },
    { when: "A value in a range with no notion of running out (a load, a score).", use: "gauge" },
  ],
  bestPractices: [
    "Pass the use of the recent days: the projection and the sparkline need it.",
    "Pass `now` from the server when the page is server-rendered: both sides write the same date.",
    "Lead with what is left, not what is used: it is what people decide on.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The meter is a `meter` named by the title, its value said in words (“3,120 used (62 %)”).",
      "The warning and danger tones come with words: the projection says when it runs out.",
    ],
  },
  related: ["gauge", "sparkline", "goal-progress"],
  web: {
    entry: "credits",
    imports: ["CreditUsage"],
    examples: [
      { name: "monthly-credits", title: "Monthly credits", description: "An Orazaka plan: credits left, the daily use, the run-out date." },
      { name: "storage-plan", title: "Storage plan", description: "Orochia's console: gigabytes of the plan, past the warning level." },
    ],
  },
  native: {
    imports: ["CreditUsage"],
    differences: ["No `description`, `loading` or `className`: lay it out with `style`.", "The daily use is a native sparkline, read as one element."],
    examples: [{ name: "monthly-credits", title: "Monthly credits", description: "The credits card of the mobile app." }],
  },
} satisfies ComponentMeta;
