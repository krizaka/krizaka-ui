import type { ComponentMeta } from "./types";

export const meta = {
  title: "Goal progress",
  summary: "A pot towards its goal, in money: an arc that fills, “raised of $500” under the amount, the supporters and the time left.",
  status: "beta",
  tier: "ready-made",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "An Orochia challenge with a goal: what fans pledged so far, on the web and in the app.",
    "A crowdfunded request: the amount raised, the supporters, the deadline.",
  ],
  whenNotToUse: [
    { when: "An allowance that runs out.", use: "credit-usage" },
    { when: "A value in a range that is not money raised.", use: "gauge" },
  ],
  bestPractices: [
    "Pass amounts in minor units and the currency.",
    "Write the time left with the app's countdown and pass it in `timeLeft`.",
    "Past the goal the amount keeps counting and the arc stays full, in the success tone.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The gauge is a `meter`: the amount and “raised of $500” are its value in words.", "“Goal reached” is written, never only shown by a colour."],
  },
  related: ["gauge", "credit-usage", "price-ticker"],
  web: {
    entry: "goal",
    imports: ["GoalProgress"],
    examples: [
      { name: "challenge-pot", title: "A challenge's pot", description: "An Orochia goal halfway there, its supporters and the time left." },
      { name: "goal-reached", title: "Goal reached", description: "Past the goal: the success tone, the amount still counting." },
    ],
  },
  native: {
    imports: ["GoalProgress"],
    differences: ["`timeLeft` is a string (the app writes it); the facts are written under the gauge."],
    examples: [{ name: "challenge-pot", title: "A challenge's pot", description: "The challenge screen of the app." }],
  },
} satisfies ComponentMeta;
