import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Site footer",
  summary:
    "The footer of a Krizaka site, one calm band: its own columns beside the family's — Products · Open source (GitHub with them) · Krizaka (our story, the blog, contact) — on the Krizaka sites (`family={false}` for an independent product), then one line: “A Krizaka company / product / open-source project”, the version, Montréal and the legal links. No site block, no link twice.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A site's footer; an app has none." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The bottom of every page of a Krizaka site: www, ui., java. (the family in columns).",
    "The bottom of a deployed product (dev.<product>): `family={false}` — its own columns, the legal links, the version and one publisher line, no link to another product.",
    "`variant=\"app\"` — inside a signed-in product: one slim line (publisher line, version, legal links), rendered once by the layout, and none where the app shell has a sidebar that holds them.",
    "`variant=\"docs\"` — under documentation pages: the site's columns in a row on the documentation's width, no family.",
    "With `MarketingLayout`'s `footer` slot, under a bar of `@krizaka/ui/nav-bar` with `NavBar.Family`.",
  ],
  whenNotToUse: [
    { when: "Twice on one page: a page that already sits under a layout's footer renders none of its own (one `contentinfo` per page).", use: "marketing-layout" },
    { when: "To list the family in the bar.", use: "nav-bar" },
  ],
  bestPractices: [
    "Set `current` to the site's id: it chooses the mark, the line, the signature (company, product, open source) and marks the site in the family.",
    "One or two own columns at most (`SiteFooter.Column` + `SiteFooter.Link`), never a link the family's columns already hold — another site, the story, the blog, contact (www adds none): on the Krizaka sites the family columns hold them, on a product (`family={false}`) there is none.",
    "Pass the version the site runs (`version`, and `env=\"DEV\"` on a dev environment) and the legal links in `legal`.",
    "Pass the organisation's facts as `org` (`org` of `@krizaka/org`): the signature line is then « Une entreprise de Technologies Krizaka · Fait à Montréal » on every site and, without `legal`, the legal links are the org's — never write these lines by hand.",
    "Pass the words translated: `labels={familyLabels[locale]}` from `@krizaka/ui/sites`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `footer` landmark; the family is a `nav` named by `labels.family`, each column a list named by its heading.",
      "The current site says `aria-current=\"true\"` and “You are here” to screen readers; a status is written, never only a colour.",
      "The marks are decorative: every site's name is written beside its mark.",
    ],
  },
  related: ["sites", "nav-bar", "marketing-layout"],
  web: {
    imports: ["SiteFooter", "SiteFooterColumn", "SiteFooterLink"],
    examples: [
      { name: "product", title: "A product", description: "dev.orazaka.com (`family={false}`): the product's columns, the legal links, “A Krizaka product” → www.krizaka.com, `DEV · v1.2.3` — no family columns." },
      { name: "company", title: "The company", description: "www.krizaka.com: “A Krizaka company”, the company's column, the legal links at the end of the signature line." },
      { name: "app", title: "In a signed-in app", description: "`variant=\"app\"`: one slim line — “A Krizaka product”, `DEV · v1.2.3`, the legal links." },
      { name: "docs", title: "Under documentation", description: "`variant=\"docs\"`: the site's columns in a row, no site block, no family." },
      { name: "open-source-fr", title: "Open source, in French", description: "ui.krizaka.com in French: « Un projet open source de Krizaka », the version of the packages." },
    ],
  },
} satisfies ComponentMeta;
