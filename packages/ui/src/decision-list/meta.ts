import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Decision list",
  summary:
    "The decisions behind a product, numbered: what was chosen, large, then side by side what was refused, why, and what it costs the reader — each with its mark and its colour.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  whenToUse: [
    "A product's or a building block's design decisions, explained to the people who will live with them.",
    "Any choice where the cost to the reader must be said as plainly as the benefit.",
  ],
  whenNotToUse: [
    { when: "For reasons that each lead to their own page.", use: "argument-card" },
    { when: "For steps the reader follows in order.", use: "stepper" },
  ],
  bestPractices: [
    "Always fill the cost: a decision without its cost is an advertisement.",
    "One sentence per part; the choice first, in words a newcomer understands.",
    "The four labels arrive as props (`We chose`, `We refused`, `Because`, `What it costs you`).",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "An ordered list: the number is decorative, the list says the order.",
      "Each part has its label in words; the marks (✓ ✕ → !) and the colours only repeat them.",
    ],
  },
  related: ["argument-card", "stepper", "page"],
  web: {
    imports: ["DecisionList"],
    examples: [{ name: "product", title: "A product's decisions", description: "Local inference and zero telemetry: chosen, refused, why, and what it costs." }],
  },
} satisfies ComponentMeta;
