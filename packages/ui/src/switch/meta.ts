import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Switch",
  summary: "An on/off setting that applies at once.",
  status: "beta",
  category: "forms",
  platforms: "web",
  whenToUse: ["For a setting that takes effect immediately: autoplay, notifications, a weekly digest."],
  whenNotToUse: [
    { when: "For a choice submitted with a form, or an agreement.", use: "checkbox" },
    { when: "For more than two states.", use: "radio-group" },
    { when: "To run an action.", use: "button" },
  ],
  bestPractices: [
    "Name the setting, not the state: “Autoplay”, not “Turn autoplay on”.",
    "Put the label first and the switch at the end of the line (`Field.Label htmlFor`), with a hint when it helps.",
  ],
  accessibility: {
    keyboard: [{ keys: "Space", action: "Toggles the switch." }],
    notes: [
      "Radix Switch: `role=\"switch\"` with `aria-checked`.",
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
      { name: "with-label", title: "With a visible label", description: "A label and a hint on the same line." },
    ],
  },
} satisfies ComponentMeta;
