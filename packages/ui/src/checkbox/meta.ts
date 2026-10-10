import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Checkbox",
  summary: "A box to check: checked, unchecked or indeterminate, with its words as one clickable label.",
  status: "beta",
  category: "forms",
  platforms: "web",
  whenToUse: [
    "In a form, for a choice that is submitted with it: accept the terms, subscribe to a list.",
    "For several independent options in a list, and “select all” (indeterminate when some are).",
  ],
  whenNotToUse: [
    { when: "For a setting that applies at once, without a submit.", use: "switch" },
    { when: "To choose one option among several.", use: "radio-group" },
    { when: "To filter a list with a few options shown as pills.", use: "chip" },
  ],
  bestPractices: [
    "Say what checking does, in the positive: “Email me the receipts”, not “Don't email me”.",
    "Pass the words as children: the whole line is the label and the click target.",
    "In a `Field`, set `invalid` and point `aria-describedby` at the `Field.Error`.",
  ],
  accessibility: {
    keyboard: [{ keys: "Space", action: "Toggles the box." }],
    notes: [
      "Radix Checkbox: `role=\"checkbox\"` with `aria-checked` true, false or mixed.",
      "The children are its label; without children, give it `aria-label` or a `Field.Label htmlFor`.",
      "`invalid` sets `aria-invalid`; the error is read through `aria-describedby`.",
    ],
  },
  related: ["switch", "radio-group", "field", "chip"],
  web: {
    imports: ["Checkbox"],
    examples: [
      { name: "unchecked", title: "Unchecked", description: "Its words as children: one clickable label." },
      { name: "checked", title: "Checked", description: "`defaultChecked` (or `checked` + `onCheckedChange`)." },
      { name: "indeterminate", title: "Indeterminate", description: "`checked=\"indeterminate\"`: some of a list." },
      { name: "disabled", title: "Disabled", description: "Not available, checked or not." },
      { name: "invalid", title: "Invalid", description: "In a `Field`, with its error." },
    ],
  },
} satisfies ComponentMeta;
