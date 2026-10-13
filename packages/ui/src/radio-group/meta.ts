import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Radio group",
  summary: "One choice among a few options, all visible: dots with their words, whole cards, tactile keys that press in, or a segmented control.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "In a form, to choose exactly one of two to five options that should all be seen: a frequency, a quality.",
    "`RadioGroup.Card` when each option needs more than a line: an amount, a plan, a payment method.",
    "`RadioGroup.Button` (`variant=\"buttons\"`) for short, tactile choices made in a tap: a size, a tip, a level.",
    "`RadioGroup.Segment` (`variant=\"segmented\"`) for two to four short choices of a form on one line: a billing period, a unit.",
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
    notes: ["Radix RadioGroup: `role=\"radiogroup\"` named by `label`, `role=\"radio\"` with `aria-checked` on each option.", "Disabled options are skipped by the arrows.", "A tactile key\u2019s `hint` is part of its name; the pressed look follows the checked state, never colour alone (it sinks)."],
  },
  related: ["checkbox", "chip", "field", "switch"],
  web: {
    imports: ["RadioGroup"],
    examples: [
      { name: "items", title: "Items", description: "Dots and their words, one disabled." },
      { name: "cards", title: "Cards", description: "Whole cards: the chosen one carries the accent." },
      { name: "horizontal", title: "Horizontal", description: "`orientation=\"horizontal\"`: the items in a row." },
      { name: "buttons", title: "Tactile keys", description: "`variant=\"buttons\"`: keys raised on their ledge, pressed in while held — the chosen one stays sunk." },
      { name: "segmented", title: "Segmented", description: "`variant=\"segmented\"`: one light glides to the chosen segment." },
    ],
  },
  native: {
    imports: ["RadioGroup"],
    differences: [
      "One component with `options` (`value`, `label`, `description`, `hint`, `disabled`) and `variant` — no `Item` / `Card` / `Button` / `Segment` parts.",
      "Each press plays a haptic when the app passes `haptics`: `impact` for a tactile key, `selection` otherwise.",
      "`error` shows under the group and is announced.",
    ],
    examples: [
      { name: "list", title: "List", description: "Dots and their words in 44-pt rows, one disabled." },
      { name: "buttons", title: "Tactile keys", description: "Keys on a ledge that sink when pressed and stay sunk once chosen." },
      { name: "cards", title: "Cards", description: "Whole cards, the chosen one tinted with its check lit." },
      { name: "segmented", title: "Segmented", description: "A track of equal segments: a form's choice." },
    ],
  },
} satisfies ComponentMeta;
