import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Sketch",
  summary:
    "A screen drawn as with a pen in a school notebook — boxes, buttons, scribbled lines, icons, hatched areas — with numbered callouts in the margin red and a legend in real text that says what each item is for.",
  status: "experimental",
  adoption: "krizaka-internal#4006",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A figure of a reading page (a post, a docs site); an app shows its real screen, never a drawing of it." },
    desktop: "web",
  },
  whenToUse: [
    "A post or a docs page that explains what each part of a screen is for, without a real capture.",
    "A before / after of a redesign, drawn at the same scale (`SketchPair`).",
    "A screen that holds personal data: the sensitive area is hatched, never shown.",
  ],
  whenNotToUse: [
    { when: "How a system is built: its containers and their relations.", use: "architecture-diagram" },
    { when: "A real capture of a product screen.", use: "taped-photo" },
  ],
  bestPractices: [
    "Only numbers and very short words inside the drawing: on a phone it shrinks, the legend does not. The meaning lives in the legend.",
    "One legend line per callout number, and the reverse: the component warns in development when they do not pair.",
    "Keep the `seed` once the drawing looks right: the same spec and seed always draw the same SVG.",
    "Draw a phone with `frame: \"phone\"` and a width of about 390, a desktop with `frame: \"desktop\"` and about 1200: the callouts keep a legible size.",
    "Hatch what is personal or secret (`kind: \"hatch\"`): a sketch never shows a real name, an address or a number.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The drawing is one image (`role=\"img\"`) named by `title` (also its SVG `<title>`); its strokes and words are not read one by one.",
      "The legend is an ordered list whose numbers follow the callouts (`value`): it is the text version of the drawing.",
      "Strokes, washes and numbers are tokens (`--kz-text-primary`, `--kz-accent`, `--kz-paper-rule-margin`): the drawing follows the theme, paper and slate.",
      "An `icon` shape must name an `@krizaka/icons` glyph: an unknown name throws `SketchIconError` rather than draw a blank.",
    ],
  },
  related: ["architecture-diagram", "taped-photo"],
  web: {
    imports: ["Sketch", "SketchPair"],
    examples: [
      { name: "desktop", title: "A desktop screen", description: "A booking page in a plain frame: four callouts, the legend under it." },
      { name: "phone", title: "A phone screen", description: "`frame: \"phone\"`: the phone's outline, arrows from the margin to the items." },
      { name: "before-after", title: "Before and after", description: "`SketchPair`: two sketches side by side from 48rem, one above the other below." },
      { name: "hatch", title: "A hatched area", description: "`kind: \"hatch\"`: the customer's details are hatched, never drawn." },
    ],
  },
} satisfies ComponentMeta;
