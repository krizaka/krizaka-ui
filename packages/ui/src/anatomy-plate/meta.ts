import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Anatomy plate",
  summary:
    "A component's anatomy as a naturalist's plate: the live specimen drawn large in the middle, its parts numbered around it, a hairline from each note — the plate is its own text version.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A documentation figure on a reading page; an app explains a control in its own screen." },
    desktop: "web",
  },
  whenToUse: [
    "The anatomy section of a component's documentation page: what each part is for.",
    "A product page that explains one object (a receipt, a report) part by part.",
  ],
  whenNotToUse: [
    { when: "A sequence of steps over time.", use: "stepper" },
    { when: "A list of decisions and what they cost.", use: "decision-list" },
  ],
  bestPractices: [
    "Three to six parts; each note one sentence that says why the part is there, not what it looks like.",
    "Pass the real component as the specimen, never a picture of it.",
    "Let the parts alternate sides (the default), or set `side` to keep related parts together.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The parts are ordered lists whose numbers follow the plate's (`value`); the leader lines are decorative.",
      "On a phone the plate stacks: the specimen at scale 1, then the list, no line to follow.",
      "The specimen keeps its own accessibility: it is the live component.",
    ],
  },
  related: ["component-page", "bird-plate", "footnote"],
  web: {
    imports: ["AnatomyPlate"],
    examples: [{ name: "button", title: "A button's anatomy", description: "The live Button at × 1.6, its four parts and their reasons." }],
  },
} satisfies ComponentMeta;
