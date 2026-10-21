import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Flock",
  summary:
    "The Krizaka birds standing on a stage, alive: each at ease in character, two neighbours glancing at each other, the pigeon carrying its parcel across, a bird looking up when you come near or tap it.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A decorative stage for a public page's first screen; an app screen speaks with MascotState.", use: "mascot-state" },
    desktop: "web",
  },
  whenToUse: [
    "On a company's home, where the flock is the scene: five birds on a ridge, under the words.",
    "On an about or story page, where the birds are the subject and a still drawing would feel dead.",
  ],
  whenNotToUse: [
    { when: "A bird that answers a state (a wait, an error, an empty list).", use: "mascot-state" },
    { when: "One bird at ease inside a card or beside a rule.", use: "mascots" },
    { when: "The flock as a still plate with its promises.", use: "bird-plate" },
  ],
  bestPractices: [
    "One flock per page, under the words and never behind them: the birds are the scene, not the message.",
    "Give the stage the ratio of its backdrop (`ratio`) and the birds' places in percent: they keep their positions at any width.",
    "Keep each bird to its job: the falcon watches, the owl reads, the duck builds, the flamingo answers, the pigeon delivers.",
    "Make it the page's own: `active` is the bird of the product the reader is on (it looks up and jumps), `greet` has every bird jump once as the flock comes into view, `tempo` makes the moments more frequent.",
    "Turn a moment off with `glance={false}`, `courier={false}` or `react={false}` on a page that already moves.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative (`aria-hidden`): it never carries information; put the words beside it.",
      "Under `prefers-reduced-motion` the birds are still: no idle motion, no glance, no delivery, no reaction.",
      "The moments pause while the flock is off screen and while the tab is hidden; there is no frame loop.",
    ],
  },
  related: ["mascots", "mascot-state", "bird-plate", "landscape"],
  web: {
    imports: ["Flock"],
    examples: [
      { name: "ridge", title: "The flock on its ridge", description: "Five birds across a stage, each at ease; neighbours glance, the pigeon delivers." },
      { name: "pair", title: "Two birds", description: "The owl and the duck: they look at each other now and then." },
    ],
  },
} satisfies ComponentMeta;
