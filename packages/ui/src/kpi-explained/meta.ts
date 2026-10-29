import type { ComponentMeta } from "../meta";

export const meta = {
  title: "KPI explained",
  summary: "A figure with its meaning, formula, source, freshness and host-defined thresholds.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "The native twin is a follow-up; compose the same data in a native screen for now.", use: "stat" },
    desktop: "web",
  },
  whenToUse: ["A shop owner needs to understand a monthly figure, not just read a number.", "A dashboard must show the origin and age of a key figure."],
  whenNotToUse: [
    { when: "A value needs only a label and a trend.", use: "stat" },
    { when: "A reader needs to change or enter the value.", use: "field" },
  ],
  bestPractices: [
    "Give the meaning and formula in the host's plain language; thresholds and state words come from the host too.",
    "Pass the expected read time derived from the host's cadence and an injected `now` for stable rendering.",
    "Pass the host's IANA time zone for freshness dates; the default is UTC.",
    "Pass a Sparkline from `@krizaka/charts` in `sparkline`; it owns its accessible summary.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves to the optional source and verify actions." }],
    notes: [
      "The state and stale words remain visible; colour is never the only signal.",
      "When masked, the figure is replaced in the DOM and its accessible name is `maskedLabel`.",
    ],
  },
  related: ["stat", "badge", "description-list"],
  web: {
    imports: ["KpiExplained"],
    examples: [
      { name: "salon-month", title: "A salon's month", description: "A shop owner's revenue figure, explained in French with its source and read cadence." },
      { name: "founder-cockpit", title: "A founder's cockpit", description: "A masked figure for a public capture, without exposing its raw value." },
    ],
  },
} satisfies ComponentMeta;
