import type { ComponentMeta } from "./types";

export const meta = {
  title: "Gauge",
  summary: "One value against its range on a 240° arc: zones that change its tone, a target tick, the value written in the middle.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  engine: "svg",
  whenToUse: [
    "A quota: credits used of a plan, with a warning zone before the limit.",
    "Progress towards a goal with a target: a challenge's escrow against its objective.",
    "A load or a score that has a known range.",
  ],
  whenNotToUse: [
    { when: "Several values side by side (a gauge per item takes room and compares badly).", use: "bar-chart" },
    { when: "A value without a meaningful range.", use: "sparkline" },
  ],
  bestPractices: [
    "Say the range in `caption` (“of 50,000 credits”): the arc alone is not a number.",
    "Give zones their meaning in `label` (“Over quota”): it is read in the summary.",
    "Use one gauge per screen at most; a row of figures reads better as stats.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The gauge is a `meter`: its name is the title, its value, range and text (value and caption) are exposed.",
      "The zone's tone is never the only signal: its label is in the summary.",
      "The arc fills once, when the gauge comes on screen, and never under reduced motion.",
    ],
  },
  related: ["pie-chart", "sparkline", "bar-chart"],
  web: {
    entry: "gauge",
    imports: ["Gauge"],
    examples: [
      { name: "credits-quota", title: "Quota", description: "Credits used of a plan: green, then warning past 80 %, danger past the plan." },
      { name: "challenge-goal", title: "Goal", description: "A challenge's escrowed amount against its objective, a target tick on the arc." },
    ],
  },
  native: {
    imports: ["Gauge"],
    differences: ["No zone bands around the arc: the value takes the zone's tone.", "The summary is the accessible label (no meter role in React Native)."],
    examples: [{ name: "credits-quota", title: "Quota", description: "Credits used of a plan." }],
  },
} satisfies ComponentMeta;
