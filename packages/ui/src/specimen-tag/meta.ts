import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Specimen tag",
  summary:
    "The Cahier's label for a product or a component: a manila tag with an eyelet, a typed catalogue number, a name, a stamp for its honest status and the fields of its record — and `Stamp`, the rubber stamp alone.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "A product app's status deserves the same tag; it comes with the native paper roles." },
    desktop: "web",
  },
  whenToUse: [
    "A product's or a component's status and meta in a showcase: what it is, whether it is out, where to see it.",
    "A row of products that run on one engine: tags hung on one wire (`mount=\"hang\"`).",
    "A status said once, honestly, as a stamp (`Stamp`): released, in development, not open yet.",
  ],
  whenNotToUse: [
    { when: "An entry point where the whole card is one link.", use: "link-card" },
    { when: "A status inside a table row or a form: a small chip reads better than a stamp.", use: "badge" },
  ],
  bestPractices: [
    "The stamp tells the truth: `ok` only for what is out (dev preview, released), `wip` in development, `construction` not open yet.",
    "Write the stamp and the fields in lower case: the tag is typed, never shouted.",
    "One sentence in the body, two to four fields; the foot holds the ways out (the site, the source).",
    "`ink` and `hue` are for facts (a duration, a price, an area): `size=\"sm\"` keeps the frame askew and the text straight, so figures are read, not admired. `hue` follows the page's `--kz-hue-text`.",
    "`icon` takes a `@krizaka/icons` glyph; it is decorative (hidden), so the text must say the whole fact.",
    "In a grid of tags under a section's `h2`, keep the default `h3` titles.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The tag is an `article`; its title is a heading (`titleAs`), the fields a description list.",
      "The eyelet and the string are decorative; the mark beside the title is hidden from assistive technology.",
      "The stamp's ink reads ≥ 4.5:1 on the tag and on every surface, in both themes (the status text roles).",
    ],
  },
  related: ["link-card", "badge", "bird-plate"],
  web: {
    imports: ["SpecimenTag", "Stamp"],
    examples: [
      { name: "product", title: "A product", description: "A catalogue number, the stamp, a sentence, two fields and the ways out." },
      { name: "wire", title: "Hung on one wire", description: "`mount=\"hang\"`: the products that run on one engine, side by side." },
      { name: "stamps", title: "The stamps", description: "`Stamp` alone, in its four inks: ok, wip, construction, neutral." },
      { name: "facts", title: "Facts: ink and hue", description: "`tone=\"ink\"` (a duration, a price) and `tone=\"hue\"` (an area, a vibe), `size=\"sm\"` with a straight text, and a glyph." },
    ],
  },
} satisfies ComponentMeta;
