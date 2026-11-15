import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Architecture diagram",
  summary:
    "One laid-out C4 view (context, containers, components or a dynamic flow) drawn on the plate in the page's tokens — groups, elements by shape, labelled edges, numbered steps — with its full text version.",
  status: "experimental",
  adoption: "krizaka-blog#340",
  category: "data-display",
  domain: "data-display",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A figure of a reading page (a post, a docs site); an app screen lists the same elements and relations.", use: "list" },
    desktop: "web",
  },
  whenToUse: [
    "A post or a docs page that shows how a system is built: its context, its containers, its components.",
    "A dynamic view: the numbered steps of one flow (a request, a release, a pull request's life).",
    "A cockpit page that shows the architecture the code was checked against.",
  ],
  whenNotToUse: [
    { when: "An engine and the apps it serves, with what travels between them, on a landing.", use: "engine-flow" },
    { when: "A sequence of steps a person goes through.", use: "stepper" },
    { when: "Facts about one element.", use: "description-list" },
  ],
  bestPractices: [
    "Pass the view `@krizaka/architecture` laid out, unchanged: the component draws, it never lays out, so the drawing is the model's.",
    "One view per figure, under its view title; the `subtitle` says the level (`C4 · level 2`) or the source.",
    "Pass `links` by element id for the elements that have a page: they become links in the text version.",
    "Pass `words` in the page's language: the text version's headings are props.",
  ],
  accessibility: {
    keyboard: [{ keys: "Arrow keys", action: "Scroll the drawing in its frame (once the frame has focus) when it is wider than the screen." }],
    notes: [
      "The drawing is one image (`role=\"img\"`) named by the view's title (`aria-label`); its text version is a `<details>` built from the same view: the elements (nested in their groups), then the relations or, in a dynamic view, the ordered steps.",
      "Every label is a text child, never markup: a hostile title renders as its characters.",
      "A link is only an `http:`/`https:` address, a same-site path or an anchor (`safeHref`); any other scheme is dropped.",
      "On a phone the drawing keeps a legible size and scrolls in its frame, which takes the keyboard focus; the text version is the phone reading.",
    ],
  },
  related: ["engine-flow", "description-list", "stepper"],
  web: {
    imports: ["ArchitectureDiagram"],
    examples: [
      { name: "context", title: "Context", description: "Who uses the system and what it relies on outside: a person, a browser, an external store." },
      { name: "containers", title: "Containers", description: "The system as a group, its containers inside, a database below." },
      { name: "dynamic", title: "Dynamic flow", description: "`dynamic: true`: the edges are numbered steps, and the text version lists them in order." },
    ],
  },
} satisfies ComponentMeta;
