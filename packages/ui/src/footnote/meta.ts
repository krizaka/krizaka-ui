import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Footnote & caption",
  summary: "The small print of the Cahier: `Caption` names a figure (`fig. 2 — …`), `FootnoteRef` is the number in the text, `Footnotes` the notes at the foot, each with its way back.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "Reading-page typography; an app says it in its own words.", use: "txt" },
    desktop: "web",
  },
  whenToUse: [
    "A figure, a plate or a screenshot that needs its number and one line of caption.",
    "A sentence whose source (an article of law, a run id, a measure) belongs in a note rather than in the text.",
  ],
  whenNotToUse: [
    { when: "A warning or a status the reader must not miss.", use: "alert" },
    { when: "Help next to a form field.", use: "field" },
  ],
  bestPractices: [
    "A caption says what the figure shows, after its number; never « Image of ».",
    "Notes cite sources and proofs (an article, a run id); the text stays readable without them.",
    "Use one `prefix` per set of notes when a page has several.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Each reference is a link named « Note n » to its note; each note links back to its reference.",
      "The notes are an `aside` named by `label` (« Notes »), an ordered list.",
    ],
  },
  related: ["bird-plate", "anatomy-plate", "markdown"],
  web: {
    imports: ["Caption", "FootnoteRef", "Footnotes"],
    examples: [{ name: "notes", title: "A figure and its notes", description: "A caption under a figure, two references in a sentence, the notes at the foot." }],
  },
} satisfies ComponentMeta;
