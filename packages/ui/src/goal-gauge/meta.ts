import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Goal gauge",
  summary:
    "A goal counted in steps — 6 of 10 backers, 3 dares done, 3 seats left: a meter whose reached steps light one by one (or whose spent ones drain) when its chapter plays.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "A challenge's goal, counted in backers, dares or steps.",
    "What is left of something countable: seats, tickets, lives (`mode=\"drain\"`).",
    "On a told page, problems that fall one by one (the arcade boss gauge).",
  ],
  whenNotToUse: [
    { when: "A continuous measure against a range (storage, credits).", use: "meter" },
    { when: "The progress of a running task.", use: "progress" },
    { when: "Steps of a flow the person goes through.", use: "stepper" },
  ],
  bestPractices: [
    "Two to twenty-four steps: beyond, use a `Meter`.",
    "Always say the value in words (`valueText`: “6 of 10 backers”).",
    "Pair it with the action that moves it (back the challenge, book a seat).",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"meter\"` named by `label`, with `aria-valuenow`, `aria-valuemax` (the steps) and `aria-valuetext`.",
      "The segments are drawn, not read: the value is in words, and lit steps are not told by colour alone (the count says it).",
      "The steps light once in a stage and never under `prefers-reduced-motion`.",
    ],
  },
  related: ["meter", "progress", "stepper", "achievement"],
  web: {
    imports: ["GoalGauge"],
    examples: [
      { name: "challenge", title: "A challenge's goal", description: "6 backers of 10: the reached steps light one by one." },
      { name: "drain", title: "What is left", description: "`mode=\"drain\"`: 3 seats left of 12, the spent ones empty one by one." },
      { name: "arcade", title: "Arcade flavour", description: "The boss gauge: every head sealed, the gauge empty." },
    ],
  },
  native: {
    imports: ["GoalGauge"],
    differences: ["The steps light once on mount (`animated`), not on scroll.", "`drain` keeps the default look's final state: the spent steps do not fade on mobile, except in the arcade flavour."],
    examples: [{ name: "default", title: "Default", description: "A challenge's goal and the seats left of a drop." }],
  },
} satisfies ComponentMeta;
