import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Glossary",
  summary: "A page or panel listing terms and definitions from the host's catalogue.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "The native twin is a follow-up; present the same catalogue in a native list for now.", use: "description-list" },
    desktop: "web",
  },
  whenToUse: ["A page needs a reference list for the terms used in its figures.", "A host catalogue should be readable without opening each inline definition."],
  whenNotToUse: [
    { when: "A term needs a short inline explanation.", use: "glossary-term" },
    { when: "A record needs a general list of labels and values.", use: "description-list" },
  ],
  bestPractices: ["Pass terms and definitions from the host's catalogue, in the reading order the host chooses.", "Give each entry a stable id."],
  accessibility: {
    keyboard: [],
    notes: ["The heading labels the section; terms and definitions use a semantic description list.", "The block does not sort, translate or invent catalogue entries."],
  },
  related: ["glossary-term", "description-list", "tooltip"],
  web: {
    imports: ["Glossary"],
    examples: [{ name: "shop-terms", title: "A shop's terms", description: "A small glossary that uses the same definitions as the inline terms." }],
  },
} satisfies ComponentMeta;
