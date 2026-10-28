import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Price catalogue editor",
  summary: "An administrator edits a product's price entries: the amount, unit, availability and limits, from a date that is never in the past, with the scheduled changes and the history folded.",
  status: "experimental",
  adoption: "orazaka#417",
  category: "blocks",
  domain: "commerce",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#713", reason: "An admin task on the web consoles; a phone twin follows only when an admin app needs one." }, desktop: "web" },
  whenToUse: ["The admin screen of a product whose prices are data (`describePrices()` of @krizaka/settings, ADR-009).", "Any list of priced entries that change from a date while current subscriptions keep their price."],
  whenNotToUse: [
    { when: "For one setting (a toggle, a number).", use: "settings-layout" },
    { when: "For the public price list of a page.", use: "pricing-page" },
  ],
  bestPractices: [
    "Feed it `describePrices()` as is: cents are integers, `null` is « on quote », dates are ISO strings.",
    "The host owns the save: `onSchedule` returns `{ ok: false, message }` for a refusal (it never rejects) and the page re-renders with the new `prices`.",
    "Pass `today` from the server (`YYYY-MM-DD`): the block never reads the clock and the date field refuses an earlier day.",
    "`loadHistory` is called when the fold opens, never on load.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the entries' buttons, the folds and the form's fields in reading order." },
      { keys: "Enter / Space", action: "Opens a form or a fold; Enter in a field submits the change." },
    ],
    notes: [
      "Each entry is a list item named by a heading; its form is a `form` named after the entry.",
      "The availability is a word in a chip, never colour alone.",
      "A refusal is a `role=alert` message; a saved change is announced politely.",
      "At 360 px the entry stacks: name and amount, then the chip and the button, then the form in one column.",
    ],
  },
  related: ["money-input", "settings-layout", "field"],
  web: {
    imports: ["PriceCatalogueEditor"],
    examples: [{ name: "default", title: "Three entries", description: "A public plan with a scheduled change, a founder offer with its cap, an entry in preparation." }],
  },
} satisfies ComponentMeta;
