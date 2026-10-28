import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Mascot quote",
  summary:
    "A rule, a promise or a decision told by a bird: the sentence in a speech bubble, the bird under its tail and who speaks — `inline` in a card, `callout` alone in a section.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A bird quoting a rule on a site's page; on a phone the bird carries a state.", use: "mascot-state" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "To state the rule a feature stands for (the falcon watches, the owl reads, the duck builds, the flamingo answers or gets paid, the pigeon delivers, the lovebird introduces, the crane listens, the magpie keeps the score, the beaver builds the shop).",
    "A promise that deserves its own moment in a section (`callout`).",
  ],
  whenNotToUse: [
    { when: "For a bird that only decorates: a bird carries a promise, or it is not there.", use: "mascots" },
    { when: "For a status or a warning the reader must act on.", use: "alert" },
  ],
  bestPractices: [
    "One bird per idea, the same bird for the same idea everywhere.",
    "One sentence, said as a rule: short, in the present tense.",
    "The label says who speaks (`The falcon's rule`): words as props.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `figure` with a `blockquote` and its `figcaption`: read as a quote and who says it.",
      "The bird is decorative (`aria-hidden`); its idle loop pauses off screen and stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["mascots", "argument-card", "alert"],
  web: {
    imports: ["MascotQuote"],
    examples: [
      { name: "inline", title: "Inline", description: "The falcon's rule, small, beside a paragraph or inside a card." },
      { name: "callout", title: "Callout", description: "The owl's promise, alone in a section, the bird alive." },
    ],
  },
} satisfies ComponentMeta;
