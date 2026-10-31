import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Site footer",
  summary:
    "The footer of every Krizaka site and app, compact: at most three lines on a desktop. The site's own links, the family grouped inline (names from `org.family`; shown on krizaka.com, opt-in elsewhere), then the signature, version, legal links and the host's controls.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A site's footer; an app has none." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The bottom of every page of every Krizaka site — www, blog, ui., java., ts., lab. (`tone=\"cahier\"`) and the products' sites (`tone=\"product\"`): pass `org` from `@krizaka/org`, so every name, address, signature and legal link is the org's.",
    "`variant=\"docs\"` — under documentation pages: the same three lines on the documentation's width.",
    "`variant=\"app\"` — inside a signed-in product or an admin console: the last line only (signature, version, legal), rendered once by the layout.",
    "With `MarketingLayout`'s `footer` slot, under a bar of `@krizaka/ui/nav-bar` with `NavBar.Family`.",
  ],
  whenNotToUse: [
    { when: "Twice on one page: a page that already sits under a layout's footer renders none of its own (one `contentinfo` per page).", use: "marketing-layout" },
    { when: "To list the family in the bar.", use: "nav-bar" },
  ],
  bestPractices: [
    "Pass `org` (`org` of `@krizaka/org`): the family's names come from `org.family` — the company « Krizaka », products by their own name, libraries « Krizaka <X> » — and the signature is `org.footer.line`. Never type a family name or the legal line in a site.",
    "One or two own groups (`SiteFooter.Column` + `SiteFooter.Link`), a handful of links: what a reader looks for at the bottom (docs, pricing, download, source). Never a link the family line already holds — another site, the story, the blog, contact.",
    "Pass the version the site runs (`version`, `env=\"DEV\"` on a dev environment) and the language switch and theme toggle in `controls`.",
    "Pass the words translated: `labels={familyLabels[locale]}` from `@krizaka/ui/sites`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `footer` landmark; the family is a `nav` named by `labels.family`, each group a list named by its heading.",
      "On a phone each family group is a native `<details>` (keyboard and screen readers for free, 44 px targets); on a desktop it stays open as one line.",
      "The current site says `aria-current=\"true\"` and “You are here” to screen readers; a status is written, never only a colour.",
      "The marks are decorative: every site's name is written beside its mark.",
    ],
  },
  related: ["sites", "nav-bar", "marketing-layout"],
  web: {
    imports: ["SiteFooter", "SiteFooterColumn", "SiteFooterLink"],
    examples: [
      { name: "product", title: "A product", description: "www.yomizaka.com: its links on one line, the family on the second, then the org's line, `DEV · v1.2.3`, the legal links and the language switch." },
      { name: "company", title: "The company (Cahier)", description: "www.krizaka.com, `tone=\"cahier\"`: no own links needed, the family and the signature line." },
      { name: "app", title: "In a signed-in app", description: "`variant=\"app\"`: one slim line — the org's line, `DEV · v1.2.3`, the legal links." },
      { name: "docs", title: "Under documentation", description: "`variant=\"docs\"`: the same three lines on the documentation's width." },
      { name: "open-source-fr", title: "Open source, in French", description: "ui.krizaka.com in French, `tone=\"cahier\"`: « Une entreprise de Technologies Krizaka · Fait à Montréal », the version of the packages." },
    ],
  },
} satisfies ComponentMeta;
