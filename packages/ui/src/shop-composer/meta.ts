import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Shop composer",
  summary: "Our own editor for a shop's page document (ADR-007): the outline of the sections, the live preview of the product's page and the inspector of the selected section — variant as live thumbnails, settings as a form generated from the zod schema, words, blocks — with undo and redo, a saved draft and a publish step that shows what changes. First consumer: Akinaza's studio (akinaza#402).",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "The composer is the studio of the web console; a shop's page is a web page.", use: "shop" }, desktop: "web" },
  whenToUse: [
    "The studio of a product whose public page is a `ShopPage` document: the owner chooses sections, their order and how each one is drawn, within a bounded catalogue.",
  ],
  whenNotToUse: [
    { when: "A free-form page builder with a canvas, nested columns and any component anywhere: the model here is a list of sections, deliberately.", use: "shop" },
    { when: "A single form of settings.", use: "form" },
  ],
  bestPractices: [
    "The product saves the draft in `onChange` (a valid document, after 800 ms of calm) and serves its own public route with `?draft=<id>` for the preview; the composer talks to it by `postMessage` (`connectShopPreview` in `@krizaka/ui/shop` is the page's half).",
    "Pass the presets of the shop's trade and the section types the trade does not use (`foldedTypes`): they are folded away, not removed.",
    "Pass translated `messages`; English is the default.",
    "Publish only what the composer hands to `onPublish`: it is parsed (`parseShopPage`) and the product parses it again on write.",
  ],
  accessibility: {
    keyboard: [
      { keys: "↑ ↓", action: "Moves between the rows of the outline." },
      { keys: "Alt+↑ / Alt+↓", action: "Moves the focused section up or down; the move is announced and focus stays on its row." },
      { keys: "Ctrl/⌘ Z, Shift+Ctrl/⌘ Z", action: "Undoes and redoes (100 steps), except inside a text field." },
      { keys: "Enter, Space", action: "Selects a section, toggles its visibility, chooses a variant." },
    ],
    notes: [
      "One polite live region says every move, addition, removal and undo; « Saved » is its own status.",
      "The preview `iframe` is titled; the variant picker is a radio group; an invalid setting is said next to its field and the publish dialog lists every problem and stays closed to confirmation until they are fixed.",
      "On a phone the composer has two steps (the list, then the section) and the preview behind a « View » button.",
    ],
  },
  related: ["shop", "form", "radio-group", "dialog", "dropdown-menu", "switch"],
  web: {
    imports: ["ShopComposer", "defaultShopComposerMessages", "applyCommand", "createHistory", "diffPages", "describeSettings", "SectionThumbnail"],
    examples: [{ name: "composer", title: "Composer", description: "The salon's compact page in the composer: outline, preview, inspector." }],
  },
} satisfies ComponentMeta;
