import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Doodle",
  summary:
    "A doodle in the margin ink of the Cahier: an arrow pointing at a block, a circled word, a star, a wavy underline or a small sketch of the site's bird — inline SVG, the same on the server and on the client. Beside a block on a wide screen, or in the flow around a real word.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A phone has no margin to scribble in." },
    desktop: "web",
  },
  whenToUse: [
    "Beside a `Stuck` block or a heading, on a wide screen, where the notebook's margin has room.",
    "To point at what matters on a page of the Cahier: an arrow to the heading, a circle around the word that carries the promise.",
    "To sign a page with its bird: a small sketch in the margin of a tool site's home or documentation.",
  ],
  whenNotToUse: [
    { when: "Something the reader must know: a status, a warning.", use: "alert" },
    { when: "A note with words, hung in the margin.", use: "footnote" },
    { when: "The bird itself, drawn and alive, as a character.", use: "mascots" },
  ],
  bestPractices: [
    "At most one or two doodles in view; the register stays refined.",
    "Point at what matters: an arrow toward the block, a circle round its key word.",
    "Wrap a real word with `circle` or `wave` (`children`): the word stays text, the ink only rings or underlines it.",
    "Give a lone mark a `label` only when it says something (« Start with the installation »); otherwise it stays decoration.",
    "Give a `seed` so the tilt is the same on every render.",
    "Ink is a token: set `--kz-doodle-ink` on a section to re-ink its marks; by default it is the margin's red.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A doodle without a `label` is decoration: `aria-hidden`, with its word, no focus and no pointer. With a `label` it is an image carrying that text.",
      "A circled or underlined word (`children`) is ordinary text in the reading order; the SVG over it is hidden.",
      "In the margin it sits beside the block and never over text; below 1360 px it is not displayed (`place=\"inline\"` keeps it in the flow).",
      "Drawn in the margin ink; the marks are deterministic and nothing animates.",
    ],
  },
  related: ["stuck", "footnote", "page", "bird-plate", "mascots", "speed-lines"],
  web: {
    imports: ["Doodle"],
    examples: [
      { name: "kinds", title: "Five doodles", description: "An arrow, a circled word, a star, a wavy underline and a bird's sketch, inline." },
      { name: "margin", title: "In the margin", description: "An arrow and a star beside a stuck card, from 1360 px." },
      { name: "margin-marks", title: "Marks in the margin", description: "An arrow to a heading, a circled word and a wavy underline around real text." },
      { name: "bird-sketch", title: "The bird, sketched", description: "A small sketch of each site's bird, with its text equivalent." },
    ],
  },
} satisfies ComponentMeta;
