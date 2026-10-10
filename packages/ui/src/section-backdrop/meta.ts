import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Section backdrop",
  summary: "The backdrop of a page section: the brand's gradient, a light dome, an optional perspective grid and a blurred foreground.",
  status: "beta",
  category: "layout",
  platforms: "web",
  whenToUse: [
    "Behind the hero of a marketing page (`grid`, the dome).",
    "Behind a closing call to action (`direction=\"up\"`).",
    "To chain sections: each one ends on the page surface where the next begins.",
  ],
  whenNotToUse: [
    { when: "Inside an app's screens: a working view needs a calm surface.", use: "page-header" },
    { when: "To frame one item.", use: "card" },
  ],
  bestPractices: [
    "One strong backdrop per screen: the hero, or the closing call to action — not every section.",
    "The colours come from the brand theme (`.brand-*`): never pass a colour.",
    "Keep text on it in the text roles (`text-fg`, `text-fg-secondary`).",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Every layer is decorative and hidden from assistive technology; `media` too.", "The drift of the light stops under `prefers-reduced-motion`."],
  },
  related: ["page-header", "card"],
  web: {
    imports: ["SectionBackdrop"],
    examples: [
      { name: "hero", title: "Hero", description: "The gradient, the dome and the grid behind a headline." },
      { name: "plain", title: "Plain", description: "The gradient alone." },
      { name: "up", title: "Closing call to action", description: "`direction=\"up\"`: the tint at the bottom." },
      { name: "sequence", title: "Sequence", description: "Two sections in a row." },
      { name: "depth-of-field", title: "Depth of field", description: "A blurred foreground behind the content (`media`)." },
    ],
  },
} satisfies ComponentMeta;
