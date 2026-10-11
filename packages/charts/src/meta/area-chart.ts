import type { ComponentMeta } from "./types";

export const meta = {
  title: "Area chart",
  summary: "A volume over time: a line over a soft wash, or stacked areas whose parts add up to a total.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "A volume whose size matters, not only its direction: credits consumed, storage used.",
    "The parts of a total over time, stacked: credits by model, views by source.",
  ],
  whenNotToUse: [
    { when: "Several series whose lines cross: the washes would hide each other.", use: "line-chart" },
    { when: "Parts of a total at one moment.", use: "pie-chart" },
  ],
  bestPractices: [
    "Stack only parts of one total, in a stable order: the series keep their palette slot whatever is filtered.",
    "The tooltip of a stacked chart adds the total: do not add a series for it.",
    "Start at zero (the default): an area's height is read as an amount.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the points one by one: each is announced and its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last point." },
      { keys: "Esc", action: "Hides the tooltip and clears the active point." },
    ],
    notes: [
      "The plot is a group named by the title and described by a summary written from the data (extremes, trend), read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "Colour never carries a meaning alone: a legend from two series, direct labels, the table.",
      "The entrance plays once, when the chart comes on screen, and never under reduced motion.",
    ],
  },
  related: ["line-chart", "bar-chart", "pie-chart"],
  web: {
    entry: "line",
    imports: ["AreaChart"],
    examples: [
      { name: "credits-usage", title: "Credits by model", description: "Eight weeks of Orazaka credits, stacked by model, the plan's weekly allowance as a threshold." },
      { name: "storage", title: "Single area", description: "One volume over time: storage used by a workspace." },
    ],
  },
  native: {
    imports: ["AreaChart"],
    differences: [
      "No data table or export: the summary is the accessible label, swipe up and down to hear each week.",
      "A tap selects the nearest point; no hover.",
    ],
    examples: [{ name: "credits-usage", title: "Credits by model", description: "Credits stacked by model." }],
  },
} satisfies ComponentMeta;
