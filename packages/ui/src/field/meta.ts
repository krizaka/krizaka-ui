import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Field",
  summary:
    "A form field: a label, a hint and an error around an `Input` (with affixes), a `FloatingInput`, a `Textarea` or a native `Select` — a well that lights up with the signature focus ring.",
  status: "stable",
  category: "forms",
  platforms: "web",
  whenToUse: [
    "For every text entry of a form: email, title, description, amount.",
    "`Select` for a choice among many options (a country): the platform's own menu, right on phones.",
  ],
  whenNotToUse: [
    { when: "To turn a setting on or off.", use: "switch" },
    { when: "To choose among two to five options that should all be visible.", use: "radio-group" },
    { when: "To pick a number in a range by feel.", use: "slider" },
  ],
  bestPractices: [
    "Always a visible `Field.Label`: a placeholder is an example, never the label.",
    "Put the hint before the error is possible (“We never share it”), the error after it is: what is wrong and how to fix it.",
    "Use the right `type` (`email`, `url`, `number`) and `autoComplete`: phones show the right keyboard.",
    "`start` / `end` hold what belongs to the value (a currency, a unit, an icon, a shortcut), not a second label.",
    "`FloatingInput` for short forms where space is tight (sign-in, checkout): its label is always visible, resting or risen.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Plain HTML wiring: `Field.Label htmlFor` = the control's `id`; hint and error ids in `aria-describedby`.",
      "`invalid` sets `aria-invalid` and `data-invalid` on the control.",
      "`FloatingInput`'s label is a real `<label for>`: it names the input whether it rests in the field or has risen above the value.",
      "Affixes are inside the field but outside the input: an affix that says something the label does not (a unit) should also be in the hint or the label.",
      "A disabled control is skipped by Tab: if the value matters, prefer `readOnly`.",
    ],
  },
  related: ["checkbox", "switch", "radio-group", "slider"],
  web: {
    imports: ["Field", "Input", "FloatingInput", "Textarea", "Select"],
    examples: [
      { name: "default", title: "Default", description: "A label, an input and a hint." },
      { name: "invalid", title: "Invalid", description: "`invalid` and its error, read through `aria-describedby`." },
      { name: "disabled", title: "Disabled", description: "Not editable." },
      { name: "textarea", title: "Textarea", description: "A longer text." },
      { name: "select", title: "Select", description: "A native select." },
      { name: "affixes", title: "Affixes", description: "`start` / `end`: a currency and a unit, an icon and a shortcut, inside the field." },
      { name: "floating-label", title: "Floating label", description: "`FloatingInput`: the label rests in the field and rises above the value." },
    ],
  },
} satisfies ComponentMeta;
