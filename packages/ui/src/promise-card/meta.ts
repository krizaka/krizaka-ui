import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Promise card",
  summary:
    "A promise, the keys that call it and who carries it: a product's guarantee with its bird, a shortcut and what it does — a calm card with key-caps by default, a combo card whose keys light one by one in the arcade flavour.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding.", use: "card" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "A product's guarantee stated once, with the bird of the flock that keeps it (“Your data never leaves home”).",
    "A keyboard shortcut taught where it matters, with what it does (`keys={[\"⌘\", \"K\"]}`).",
    "On a told page, a chapter's special move (`variant=\"arcade\"`).",
  ],
  whenNotToUse: [
    { when: "A rule told by a bird inside a card or a section.", use: "mascot-quote" },
    { when: "A list of shortcuts in a menu or a help panel.", use: "kbd" },
    { when: "An argument with its reasons and a link.", use: "argument-card" },
  ],
  bestPractices: [
    "One promise per card, in a few words: something the product is held to, not a slogan.",
    "The bearer keeps its role: the owl reads, the falcon watches, the duck builds, the flamingo gets paid, the pigeon delivers, the lovebird introduces.",
    "The keys are decorative: never the only way to learn the shortcut — say it in the promise or beside it.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The keys and the bearer's picture are hidden from assistive technology; the label, the promise and the bearer's name are read.",
      "In a stage the keys light once and the promise lands; never under `prefers-reduced-motion`.",
    ],
  },
  related: ["mascot-quote", "kbd", "mascots", "scroll-stage"],
  web: {
    imports: ["PromiseCard"],
    examples: [
      { name: "guarantee", title: "A guarantee", description: "A product's promise with the bird that keeps it." },
      { name: "arcade", title: "Arcade flavour", description: "The special move of a told page: the input, then the move lands." },
    ],
  },
} satisfies ComponentMeta;
