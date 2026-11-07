import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Icon",
  summary:
    "The Sovkora icon registry: one `Icon` component and a typed `name` for every product concept — studios, models, the pipeline, RAG, MCP.",
  why: "Sovkora's screens name AI concepts (a router, a refiner, a memory, a cost shield) that no generic set draws. The contract centralises them in one registry, so an app never imports an icon library directly and every concept has one picture across the client, the console and the website.",
  status: "stable",
  category: "foundations",
  platforms: "web",
  builtOn: [],
  whenToUse: [
    "Every icon of an Sovkora screen: navigation, buttons, lists, the palette.",
    "A concept of the engine (model, pipeline, router) shown next to its name.",
  ],
  whenNotToUse: [
    { when: "For a Krizaka platform concept on the website (the signature set): use @krizaka/icons." },
    { when: "As the product's logo: use `SovkoraLogo` from @krizaka/ui." },
  ],
  bestPractices: [
    "Never import lucide or another set in an app: add the icon to the registry.",
    "An icon-only button carries an `aria-label` (`IconButton` from @krizaka/ui requires one).",
    "Colour through the text role (`text-fg-secondary`, `text-accent`): the strokes are `currentColor`.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Decorative by default (`aria-hidden`): the text or the button around it names it."],
  },
  related: ["command-palette", "sentinel-mini", "ui/button"],
  web: {
    imports: ["Icon"],
    examples: [
      {
        name: "engine",
        title: "The engine's concepts",
        description: "Router, pipeline, model, RAG, memory, MCP — the vocabulary of Sovkora.",
      },
      {
        name: "in-a-button",
        title: "In a button",
        description: "An icon beside a label, coloured by the button's role.",
      },
    ],
  },
} satisfies ComponentMeta;
