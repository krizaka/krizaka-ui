import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Stage banner",
  summary: "The announcement of a chapter: a stage and its name on one line, or, large, a stage above a title and a line — a sober eyebrow by default, a stage call that slams in for the arcade flavour.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Before a chapter's heading on a told page or a tour (“Step 02 · Payments”).",
    "To open a section that turns the story (`size=\"lg\"`): a final chapter, a reveal.",
  ],
  whenNotToUse: [
    { when: "Progress through a form or a checkout.", use: "stepper" },
    { when: "A plain eyebrow above a section's heading.", use: "page" },
  ],
  bestPractices: [
    "Few words: the stage (“Step 02”) and a name of one or two words.",
    "With `size=\"lg\"` and no heading after it, pass `titleAs=\"h2\"` so the section keeps its heading.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A paragraph by default; the large title can be a heading (`titleAs`).",
      "Its entrance plays once in a stage and never under `prefers-reduced-motion`.",
    ],
  },
  related: ["scroll-stage", "stepper", "page-hero"],
  web: {
    imports: ["StageBanner"],
    examples: [
      { name: "steps", title: "Before a chapter", description: "A stage and its name, sober then in the arcade flavour." },
      { name: "round", title: "A section's opening", description: "`size=\"lg\"`: the stage, a title and a line — sober, then a final round." },
    ],
  },
} satisfies ComponentMeta;
