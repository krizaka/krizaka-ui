import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Docs article page",
  summary: "A documentation article in the docs frame: the pages, the breadcrumb, the title with its facts, the reading column, the contents, previous and next.",
  status: "beta",
  category: "templates",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["Guides, references, concepts.", "Any page of a documentation with a list of pages."],
  whenNotToUse: [
    { when: "For the documentation's entry.", use: "docs-hub-page" },
    { when: "For a component's generated page.", use: "component-page" },
  ],
  bestPractices: ["Keep the reading column under 46rem; headings `h2` with ids for the contents.", "Say when the page was updated and how long it takes to read.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The breadcrumb is a named `nav` with an ordered list; previous and next a named `nav`.", "On a phone the pages fold into a disclosure; the contents become chips."],
  },
  related: ["docs-layout", "toc", "docs-hub-page"],
  web: {
    imports: ["DocsArticlePage"],
    examples: [
      { name: "cli", title: "Orazaka's CLI", description: "An article with its pages, breadcrumb, facts, contents and pager.", template: true, purpose: "explain", why: "A reader follows one article, always knowing where they are, what it covers and what comes next." },
      { name: "faq", title: "FAQ", description: "Questions as disclosures, each with a short answer, the contents beside them.", template: true, purpose: "explain", why: "A reader finds the one answer they came for without reading a page." },
    ],
  },
} satisfies ComponentMeta;
