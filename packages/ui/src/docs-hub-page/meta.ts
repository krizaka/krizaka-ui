import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Docs hub page",
  summary: "The entry of a documentation: the search in the middle of the hero, the collections each in its product's brand with their quick links, quick starts beside the most read pages, what is new, the owl's promise.",
  status: "beta",
  category: "templates",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["The home of a documentation with several collections.", "A help centre's entry."],
  whenNotToUse: [
    { when: "For one article of the documentation.", use: "docs-article-page" },
    { when: "For a plain list of entry points.", use: "link-card" },
  ],
  bestPractices: ["The search first: most readers come to find one page.", "Each collection in its product's brand, with three or four quick links.", "What is new comes from the registries, never typed by hand.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["One `h1`; each collection a list item with its main link and a named list of quick links.", "The lists of pages are lists of links with their meta in words."],
  },
  related: ["docs-article-page", "link-card", "search-field"],
  web: {
    imports: ["DocsHubPage"],
    examples: [
      { name: "krizaka", title: "krizaka.com/docs", description: "The five collections, a quick start, the most read pages, what is new.", template: true, purpose: "explain", why: "A newcomer picks a collection, starts quickly and sees what is new, from one hub." },
    ],
  },
} satisfies ComponentMeta;
