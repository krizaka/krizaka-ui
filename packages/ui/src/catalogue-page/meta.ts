import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Catalogue page",
  summary: "A catalogue or an index: the search in the hero, the filters in a sticky column beside the results (folded above them on a phone), the count, the results.",
  status: "beta",
  category: "templates",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["Components, packs, use cases, repositories.", "Any index the reader narrows down."],
  whenNotToUse: [
    { when: "For media to look at.", use: "gallery-page" },
    { when: "For rows to sort and select.", use: "data-table" },
  ],
  bestPractices: ["Filters as links: the address keeps them, back works.", "Say the count in words, politely announced.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The count is a polite live region; the filters a native disclosure on a phone.", "Results are a list of links."],
  },
  related: ["filter-bar", "chip-link", "card-grid"],
  web: {
    imports: ["CataloguePage"],
    examples: [
      { name: "components", title: "Components", description: "Krizaka UI's components: search, platform filters, compact link cards.", template: true, purpose: "explain", why: "A reader looking for the right piece scans a filterable catalogue instead of reading every page." },
    ],
  },
} satisfies ComponentMeta;
