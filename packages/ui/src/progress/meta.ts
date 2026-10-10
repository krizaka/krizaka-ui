import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Progress",
  summary: "How far a task or a goal has come: a bar or a ring, determinate or indeterminate.",
  status: "beta",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "For a task with a known end: an upload, a processing step, a profile to complete.",
    "A ring with its amount in the centre for a goal: money raised, steps done.",
    "Indeterminate (no `value`) for a wait of unknown length inside a layout.",
  ],
  whenNotToUse: [
    { when: "For a short, unknown wait with nothing to show.", use: "spinner" },
    { when: "While the content of a page loads.", use: "skeleton" },
    { when: "For the time left until a moment.", use: "countdown" },
  ],
  bestPractices: [
    "Always a `label` (“Upload”), translated: it names the bar.",
    "Give `valueText` when the percentage is not what matters (“$420 of $1,000”).",
    "Do not move the bar backwards: if a task restarts, say so.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"progressbar\"` named by `label`, with `aria-valuenow`, `aria-valuemax` and `aria-valuetext`.",
      "Indeterminate: no value attributes; the motion stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["spinner", "skeleton", "countdown"],
  web: {
    imports: ["Progress"],
    examples: [
      { name: "bar", title: "Bar", description: "A task with a known end." },
      { name: "bar-sizes", title: "Bar sizes", description: "`sm`, `md`, `lg`." },
      { name: "bar-indeterminate", title: "Indeterminate bar", description: "A wait of unknown length." },
      { name: "ring", title: "Ring", description: "A goal with its amount in the centre." },
      { name: "ring-indeterminate", title: "Indeterminate ring", description: "A ring without a value." },
    ],
  },
  native: {
    imports: ["Progress"],
    differences: ["The ring's centre is native text (`Txt`).", "Style with `style`, not `className`."],
    examples: [
      { name: "bar", title: "Bar", description: "`sm`, `md`, `lg`." },
      { name: "ring", title: "Ring", description: "A ring with its centre: an amount, a percentage." },
      { name: "indeterminate", title: "Indeterminate", description: "No value: a wait of unknown length." },
    ],
  },
} satisfies ComponentMeta;
