import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Progress",
  summary:
    "How far a task or a goal has come: a bar or a ring — with its words and time left, what is buffered ahead, its steps as segments, and a paused or failed state that says where it stopped.",
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
    "A long task: `showLabel` and an `eta` — the name, the percentage and the time left read as one line, and are spoken with the value.",
    "When it stops, say how: `status=\"paused\"` (it waits for something) is not `status=\"error\"` (it failed).",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"progressbar\"` named by `label`, with `aria-valuenow`, `aria-valuemax` and `aria-valuetext`.",
      "Indeterminate: no value attributes; the motion stops under `prefers-reduced-motion`.",
      "`eta` is appended to `aria-valuetext` (“64%, About 40 s left”); the visible header is a copy hidden from assistive technology.",
    ],
  },
  related: ["spinner", "skeleton", "countdown"],
  web: {
    imports: ["Progress"],
    examples: [
      { name: "upload", title: "An upload with its time left", description: "`showLabel` and `eta`: the file, the percentage and the time left above the bar." },
      { name: "steps", title: "Steps", description: "`segments`: 3 of 5 steps on a bar, 7 of 10 on a ring." },
      { name: "buffer", title: "Buffered ahead", description: "`buffer`: a player's timeline, what is loaded ahead in a lighter fill." },
      { name: "statuses", title: "Paused and failed", description: "`status`: striped at rest when waiting, the danger colour where it failed." },
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
