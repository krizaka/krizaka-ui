import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Page hero",
  summary:
    "The first screen of a page: the way back, an eyebrow, the `h1`, a lead, what follows them (facts, actions) and an aside (the page's bird) — on the brand's backdrop, painted at once.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen on a phone is built from Screen, Header and Card.", use: "header" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "At the top of every page of a site that is not the home: a product's sub-page, a building block, a hub, contact.",
    "When the page belongs to a parent (`back`): the reader always knows where they are and how to go up.",
  ],
  whenNotToUse: [
    { when: "At the top of an app's screen: a working view needs a calm header.", use: "page-header" },
    { when: "For a section further down the page.", use: "page" },
  ],
  bestPractices: [
    "One sentence of lead: what the page gives the reader, not what it is.",
    "The eyebrow says where the reader is (`Open source · building block`); the title says the subject.",
    "Never reveal it: it is the page's largest paint. Put the bird in `aside`, facts or actions in the children.",
    "Set `--kz-hero-top` once to clear a fixed navigation bar.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Renders the page's `h1` inside a `header`; keep one hero per page.",
      "The backdrop's layers are decorative and hidden from assistive technology; the aside is yours to label or hide.",
      "The back link is a plain link with its words; its arrow is decorative.",
    ],
  },
  related: ["page", "section-backdrop", "mascots"],
  web: {
    imports: ["PageHero"],
    examples: [
      { name: "building-block", title: "A sub-page", description: "Back link, eyebrow, title, lead, facts under it and the page's bird beside it." },
      { name: "hub", title: "A hub", description: "`align=\"center\"` on the plain backdrop: a title alone." },
    ],
  },
} satisfies ComponentMeta;
