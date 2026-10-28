import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Reviews",
  summary: "A score you can trust: `ReviewSummary` shows the shop's score as a stamp with the verified count, five meters for the distribution and its text equivalent — nothing under the host's minimum — and `ReviewCard` one review with the owner's reply indented.",
  status: "beta",
  category: "blocks",
  domain: "commerce",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A public storefront's block; the native apps read reviews in their own lists.", use: "card" }, desktop: "web" },
  whenToUse: [
    "A shop's page: the clients' word as verified reviews (only a completed appointment may review), with a fair score.",
    "Any place that rates a place, a person or a service with a 1 to 5 scale and wants the distribution visible.",
  ],
  whenNotToUse: [
    { when: "A school-style mark out of 20 (a teacher's red): that is the tool sites' register.", use: "grade-stamp" },
    { when: "A measure within a range that is not a rating (a quota, a balance).", use: "meter" },
  ],
  bestPractices: [
    "The host computes the score (a Bayesian average of the verified reviews) and formats every word: `scoreText`, `countText`, `summaryText`, `starText`, the dates.",
    "Set `minCount` (the shop's minimum): `ReviewSummary` renders nothing under it, so a new shop shows no score rather than a lonely « 5,0 ».",
    "Show only verified reviews and say so (« 27 avis vérifiés »); the owner's reply is a `reply`, never an edit of the review.",
    "Three cards and a link to all of them, not a wall of text.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`ReviewSummary` is a group named by its text equivalent (« 4,8 sur 5, 27 avis vérifiés »); the stamp and the count are hidden from assistive technology so nothing is read twice.",
      "The distribution is five real `meter`s, each named (« 5 étoiles : 20 avis »); the rating of a card is read in words and its stars are decorative.",
      "A review's date is a `time` with its machine-readable value.",
    ],
  },
  related: ["meter", "specimen-tag", "grade-stamp", "description-list"],
  web: {
    imports: ["ReviewSummary", "ReviewCard"],
    examples: [
      { name: "summary", title: "The score", description: "A stamp, the verified count, five meters and the text equivalent." },
      { name: "card", title: "A review", description: "First name and initial, the month, the service, the words and the owner's indented reply." },
    ],
  },
} satisfies ComponentMeta;
