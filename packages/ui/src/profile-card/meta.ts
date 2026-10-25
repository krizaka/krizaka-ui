import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Profile card",
  summary:
    "A profile at a glance — a portrait, a name, a headline gauge, a few stats with their values in words, a line and actions: a creator, a match, a member, a plan. `ProfileBanner` is the top of a person's or a place's page: a cover, the avatar overlapping it, the name, its facts, the actions.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "A creator's card in a directory or beside their content (profile completeness, challenges met, response time).",
    "A match in a dating app: what two people share, said in words.",
    "`ProfileBanner`: the top of a client's, a shop's, a creator's or a building's page — or `DetailLayout` with `cover`, the same banner as its header.",
    "A team member, a product, a plan presented with a few measured strengths — and, on a told page, a character (`variant=\"arcade\"`).",
  ],
  whenNotToUse: [
    { when: "A single figure with its trend.", use: "stat" },
    { when: "A usage against a limit with thresholds.", use: "meter" },
    { when: "A plain avatar and a name in a list row.", use: "avatar" },
  ],
  bestPractices: [
    "Two to four stats, each with `valueText` in the person's words (“12 of 15”, “replies within a day”): a bar alone says nothing.",
    "Never reduce a person to a score: in a dating or social product, show what is shared, not a ranking.",
    "One or two actions under the card, the main one first.",
    "`ProfileBanner`: give it the family's default avatar (`defaultAvatar: { brand, seed }`) when there is no photo, never initials on grey; the cover is decorative (`alt=\"\"`), a tint of the brand's accent by default; one or two actions.",
    "`nameAs` follows the page's outline: `h3` in a list under an `h2`, `p` when a heading follows the card.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "An `article` headed by the name; each gauge is a `meter` named by its label, with `aria-valuetext`.",
      "The portrait is decorative: the name carries the meaning.",
      "`ProfileBanner` is a `section` headed by the name (`h1` by default, `titleAs`); no word is ever drawn on the cover, so a photo never costs the text its contrast, and a scrim fades the photo into the page.",
      "In a stage, the card arrives and its gauges fill once; under `prefers-reduced-motion` they are drawn full at once.",
    ],
  },
  related: ["avatar", "meter", "stat", "goal-gauge"],
  web: {
    imports: ["ProfileCard", "ProfileBanner", "StatGauge"],
    examples: [
      { name: "creator", title: "A creator", description: "A creator's card: profile completeness, two stats in words, follow and message." },
      { name: "match", title: "A match", description: "In a dating app's brand: what two people share, never a score alone." },
      { name: "banner", title: "Profile banner", description: "A client's page: the brand's tinted cover, the family's default avatar overlapping it, the name, a status, its facts and two actions." },
      { name: "arcade", title: "Arcade flavour", description: "The fighter card of a told page: the brand's gradient, a breathing aura, a skewed gauge." },
    ],
  },
  native: {
    imports: ["ProfileCard", "ProfileBanner"],
    differences: ["`name` and `caption` are strings; no `nameAs`, no `icon`.", "`ProfileBanner`: `title`, `eyebrow` and `meta` are strings; the cover is an `Image` or a tint of the brand's accent.", "One look: no arcade flavour on mobile.", "The gauges fill once on mount (`animated`), not on scroll."],
    examples: [
      { name: "default", title: "Default", description: "A creator's card on mobile: the headline gauge, two stats in words, one action." },
      { name: "banner", title: "Profile banner", description: "A client's screen: the brand's tinted cover, the avatar over its edge, the name, its facts, one action." },
    ],
  },
} satisfies ComponentMeta;
