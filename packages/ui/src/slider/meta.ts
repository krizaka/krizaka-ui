import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Slider",
  summary: "A value or a range chosen by dragging a thumb along a track, with arrows and Page keys.",
  status: "beta",
  category: "forms",
  platforms: "web",
  whenToUse: ["For a value chosen by feel within bounds: volume, speed, brightness.", "Two thumbs for a range: a price, a duration."],
  whenNotToUse: [
    { when: "For an exact number the user knows: an input of type number.", use: "field" },
    { when: "For a few named options.", use: "radio-group" },
  ],
  bestPractices: [
    "Show the value (`showLabel`) when it matters, formatted by `formatValue`.",
    "Choose a `step` people can reach with the arrows; `origin` to fill from a centre on a ± range.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Move by one step." },
      { keys: "Page Up / Page Down", action: "Move by a larger step." },
      { keys: "Home / End", action: "Go to the minimum or the maximum." },
    ],
    notes: [
      "Radix Slider: each thumb is a `slider` named by `label` (or `thumbLabels` for a range).",
      "`formatValue` also gives `aria-valuetext`: the value as it is read.",
    ],
  },
  related: ["field", "progress", "switch"],
  web: {
    imports: ["Slider"],
    examples: [
      { name: "default", title: "Default", description: "The thumb alone, named by `label`." },
      { name: "with-label", title: "With a label", description: "`showLabel`: the label and the formatted value above the track." },
      { name: "centred", title: "Centred", description: "`origin={0}` on a ± range." },
      { name: "range", title: "Range", description: "Two thumbs, each named." },
      { name: "disabled", title: "Disabled", description: "Not available." },
    ],
  },
} satisfies ComponentMeta;
