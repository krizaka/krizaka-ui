import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Kind config editor",
  summary:
    "The admin's editors of a kind's vocabulary (`@krizaka/organize` `KindConfig`, krizaka-ts#89): `TagSetEditor` — the tags offered, who manages them, whether people add their own, the most — and `StatusSetEditor` — the states in their order, the initial state, the moves from × to with their roles, confirmation and reasons. Value in, `onChange` out; the product posts the save.",
  status: "beta",
  category: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "A product's settings where the admin sets the tags and the statuses of a kind (clients, invoices, applicant files): « the admin configures everything ».",
    "To show the problems the server's own rules found (`kindConfigProblems`) in the place where they are fixed.",
  ],
  whenNotToUse: [
    { when: "For a person's own tags on a file.", use: "tag-selector" },
    { when: "To change the state of one entity.", use: "status-chip" },
    { when: "For any other setting.", use: "settings-layout" },
  ],
  bestPractices: [
    "Keep the descriptor in state, pass it as `value` and post it yourself with the `version` you read: a `CONFLICT` (409) says someone else changed it, a `STATE_IN_USE` (409) names the states entities still hold.",
    "Pass `problems={kindConfigProblems(config)}`: the same rules as the server, shown above the list.",
    "A colour is a name of the closed palette (`blue · green · amber · red · violet · gray`), never a colour picker; a status never takes a tag's colour.",
    "A reason is a list the admin writes in both languages, off by default; there is never a free-text reason.",
    "The order of the states is the order of the status column: reorder with the handle, the buttons, or Alt + ↑ ↓ in a field.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Reaches each field, switch and button in reading order." },
      { keys: "Alt + ↑ / Alt + ↓", action: "In a name or a label, moves the row up or down; the focus follows the field." },
      { keys: "Arrow keys", action: "In a colour group, move between the six swatches." },
      { keys: "Enter", action: "In the field that adds a tag, adds it." },
    ],
    notes: [
      "Every control has its own accessible name: a field says its position and its language (« Label in French of state 2 »), a move says its two states and its roles.",
      "Dragging is an extra: the move-up and move-down buttons do the same, and the handle is not drawn on a phone.",
      "A final state's row of moves says « Final: no way out » instead of offering buttons; the initial state's « final » switch is off and says why.",
      "Problems are an alert above the list; a field with an empty label or a duplicate name is `aria-invalid` and says so.",
    ],
  },
  related: ["tag-selector", "status-chip", "chip", "settings-layout", "switch"],
  web: {
    imports: ["TagSetEditor", "StatusSetEditor"],
    examples: [
      { name: "tag-set", title: "Tag set", description: "The presets of a hair studio's clients (name, colour, order), who manages tags, « people can add their own », the most; the server's problems in place." },
      { name: "status-set", title: "Status set", description: "Applicant files: states in order with both labels, tone and final, the initial state, and the moves from × to with roles, confirmation and reasons." },
      { name: "derived", title: "Derived set", description: "An invoice's statuses come from the ledger: shown, with nothing to move." },
    ],
  },
  native: {
    imports: ["TagSetEditor", "StatusSetEditor"],
    differences: ["The same props. Reorder with the up and down buttons (no drag).", "A tone is picked in a sheet; the moves are chips, the one chosen opens its roles, confirmation and reasons below."],
    examples: [
      { name: "tag-set", title: "Tag set", description: "The presets, who manages them, the most." },
      { name: "status-set", title: "Status set", description: "The states in order and the moves by role." },
    ],
  },
} satisfies ComponentMeta;
