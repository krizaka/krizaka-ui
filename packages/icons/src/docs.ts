/**
 * The documentation of the set, as data (ui.krizaka.com/foundations/icons renders it with `glyphIndex`): the groups, the
 * sizes, the node, accessibility, and how to ask for a new icon. Written here, beside the drawings — never on the site.
 */

/** A group of the set, in reading order. */
export interface IconGroup {
  readonly id: "product" | "emblem" | "system" | "interface";
  readonly title: string;
  readonly description: string;
}

export const iconGroups: readonly IconGroup[] = /* @__PURE__ */ Object.freeze([
  {
    id: "product",
    title: "Product",
    description:
      "The vocabulary of the products — creators and audiences, sovereign AI (Orazaka), meeting people (small batches, debriefs, introductions), listening (a moment, the thread, what you keep), money and trust. Every product icon carries a node, the core of the Krizaka marks, at its meaningful point.",
  },
  {
    id: "emblem",
    title: "Emblems",
    description:
      "Simple symbols to build marks, crests and badges from — a star, a bolt, a wave, a flame, a crown, a leaf, a mountain. They are shapes, never a logo of anyone; each carries a node like the product icons.",
  },
  {
    id: "system",
    title: "System",
    description: "The states and settings every app shares: theme, search, notifications, people, time, visibility, information.",
  },
  {
    id: "interface",
    title: "Interface",
    description: "Navigation and actions. Utility glyphs (arrows, chevrons, close, plus, check, menu) stay bare — no node — so the nodes keep their meaning.",
  },
]);

/** The rules of use, by topic. */
export const iconGuidelines = /* @__PURE__ */ Object.freeze({
  grammar: [
    "A 24-unit grid, live area 2–22, one pen stroke (1.5) with square caps and mitred joins — a line drawn with a nib, not a rounded marker (Cahier, ADR-004).",
    "Containers have cut corners — 45° chamfers, the angle of the Krizaka hexagon — where other sets round them.",
    "A node (a filled dot, r 1.6) on every product icon, none on utility glyphs. No currency sign, no logo inside an icon.",
  ],
  sizes: [
    { size: 16, use: "Dense tables, inline with 12–14 px text. Keep the default stroke: the icon thins with it." },
    { size: 20, use: "Buttons, fields, menus — the interface default next to 14–16 px text." },
    { size: 24, use: "The drawing size: navigation, tab bars, empty states." },
    { size: 32, use: "Feature lists and cards. From 32 px, a 1.5 stroke keeps the weight of the text." },
  ],
  color: [
    "An icon takes the colour of its text (`currentColor`): set the text role on the parent (`text-fg-secondary`), never a colour on the icon.",
    "`nodeColor=\"var(--kz-accent)\"` lights the node with the brand accent — once per view, on what matters (the active tab, the primary feature).",
    "React Native has no currentColor: pass `color` and `nodeColor` from the theme (`theme.textPrimary`, `theme.accent`).",
  ],
  accessibility: [
    "Decorative by default: `aria-hidden` and not focusable — the words next to the icon carry the meaning.",
    "Alone (an icon button, a status), give it a `title`: it becomes an image (`role=\"img\"`, `aria-label`, `<title>`). On a button, prefer the button's own `aria-label` and keep the icon decorative.",
    "Never meaning by the node colour alone: a state needs a word or a shape too.",
  ],
  request: [
    "Search the set first, by meaning: keywords cover synonyms (`gift` finds Tip, `escrow` finds Auction).",
    "Open an issue on krizaka/krizaka-ui with the title \"icons: <name>\": the concept, where it is used (product, screen), and the closest existing icon.",
    "The drawing is code (`scripts/glyphs.mjs`, helpers `cut`, `hex`, `arc`): a pull request that adds the glyph, its group and keywords is welcome — the grammar test checks it.",
    "A new icon is a minor release of @krizaka/icons; a redrawn icon too. Removing or renaming one is a major.",
  ],
});
