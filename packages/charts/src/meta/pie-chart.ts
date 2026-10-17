import type { ComponentMeta } from "./types";

export const meta = {
  title: "Pie and donut chart",
  summary: "Part of a whole: slices sorted by size, folded into “Other” past six, each share written in the legend; a donut carries the total in its hole.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  parity: { desktop: "web" },
  engine: "svg",
  whenToUse: [
    "How one total splits at one moment: credits spent by model this month, storage by kind.",
    "Two to six parts, one of which clearly dominates or is clearly small.",
  ],
  whenNotToUse: [
    { when: "Parts compared precisely, or more than six of them.", use: "bar-chart" },
    { when: "Parts that change over time.", use: "area-chart" },
    { when: "Nested parts (a team, then its projects).", use: "treemap" },
  ],
  bestPractices: [
    "Prefer the donut (`DonutChart`) with `centerLabel`: the total is the first thing a reader looks for.",
    "Name the folded slice in your language with `otherLabel`.",
    "Never put two pies side by side to compare them: use bars.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves the focus to the plot (one tab stop), then to the data and export buttons." },
      { keys: "Arrow keys", action: "Walk the items one by one: each is announced and its tooltip shown." },
      { keys: "Home / End", action: "Jump to the first or the last item." },
      { keys: "Esc", action: "Hides the tooltip and clears the active item." },
      { keys: "Enter", action: "Selects the active slice (calls `onSelect` with its row)." },
    ],
    notes: [
      "The plot is a group named by the title and described by a summary written from the data, read before anything else.",
      "The data table is always in the page for assistive technology; “Show data” reveals it for everyone.",
      "Colour never carries a meaning alone: the legend, the labels and the table say it in words.",
      "The entrance plays once, when the chart comes on screen, and never under reduced motion.",
      "A 2 px gap in the surface colour separates the slices.",
    ],
  },
  related: ["bar-chart", "treemap", "gauge"],
  web: {
    entry: "pie",
    imports: ["DonutChart", "PieChart"],
    examples: [
      { name: "credit-spend", title: "Donut", description: "This month's Orazaka credits by model, the total in the hole." },
      { name: "storage-by-kind", title: "Pie", description: "Storage by kind of file, the small kinds folded into “Other”." },
    ],
  },
  native: {
    imports: ["DonutChart", "PieChart"],
    differences: ["No tooltip: swipe up and down on the chart to hear each slice and its share.", "No `onSelect`, no data table."],
    examples: [{ name: "credit-spend", title: "Donut", description: "Credits by model, the total in the hole." }],
  },
} satisfies ComponentMeta;
