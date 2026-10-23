import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Text style",
  summary: "The look of one text role chosen by a person — font, size, weight, spacing, alignment, case, italic and tone — as a plain value the app stores, a live preview, and the same value drawn safely by `StyledText`.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#561", reason: "A shop owner styles the storefront's text from a computer; the native picker is a follow-up when a mobile admin needs it. `StyledText`'s value is the same on a phone." },
    desktop: "web",
  },
  whenToUse: [
    "A person sets the look of a title, a text or a price that the app then draws: a shop's storefront, a product's theme settings.",
    "In a popover from a toolbar (`compact`), or reduced to a few controls (`fields`).",
  ],
  whenNotToUse: [
    { when: "For bold, links or colours inside a paragraph: this styles a whole text role, it is not a rich-text editor." },
    { when: "For one number chosen by feel, such as a volume.", use: "slider" },
    { when: "For a few named options that are not a text's look.", use: "radio-group" },
  ],
  bestPractices: [
    "Store the value as it is and draw it with `StyledText` or `textStyleProps`; re-validate what a server receives with `parseTextStyle`.",
    "Pass `previewText` with the text people will actually read, and `role=\"title\"` for a heading so a small size is not flagged.",
    "Give the host's own `presets` (« Titre », « Sous-titre », « Texte », « Prix ») as data, translated.",
    "Pass `surface` when the text sits on a colour the page cannot tell the picker about.",
    "The warnings advise, they never change the value: let the person decide.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Move from one control to the next." },
      { keys: "Arrow keys", action: "Choose within a font, weight, spacing, alignment, case or tone group; move the size slider by a step." },
      { keys: "Space", action: "Toggle italic; press a preset." },
    ],
    notes: [
      "Every control is named by a visible label; the tones are named swatches (a radio group), never a colour alone.",
      "The contrast of the tone against the surface is measured on the preview and warned under 4.5:1 for body text, 3:1 for large text; a body size under `minBodySize` is warned too. Warnings are announced politely.",
      "On a phone the controls stack in one column; the primitives honour reduced motion.",
    ],
  },
  related: ["slider", "radio-group", "switch", "popover"],
  web: {
    imports: ["TextStylePicker", "StyledText", "textStyleProps", "parseTextStyle", "textStyleLabelsFr"],
    examples: [
      { name: "storefront-title", title: "Storefront title", description: "A shop owner styles the shop's title, starting from presets." },
      { name: "product-price", title: "Product price", description: "Only font, size, weight and tone, and the stored value drawn by `StyledText`." },
      { name: "compact-toolbar", title: "Compact toolbar", description: "`compact` in a popover, in French, with two controls." },
    ],
  },
} satisfies ComponentMeta;
