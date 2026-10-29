import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Margin layout",
  summary:
    "Numbered items with margin notes for product reading pages: the number in the left margin in tabular display figures, the note (the article cited, « See in the document ») in the right margin from 64 rem and under the item below it.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#645", reason: "A phone is always the folded layout (the note under the item); the apps compose it from a numbered List until a screen asks for a twin." },
    desktop: "web",
  },
  whenToUse: [
    "A report or a check flow read from top to bottom, where each numbered point has a source to show beside it (a finding and its clause).",
    "Step flows whose steps carry a short note that must not interrupt the text.",
  ],
  whenNotToUse: [
    { when: "A sentence-long footnote on a Cahier page.", use: "footnote" },
    { when: "A label and a value, many times.", use: "description-list" },
    { when: "Independent entry points.", use: "card-grid" },
  ],
  bestPractices: [
    "Keep a note to one or two lines: it sits beside the text on a desktop and under it on a phone.",
    "Number in reading order (1, 2, 3); the figures are tabular so a column of them lines up.",
    "Pass the words from your messages; the package ships none.",
    "Put the page's heading outside the list: the list holds only the items.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Reaches whatever interactive content the items hold; the layout adds no stop." }],
    notes: [
      "An ordered list: the position of each item is announced by the list, so the visible number is hidden from assistive tech to avoid saying it twice.",
      "The reading order is the number, the text, then the note, whichever margin the note is drawn in.",
      "The accent figure is large text (≥ 3:1); the note uses the secondary text role (≥ 4.5:1).",
    ],
  },
  related: ["description-list", "list", "footnote", "stat"],
  web: {
    imports: ["MarginLayout", "MarginItem"],
    examples: [
      { name: "findings", title: "Findings with their sources", description: "Three numbered findings of a lease check, each with the clause it cites in the margin." },
      { name: "steps", title: "A step flow", description: "Numbered steps, one with a note and one without." },
    ],
  },
} satisfies ComponentMeta;
