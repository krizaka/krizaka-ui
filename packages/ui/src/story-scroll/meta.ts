import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Story scroll",
  summary: "One journey told while the visitor scrolls: a sticky scene that changes with each step, its light shifting colour, a guide bird and a pen stroke that joins the steps; one still plate under reduced motion.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A scroll-driven showcase of a public web page; a phone app tells the same steps with Stepper or a paged list of native screens." },
    desktop: { status: "n/a", reason: "A public site's block, not a window of the Mac app." },
  },
  whenToUse: ["A product page tells its one journey, three to five steps, on one object that changes.", "The steps must stay readable text while the scene illustrates them."],
  whenNotToUse: [
    { when: "For steps the reader clicks through, with recordings.", use: "step-showcase" },
    { when: "For a list of features side by side.", use: "card-grid" },
  ],
  bestPractices: [
    "Three to five steps, each title at most five words.",
    "The scene is markup that reacts to `data-cue` and `data-cues` (`DocumentScene` of `@krizaka/ui/product-page` for a document); keep its words out of it.",
    "A step's `light` is a brand or status role (`accent`, `accent-2`, `danger`…), never a colour.",
    "Give the guide bird of the product (`owl` reads documents); its mood follows the steps.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A named `section`; each step is an `h2`, the step in view is `aria-current=\"step\"`.",
      "The scene, the guide and the ticks are decorative (`aria-hidden`).",
      "Under reduced motion the scene is one plate at the journey's end and every step is fully legible.",
    ],
  },
  related: ["product-page", "motion-tier", "step-showcase"],
  web: {
    imports: ["StoryScroll", "STORY_CUES", "STORY_LIGHTS"],
    examples: [{ name: "document", title: "A document's journey", description: "The file arrives, is read, a clause lights up, its reference attaches, you decide under a stamp." }],
  },
} satisfies ComponentMeta;
