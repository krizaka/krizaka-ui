import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Txt",
  summary: "Text in the platform's type scale, coloured by a role of the current theme.",
  status: "beta",
  category: "foundations",
  domain: "foundations",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "Text on the web is HTML styled by the type scale's classes." }, desktop: { status: "n/a", reason: "The Mac app renders the web's HTML text." } },
  whenToUse: ["For every text of a React Native screen: titles, body, captions, labels, figures (`mono`)."],
  whenNotToUse: [
    { when: "On the web: use the preset's text utilities (`text-fg`, `font-display`).", use: "theme" },
    { when: "For a status label.", use: "badge" },
  ],
  bestPractices: [
    "Pick a `variant` from the scale and a `tone` from the roles: never a font size or a colour by hand.",
    "`muted` only for large text or what is off: it reaches AA only as large text.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["`title` and `display` are headers for screen readers.", "It follows the system's font scaling."],
  },
  related: ["theme", "badge"],
  native: {
    imports: ["Txt"],
    differences: [],
    examples: [
      { name: "variants", title: "Variants", description: "`display`, `title`, `body`, `caption`, `label`, `mono`." },
      { name: "tones", title: "Tones", description: "`text`, `secondary`, `muted`, `accent`." },
    ],
  },
} satisfies ComponentMeta;
