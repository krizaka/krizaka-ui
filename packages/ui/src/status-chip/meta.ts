import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Status chip",
  summary:
    "A state of a status set (`@krizaka/organize`, krizaka-ts#89): its label in the person's language and its tone as a badge; read-only, or a menu of the moves the role may make — a second press to confirm, a reason picked from a list.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "The state of an entity whose kind has a status set the admin configures: an applicant file (« To decide → Selected | Declined »), a client, an invoice.",
    "In a table column or a detail header: read-only for a derived set (an invoice's « Paid » comes from the ledger), editable where the role may move it.",
  ],
  whenNotToUse: [
    { when: "For a status that is not a set of the product (an upload, a build, a plan).", use: "badge" },
    { when: "For a tag the person puts on a file (a category of their own).", use: "chip" },
    { when: "To choose among views of a list.", use: "tabs" },
  ],
  bestPractices: [
    "Pass the kind's `StatusSet` as it is (`KindConfig.status`), the entity's state key and the person's role: the menu is `movesFrom(set, state, role)`, in the set's order — never your own list of moves.",
    "A move that asks to be confirmed (`transition.confirm`) turns into « Confirm: … » on the first press. A move with `reasons` opens the list to pick from: there is never a free-text reason.",
    "After a move that is not to a final state, offer an undo (a toast) with `undoOf(set, move, role)`; after a final state there is none.",
    "A status never takes a tag's colour: the tone (neutral · accent · success · warning · danger) is a tint and a dot, and the label always says the state.",
    "A status column sorts by `statusOrder(set)`, never alphabetically.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space / Arrow Down", action: "Opens the menu of moves." },
      { keys: "Arrow keys", action: "Move between the moves; Arrow Right opens the reasons of a move." },
      { keys: "Enter", action: "Makes the move, or on a move to confirm, asks « Confirm: … » first." },
      { keys: "Esc", action: "Closes the menu and returns to the chip." },
    ],
    notes: [
      "Read-only, it is plain text with a dot: the label says the state, the tone is never the only signal.",
      "With moves it is a button named « Change the status, now … » that opens a Radix menu (arrows, typeahead, focus return).",
      "The « Confirm: … » text is a polite live region.",
    ],
  },
  related: ["chip", "badge", "dropdown-menu", "data-table", "filter-bar"],
  web: {
    imports: ["StatusChip"],
    examples: [
      { name: "default", title: "Status of an applicant file", description: "« To decide » with its moves for the owner (a second press for « Selected », a reason picked for « Declined »), the same state read-only for another role, and a derived status." },
    ],
  },
  native: {
    imports: ["StatusChip"],
    differences: [
      "It takes the state's label, tone and moves already resolved (`movesFrom` of `@krizaka/organize/contract`, in the person's language): /native adds no dependency.",
      "The menu is an action sheet; a reason is a second sheet.",
    ],
    examples: [{ name: "default", title: "Status of an applicant file", description: "A state and the sheet of its moves (confirm, reason); a derived status read-only." }],
  },
} satisfies ComponentMeta;
