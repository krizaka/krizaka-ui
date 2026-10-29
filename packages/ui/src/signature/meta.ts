import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Signature",
  summary:
    "A small hand-signed mark at the end of a section or a page, the way an owner signs their notebook: the Krizaka mark as an ink stamp and « Krizaka · Montréal » in the notebook's pen, with an optional date.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "The end of a long section or of a page of the Cahier: the house signs it.",
    "A dated note (a changelog entry, a charter) that a person of the house stands behind.",
  ],
  whenNotToUse: [
    { when: "The brand in a bar or a footer.", use: "site-footer" },
    { when: "A person's signature: it is never drawn here, no imitation of anyone's hand.", use: "avatar" },
  ],
  bestPractices: [
    "One signature per page, at its end.",
    "`both` by default; `stamp` where the name is already written nearby, `script` where a mark is already shown.",
    "The words are props: write the date in the page's language.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The name and the date are real text; the date is a `time`.",
      "The stamp is decorative next to the name; alone (`variant=\"stamp\"`), it is an image named by `name`.",
      "Inked with the host's text role: chalk on slate, ink on paper, AA in both. The grain is a filter, fixed: nothing animates, nothing shifts.",
    ],
  },
  related: ["stuck", "footnote", "site-footer"],
  web: {
    imports: ["Signature"],
    examples: [
      { name: "both", title: "Stamp and name", description: "The mark as a stamp, the house's name in the notebook's pen, and the date." },
      { name: "variants", title: "Stamp or script", description: "The mark alone, then the name alone." },
    ],
  },
} satisfies ComponentMeta;
