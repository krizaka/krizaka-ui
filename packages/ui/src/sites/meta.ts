import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Sites",
  summary:
    "The Krizaka family as data: every site (the company, the products, the open-source projects, GitHub) with its address, kind, status, mark and repository, and the family's words in English and French — read by the bar's family switcher and the common footer.",
  status: "beta",
  category: "foundations",
  platforms: "web",
  whenToUse: [
    "To list or link the sites of the Krizaka family anywhere: a products page, an open-source hub, a README generator.",
    "To know a site's status (released, coming soon, under construction, in development) without writing it again.",
  ],
  whenNotToUse: [
    { when: "To draw the family in a bar: `NavBar.Family` already reads it.", use: "nav-bar" },
    { when: "To draw the family at the bottom of a page: `SiteFooter` already reads it.", use: "site-footer" },
    { when: "For a site's own pages and sections: they belong to the site, not to the family." },
  ],
  bestPractices: [
    "Never type a family address, status or one-line description in an app: a new or renamed site is one release of @krizaka/ui, and every bar and footer follow.",
    "Pass `familyLabels[locale]` (en, fr) to the components, or your own translation of the same `FamilyLabels` shape.",
    "Say a status in words: “Coming soon” for an upcoming product, “Under construction” for one being built — never beta or a waiting list.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Plain data: the components that render it own the semantics (named lists, `aria-current` on the current site, statuses in words).",
      "Every site has a name and a one-line description, so a mark is always decorative beside its words.",
    ],
  },
  related: ["nav-bar", "site-footer"],
  web: {
    imports: ["sites", "siteGroups", "siteById", "sitesByGroup", "familyLabels"],
    examples: [
      { name: "family", title: "The family", description: "Every site, grouped as the bar and the footer show it: name, address, status and its one line." },
      { name: "french", title: "In French", description: "The family's words in French (`familyLabels.fr`): names, addresses and statuses stay; the lines translate." },
    ],
  },
} satisfies ComponentMeta;
