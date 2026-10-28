import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Docs nav",
  summary: "The pages of a documentation in quiet groups: each group folds, the one holding the current page is open, only the current page is marked.",
  status: "beta",
  category: "navigation",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Documentation is read on the sites, not inside an app." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["The `sidebar` of a `DocsLayout` or `DocsArticlePage`.", "A documentation with two or more audiences (a guide, a reference) that must not be mixed."],
  whenNotToUse: [
    { when: "For the sections of one page.", use: "toc" },
    { when: "For the site's main navigation.", use: "nav-bar" },
  ],
  bestPractices: ["Titles of one line: shorten them, the page's own title says the rest.", "No icon and no emoji: the active page is the only thing that stands out."],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "Opens or closes a group." }, { keys: "Tab", action: "Walks the links of the open groups." }],
    notes: ["A `nav` named by `label`; the current page carries `aria-current=\"page\"`.", "Groups are native `details`: they work without script."],
  },
  related: ["docs-layout", "toc", "docs-article-page"],
  web: {
    imports: ["DocsNav"],
    examples: [{ name: "groups", title: "A guide and a reference", description: "Two groups, the second page current." }],
  },
} satisfies ComponentMeta;
