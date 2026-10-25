import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chip",
  summary: "A selectable pill: alone a toggle, in a group a single or multiple choice, or a removable tag. Also the tags of a workspace: `TagChip`, with a colour marker from the closed palette.",
  status: "beta",
  category: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To filter a list with a few short options shown at once: format, genre, speed.",
    "`Chip.Group type=\"multiple\"` for several tags; `type=\"single\"` (with `required`) for one filter.",
    "`removable` for the values already chosen: tags, recipients, active filters.",
    "`TagChip` for the tags a person puts on a file (a client, an invoice, an applicant): the name with its marker, a dot or a ribbon. `MarkerPicker` recolours one from the six colours.",
  ],
  whenNotToUse: [
    { when: "To switch between views of the same page.", use: "tabs" },
    { when: "To choose in a form that is submitted, with labels that read as sentences.", use: "radio-group" },
    { when: "For the state of an entity whose kind has a status set.", use: "status-chip" },
    { when: "For a status that cannot be changed.", use: "badge" },
    { when: "To run an action.", use: "button" },
  ],
  bestPractices: [
    "One or two words per chip; the group's `label` says what is being chosen.",
    "Keep the order stable when a chip is selected: do not move it to the front.",
    "Give each removable chip a `removeLabel` that names it: “Remove #night”, not “Remove”.",
    "A marker sits beside the name and never fills the chip: the colour is never the only signal. Keep tag names short; the closed palette has six colours, the tokens `--kz-tag-<name>` and `--kz-tag-<name>-text` (≥ 3:1 and ≥ 4.5:1 on every surface).",
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
      "A marker is decorative (`aria-hidden`); the tag's name is the chip's name. `MarkerPicker` is a radio group of named swatches (arrow keys), the chosen one ticked.",
    ],
  },
  related: ["tabs", "radio-group", "checkbox", "badge", "status-chip", "tag-selector"],
  web: {
    imports: ["Chip", "TagChip", "TagMarker", "MarkerPicker"],
    examples: [
      { name: "toggle", title: "Toggle", description: "Alone, off and on: a pressed button." },
      { name: "single", title: "Single choice", description: "One choice in a group: a filter; `required` keeps one chosen." },
      { name: "multiple", title: "Multiple choice", description: "Several choices: tags." },
      { name: "small", title: "Small", description: "`size=\"sm\"` for dense toolbars." },
      { name: "removable", title: "Removable", description: "Chosen tags, each with a named remove button." },
      { name: "tags", title: "Tags with a marker", description: "`TagChip`: a client's tags as a filter, and worn tags with a ribbon marker, removable." },
      { name: "marker-picker", title: "Recolour a tag", description: "`MarkerPicker`: the six colours of the closed palette, named and ticked." },
    ],
  },
  native: {
    imports: ["Chip", "TagChip", "TagMarker", "MarkerPicker"],
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
      { name: "tags", title: "Tags with a marker", description: "`TagChip`: the marker beside the name, a dot or a ribbon." },
      { name: "marker-picker", title: "Recolour a tag", description: "`MarkerPicker`: the six colours, named and ticked." },
    ],
  },
} satisfies ComponentMeta;
