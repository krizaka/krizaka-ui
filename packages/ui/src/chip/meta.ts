import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chip",
  summary: "A selectable pill: alone a toggle, in a group a single or multiple choice, or a removable tag.",
  status: "beta",
  category: "forms",
  platforms: "both",
  whenToUse: [
    "To filter a list with a few short options shown at once: format, genre, speed.",
    "`Chip.Group type=\"multiple\"` for several tags; `type=\"single\"` (with `required`) for one filter.",
    "`removable` for the values already chosen: tags, recipients, active filters.",
  ],
  whenNotToUse: [
    { when: "To switch between views of the same page.", use: "tabs" },
    { when: "To choose in a form that is submitted, with labels that read as sentences.", use: "radio-group" },
    { when: "For a status that cannot be changed.", use: "badge" },
    { when: "To run an action.", use: "button" },
  ],
  bestPractices: [
    "One or two words per chip; the group's `label` says what is being chosen.",
    "Keep the order stable when a chip is selected: do not move it to the front.",
    "Give each removable chip a `removeLabel` that names it: “Remove #night”, not “Remove”.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves into the group (one tab stop) and out of it." },
      { keys: "Arrow keys", action: "Move between the chips of a group." },
      { keys: "Space / Enter", action: "Toggles the focused chip." },
    ],
    notes: [
      "Radix Toggle and ToggleGroup: alone `aria-pressed`; in a single group a radio (`aria-checked`), in a multiple group pressed buttons.",
      "`Chip.Group` takes `label` as the group's accessible name.",
      "The remove button is a separate button named by `removeLabel`.",
    ],
  },
  related: ["tabs", "radio-group", "checkbox", "badge"],
  web: {
    imports: ["Chip"],
    examples: [
      { name: "toggle", title: "Toggle", description: "Alone, off and on: a pressed button." },
      { name: "single", title: "Single choice", description: "One choice in a group: a filter; `required` keeps one chosen." },
      { name: "multiple", title: "Multiple choice", description: "Several choices: tags." },
      { name: "small", title: "Small", description: "`size=\"sm\"` for dense toolbars." },
      { name: "removable", title: "Removable", description: "Chosen tags, each with a named remove button." },
    ],
  },
  native: {
    imports: ["Chip"],
    differences: [
      "The group's name is `aria-label` (not `label`).",
      "`scrollable` makes the group one horizontal row: a filter bar.",
      "`onPress` semantics: a chip alone is a checkbox, in a single group a radio.",
    ],
    examples: [
      { name: "toggle", title: "Toggle", description: "Off and on; `sm` and `md`; disabled." },
      { name: "single", title: "Single choice", description: "`Chip.Group type=\"single\"`: one value." },
      { name: "multiple", title: "Filter bar", description: "`type=\"multiple\" scrollable`: one horizontal row." },
      { name: "removable", title: "Removable", description: "A chosen tag with its own named remove button." },
    ],
  },
} satisfies ComponentMeta;
