import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Stuck",
  summary:
    "Any block stuck into the notebook: a figure, a specimen tag, a card or a taped photo, held by tape, a pin, photo corners or a lifted edge, slightly tilted from data, on the hard paper shadow of the Cahier.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "A card, a figure or a specimen tag that should look kept in the notebook, on the pages of the Cahier (www.krizaka.com's products).",
    "A block that needs a margin doodle beside it: `Stuck` hangs it in the margin.",
  ],
  whenNotToUse: [
    { when: "A photograph with its print border and caption.", use: "taped-photo" },
    { when: "Interactive chrome: a form, a table, a dialog. Tilted controls are harder to aim at.", use: "card" },
  ],
  bestPractices: [
    "Hold by what the block is: tape for a figure, a pin for a tag, corners for a print, glue for a note.",
    "Give a `seed` (the block's slug): its lean is the same on the server, on the client and in every screenshot.",
    "One lean per page, small (±2°); do not stick two neighbours at the same angle with the same hold.",
    "Keep the content first: the hold never covers text.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A plain wrapper: it adds no role and no name; what it holds keeps its own semantics.",
      "The tape, the pin, the corners and the shadow are decoration (pseudo-elements, `aria-hidden`).",
      "The tilt is a transform: nothing moves and nothing animates, under `prefers-reduced-motion` as well.",
    ],
  },
  related: ["taped-photo", "specimen-tag", "doodle", "bird-plate"],
  web: {
    imports: ["Stuck"],
    examples: [
      { name: "tag", title: "A tag, pinned", description: "A specimen tag pinned to the page, its lean read from its slug." },
      { name: "card", title: "A card, taped", description: "A card held by one strip of tape, with a doodle in the margin." },
      { name: "holds", title: "The four ways it is held", description: "Tape, a pin, photo corners and a lifted edge." },
    ],
  },
} satisfies ComponentMeta;
