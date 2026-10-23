import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Versus card",
  summary: "An arcade « character select » card: two subjects face to face, a bird as each fighter, stat bars from real data, and a « VS » between them.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "To compare two releases of a tool, or a component and its alternative, on measured figures.",
    "To open a changelog or a « why this one » page with a playful, honest face-off.",
  ],
  whenNotToUse: [
    { when: "A feature-by-feature table of three subjects or more.", use: "comparison-table" },
    { when: "One subject and its numbers.", use: "stat" },
  ],
  bestPractices: [
    "Every bar is a real figure: pass the value, its maximum and the text the reader reads (`4.1 kB`), and say where the figures come from in `source`.",
    "The same stats, in the same order, on both sides: the card compares, it does not decide who wins.",
    "Choose the birds by the brand reference (the duck builds, the owl reads, the pigeon delivers), not by looks.",
    "Name the match for assistive technology with `label`: `Krizaka UI 2.7 versus 2.6`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A named section; each fighter's stats are a description list, so every figure is text. The bars repeat the numbers and are hidden from assistive technology.",
      "The birds are decoration; the « VS » is real text.",
      "On a phone the fighters stack with the mark between them; nothing moves.",
    ],
  },
  related: ["comparison-table", "stat", "grade-stamp", "speed-lines"],
  web: {
    imports: ["VersusCard"],
    examples: [
      { name: "releases", title: "Two releases", description: "Two releases of a package compared on bundle size and coverage." },
      { name: "alternatives", title: "A component and its alternative", description: "Two ways to build a dialog, compared on measured figures." },
    ],
  },
} satisfies ComponentMeta;
