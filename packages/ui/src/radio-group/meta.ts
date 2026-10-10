import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Radio group",
  summary: "One choice among a few options, all visible: dots with their words, or whole cards.",
  status: "beta",
  category: "forms",
  platforms: "web",
  whenToUse: [
    "In a form, to choose exactly one of two to five options that should all be seen: a frequency, a quality.",
    "`RadioGroup.Card` when each option needs more than a line: an amount, a plan, a payment method.",
  ],
  whenNotToUse: [
    { when: "For many options (a country).", use: "field" },
    { when: "For independent options that can all be chosen.", use: "checkbox" },
    { when: "To filter a list at once, without a form.", use: "chip" },
    { when: "To switch between views.", use: "tabs" },
  ],
  bestPractices: [
    "Give the group a `label`: the question being answered.",
    "Pre-select the safest or most common option with `defaultValue` when there is one.",
    "Keep the labels parallel and short.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves into the group (one tab stop, on the chosen option) and out of it." },
      { keys: "Arrow keys", action: "Move to the next or previous option and choose it." },
    ],
    notes: ["Radix RadioGroup: `role=\"radiogroup\"` named by `label`, `role=\"radio\"` with `aria-checked` on each option.", "Disabled options are skipped by the arrows."],
  },
  related: ["checkbox", "chip", "field", "switch"],
  web: {
    imports: ["RadioGroup"],
    examples: [
      { name: "items", title: "Items", description: "Dots and their words, one disabled." },
      { name: "cards", title: "Cards", description: "Whole cards: the chosen one carries the accent." },
      { name: "horizontal", title: "Horizontal", description: "`orientation=\"horizontal\"`: the items in a row." },
    ],
  },
} satisfies ComponentMeta;
