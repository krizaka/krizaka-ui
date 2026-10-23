import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Doodle",
  summary:
    "A hand-drawn mark in the margin of the Cahier: an arrow to a heading, a circled word, stars, a wavy underline, a small sketch of the site's bird — inline SVG in the margin's ink, the same on the server and on the client.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "To point at what matters on a page of the Cahier: an arrow to the heading, a circle around the word that carries the promise.",
    "To sign a page with its bird: a small sketch in the margin of a tool site's home or documentation.",
  ],
  whenNotToUse: [
    { when: "The bird itself, drawn and alive, as a character.", use: "mascots" },
    { when: "A numbered figure with its caption in a naturalist's plate.", use: "bird-plate" },
  ],
  bestPractices: [
    "Two doodles on a screen at most: they are marks in a margin, not wallpaper.",
    "Wrap a real word with `circle` or `underline`: the word stays text, the ink only underlines it.",
    "Give a lone mark a `label` only when it says something (`See the install steps`); otherwise it stays decoration.",
    "Ink is a token: set `--kz-doodle-ink` on a section to re-ink its marks; products keep the accent through `--kz-paper-rule-margin`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A mark without a `label` is hidden from assistive technology; with one it is an image carrying that text.",
      "A circled or underlined word is ordinary text in the reading order; the SVG over it is hidden.",
      "The marks are deterministic and never move, so nothing changes under `prefers-reduced-motion`.",
    ],
  },
  related: ["bird-plate", "taped-photo", "mascots", "speed-lines"],
  web: {
    imports: ["Doodle"],
    examples: [
      { name: "margin-marks", title: "Marks in the margin", description: "An arrow to a heading, a circled word and a wavy underline." },
      { name: "bird-sketch", title: "The bird, sketched", description: "A small sketch of the site's bird, with its text equivalent." },
    ],
  },
} satisfies ComponentMeta;
