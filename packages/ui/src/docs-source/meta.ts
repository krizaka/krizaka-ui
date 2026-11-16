import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Docs source",
  summary: "A folder of `<page>.<locale>.md` files becomes the page list, the nav groups, the headings and the previous / next of a documentation, in one pure function.",
  status: "beta",
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Documentation is read on the sites, not inside an app." }, desktop: { status: "n/a", reason: "A public site's content, not a window of the Mac app." } },
  whenToUse: ["A product's docs written as Markdown files, French and English, rendered with `DocsArticlePage`.", "A coming-soon site that carries its documentation without a docs engine."],
  whenNotToUse: [
    { when: "For the documentation of a component, generated from its code." },
    { when: "For long editorial pieces with a layout of their own.", use: "longform-page" },
  ],
  bestPractices: [
    "One file per page and language: `getting-started.fr.md`, `getting-started.en.md`; `guides/install.en.md` makes the slug `guides/install`.",
    "Front matter: `title`, `description`, `group`, `order` (a number), `updated` (YYYY-MM-DD); only `title` is needed (or a first `#` heading).",
    "Render the body with `Markdown` and `headingIds`: its ids are the ones the contents list.",
    "A page with no file in the reader's language falls back to the default language and says so (`fallback`).",
  ],
  accessibility: {
    keyboard: [],
    notes: ["It produces data, not markup: the `nav`, the breadcrumb and the contents are `DocsNav`, `DocsArticlePage` and `Toc`.", "The page's language is the reader's; a fallback page is flagged so the app can set `lang` on it."],
  },
  related: ["docs-article-page", "docs-nav", "toc", "markdown"],
  web: {
    imports: ["docsSource"],
    examples: [{ name: "article", title: "From files to an article", description: "Three Markdown files in English and French, read into a DocsArticlePage." }],
  },
} satisfies ComponentMeta;
