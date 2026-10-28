import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Glossary term",
  summary: "An underlined host-defined term with a keyboard-accessible definition tooltip.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "The inline web tooltip has no native twin yet; a native screen can present the same definition in text.", use: "description-list" },
    desktop: "web",
  },
  whenToUse: ["A reader may need a short explanation of a domain word without leaving the sentence.", "A data figure uses a term that is defined in the host's catalogue."],
  whenNotToUse: [
    { when: "The reader needs all definitions together.", use: "glossary" },
    { when: "A control needs a tooltip rather than a glossary entry.", use: "tooltip" },
  ],
  bestPractices: ["Keep the definition short enough to read in context.", "Use the same term and definition in the page glossary and the host's catalogue."],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Focuses the term and opens its definition; Escape dismisses the tooltip." }],
    notes: ["The term remains the trigger's accessible name and the definition is linked as its description.", "The tooltip opens on keyboard focus and pointer hover."],
  },
  related: ["glossary", "tooltip", "description-list"],
  web: {
    imports: ["GlossaryTerm"],
    examples: [{ name: "inline", title: "Inline definition", description: "Explain one shop figure in a sentence without replacing the host's wording." }],
  },
} satisfies ComponentMeta;
