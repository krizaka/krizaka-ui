import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Changelog page",
  summary: "What changed and why: each entry with its date and version sticking beside it, its changes by kind in words and colour, its reasons under it.",
  status: "beta",
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["Release notes, a product's changelog, a decisions log.", "Any history read newest first."],
  whenNotToUse: [
    { when: "For the decisions of one product, compared.", use: "decision-list" },
    { when: "For where things stand now." },
  ],
  bestPractices: ["Newest first; one entry per release.", "Say the kind of each change (added, changed, fixed, removed) — the colour only repeats it.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The log is a named ordered list; each date a `time` with its ISO value.", "Kinds are words, not only colours."],
  },
  related: ["decision-list", "docs-article-page"],
  web: {
    imports: ["ChangelogPage"],
    examples: [
      { name: "releases", title: "Krizaka UI releases", description: "Two releases with their changes by kind.", template: true, purpose: "explain", why: "A user checks what changed in each release and whether it concerns them." },
    ],
  },
} satisfies ComponentMeta;
