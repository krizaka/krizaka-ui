import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Slider",
  summary: "A value or a range chosen by dragging a thumb along a track — steps you can see, the value floating over the thumb, the brand\u2019s gradient, horizontal or vertical — with arrows and Page keys.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: ["For a value chosen by feel within bounds: volume, speed, brightness.", "Two thumbs for a range: a price, a duration."],
  whenNotToUse: [
    { when: "For an exact number the user knows: an input of type number.", use: "field" },
    { when: "For a few named options.", use: "radio-group" },
  ],
  bestPractices: [
    "Show the value (`showLabel`) when it matters, formatted by `formatValue`.",
    "Choose a `step` people can reach with the arrows; `origin` to fill from a centre on a ± range.",
    "Show the steps (`ticks`) when there are few of them, and name the ends (`marks`) when the bounds are not obvious.",
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
      { name: "stepped", title: "Steps and marks", description: "`ticks` draws a graduation per step, `marks` their words under the track." },
      { name: "floating", title: "Floating value", description: "`floatingValue`: the value over the thumb while it is touched; `size=\"lg\"`." },
      { name: "price-range", title: "Price range", description: "Two thumbs, their values floating, the bounds written under the track." },
      { name: "vertical", title: "Vertical", description: "`orientation=\"vertical\"`: faders; `tone=\"solid\"` for the accent alone." },
    ],
  },
  native: {
    imports: ["Slider"],
    differences: [
      "Drawn by the theme with a pan responder: drag anywhere on the track, the nearest thumb follows; a `selection` haptic at each step passed (the app's `haptics`).",
      "Each thumb is an adjustable control for VoiceOver and TalkBack: swipe up or down by a step, its value read as words.",
      "`floatingValue` shows the value over the thumb while it is dragged (`\"always\"`: at rest too).",
    ],
    examples: [
      { name: "default", title: "Default", description: "One value, labelled, the value floating while dragged." },
      { name: "stepped", title: "Steps and marks", description: "A graduation per step, words under the track." },
      { name: "range", title: "Range", description: "Two named thumbs in the brand's gradient." },
      { name: "vertical", title: "Vertical", description: "Faders, the accent alone." },
    ],
  },
} satisfies ComponentMeta;
