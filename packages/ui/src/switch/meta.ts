import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Switch",
  summary: "An on/off setting that applies at once.",
  status: "beta",
  category: "forms",
  domain: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["For a setting that takes effect immediately: autoplay, notifications, a weekly digest."],
  whenNotToUse: [
    { when: "For a choice submitted with a form, or an agreement.", use: "checkbox" },
    { when: "For more than two states.", use: "radio-group" },
    { when: "To run an action.", use: "button" },
  ],
  bestPractices: [
    "Name the setting, not the state: “Autoplay”, not “Turn autoplay on”.",
    "Give it `children` (and a `description`): the words at the start, the switch at the end, the whole row clickable. There is no alignment prop — start and end follow the reading direction.",
  ],
  accessibility: {
    keyboard: [{ keys: "Space", action: "Toggles the switch." }],
    notes: [
      "Radix Switch: `role=\"switch\"` with `aria-checked`.",
      "With `children` the row is a `<label>`: one control, named by the words, hinted by `description` (`aria-describedby`), never read twice.",
      "`label` names it when no visible label does; otherwise use `Field.Label htmlFor` and `aria-describedby` for the hint.",
    ],
  },
  related: ["checkbox", "field", "radio-group"],
  web: {
    imports: ["Switch"],
    examples: [
      { name: "off", title: "Off", description: "Named by `label`." },
      { name: "on", title: "On", description: "`defaultChecked` (or `checked` + `onCheckedChange`)." },
      { name: "disabled", title: "Disabled", description: "Off and on." },
      { name: "small", title: "Small", description: "`size=\"sm\"`." },
      { name: "with-label", title: "With a visible label", description: "A `Field.Label` and a hint on the same line." },
      { name: "row", title: "Settings row", description: "`children` and `description`: text at the start, switch at the end, the whole row clickable (44 px)." },
    ],
  },
  native: {
    imports: ["Switch"],
    differences: [
      "Drawn by the theme, not the system's: the same switch on iOS and Android, the accent when on, a `selection` haptic when it flips (the app's `haptics`).",
      "`showLabel` makes it a settings row: the label and its `description` beside the switch, the whole row pressable, the description read as the hint.",
      "`error` shows under the row and is announced.",
    ],
    examples: [
      { name: "settings", title: "Settings rows", description: "Notification preferences: rows with a description, one disabled while push is off." },
      { name: "default", title: "Alone", description: "Named by `label`; md and sm." },
    ],
  },
} satisfies ComponentMeta;
