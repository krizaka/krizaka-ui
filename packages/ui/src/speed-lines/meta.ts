import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Speed lines",
  summary: "Manga action lines behind a hero element: a burst around it or streaks across it, drawn in SVG, deterministic and still under reduced motion.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "Behind the one element a page wants you to look at: a hero title, a live demo, a versus card.",
    "To give an action — a launch, a release — the energy of a manga panel without moving anything.",
  ],
  whenNotToUse: [
    { when: "A soft backdrop behind a whole section.", use: "section-backdrop" },
    { when: "The scene of a page, with its birds.", use: "landscape" },
  ],
  bestPractices: [
    "One burst per screen, behind one element; the lines are quiet by design (a fraction of the text's ink).",
    "Keep `clear` large enough that the lines never touch the text: the content is always the first thing read.",
    "Use `horizontal` behind a live demo that moves, and `radial` behind a title that arrives.",
    "Leave `animated` off unless the page needs a pulse: it stops under reduced motion anyway.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The lines are decoration: the SVG is hidden from assistive technology, the content in front is the real element.",
      "The lines are static; the optional pulse is removed under `prefers-reduced-motion`.",
      "The ink is a quiet text colour at low opacity, so it never competes with the content for contrast.",
    ],
  },
  related: ["section-backdrop", "doodle", "versus-card", "landscape"],
  web: {
    imports: ["SpeedLines"],
    examples: [
      { name: "hero", title: "Behind a hero", description: "A radial burst behind the title that opens a page." },
      { name: "streaks", title: "Across a demo", description: "`kind=\"horizontal\"` streaks behind a live demo." },
    ],
  },
} satisfies ComponentMeta;
