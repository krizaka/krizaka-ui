import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Bird plate",
  summary:
    "The flock as a naturalist's plate: each bird a numbered figure, a hairline from the drawing to its caption, and the caption is its promise as the film says it.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "An app's welcome or empty state can carry its bird as a plate; it comes with the native paper roles." },
    desktop: "web",
  },
  whenToUse: [
    "The promises of the family on a home or a story page: the five birds of the film, numbered.",
    "The subject of a page, one bird large with its promise (`layout=\"single\"`): the owl on a reading product.",
  ],
  whenNotToUse: [
    { when: "A rule said in a sentence inside a card or a section.", use: "mascot-quote" },
    { when: "A bird reacting to a state (a wait, an error, an empty list).", use: "mascot-state" },
  ],
  bestPractices: [
    "One bird per subject, its promise word for word as the film says it (the brand reference, §2): never a new promise line.",
    "Keep the birds' own colours (`tone=\"own\"`) on a plate; `brand` only when the plate sits in a product's world.",
    "Number from where the page left off (`start`): a story that continues Plate I starts at fig. 6.",
    "The birds stay still by default; turn `animated` on for one plate per page at most.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The plate is a `figure` with its title as `figcaption`; the figures are an ordered list, each caption real text.",
      "The birds are decorative (`aria-hidden`): the caption says who they are and what they promise.",
      "With `animated`, the loops pause off screen and stop under `prefers-reduced-motion`.",
    ],
  },
  related: ["mascots", "mascot-quote", "specimen-tag"],
  web: {
    imports: ["BirdPlate"],
    examples: [
      { name: "flock", title: "The flock", description: "Plate I: the five birds of the film, each numbered with its promise." },
      { name: "single", title: "One bird", description: "`layout=\"single\"`: one bird, large, its caption beside it." },
    ],
  },
} satisfies ComponentMeta;
