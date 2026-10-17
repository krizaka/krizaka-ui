import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Docs layout",
  summary: "A documentation page in the site's frame: the pages, the article and its contents on a wide screen; on a phone the pages fold into a disclosure above the article.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Documentation is read on the sites, not inside an app." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["A documentation without a docs engine, or around one.", "Guides and references of a product."],
  whenNotToUse: [
    { when: "For a reading page of a site without a list of pages.", use: "toc" },
    { when: "For a hub of entry points.", use: "link-card" },
  ],
  bestPractices: ["The frame of the docs is wider (`--kz-page-max-docs`): give the bar the same width on these pages.", "Keep the article under 48rem; the contents list three to eight headings."],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "On a phone, opens or closes the list of pages." }
    ],
    notes: ["The pages are your `nav`; on a phone the same nav sits in a native `details`.", "The article is an `article`; the contents a `Toc`."],
  },
  related: ["toc", "page", "marketing-layout"],
  web: {
    imports: ["DocsLayout"],
    examples: [
      { name: "page", title: "A documentation page", description: "Pages, an article with two headings, its contents." },
    ],
  },
} satisfies ComponentMeta;
