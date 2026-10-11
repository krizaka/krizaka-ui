import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Meter",
  summary:
    "A measure within a known range — a quota, a balance, a share: thresholds turn it to warning then danger (or the reverse when high is good), and split into parts it becomes a stacked bar or ring with its legend.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  whenToUse: [
    "Usage against a limit: storage, GPU minutes, API calls — with thresholds.",
    "A balance where low is bad: credits, a budget (`optimum=\"high\"`).",
    "A split: where a tip goes (90 % to the creator), the shares of a revenue (`parts`).",
  ],
  whenNotToUse: [
    { when: "For the progress of a task toward its end.", use: "progress" },
    { when: "For a figure on its own, with its trend.", use: "stat" },
  ],
  bestPractices: [
    "Say the value in words with its unit (`valueText`: “18 GB of 50 GB”): the percentage alone hides the stakes.",
    "Choose thresholds that call for an action (top up, upgrade) and say it next to the meter.",
    "Two to four parts at most; name each one, the legend is the text version of the drawing.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"meter\"` named by `label`, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext`.",
      "With `parts`, a named group whose legend lists each part with its value: the drawing is hidden, the list is read.",
      "The tone is never the only signal: the value is in words, and the thresholds should come with a message.",
    ],
  },
  related: ["progress", "stat", "number-ticker"],
  web: {
    imports: ["Meter", "MeterValue"],
    examples: [
      { name: "split", title: "A split", description: "Where a €10 tip goes: 90 % to the creator — a ring and a bar, each with its legend." },
      { name: "quota", title: "Quotas", description: "Thresholds at 70 % and 90 %: calm, warning, danger, each value in words." },
      { name: "balance", title: "A balance", description: "`optimum=\"high\"`: credits turn to danger as they run low." },
    ],
  },
} satisfies ComponentMeta;
