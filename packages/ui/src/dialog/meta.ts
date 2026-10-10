import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Dialog",
  summary: "A window over the page — centred, a bottom sheet or a side panel — and `AlertDialog` for a confirmation.",
  status: "stable",
  category: "overlays",
  platforms: "web",
  whenToUse: [
    "For a short task that must be finished or cancelled before going back: invite someone, edit a title.",
    "`AlertDialog` to confirm a destructive or irreversible action, with an async `onConfirm`.",
    "`Sheet` (bottom) on phones, `placement=\"right\"` for a side panel of details.",
    "A gate the user must answer (age, terms): `hideClose` and `dismissible={false}`.",
  ],
  whenNotToUse: [
    { when: "For information next to an element, without blocking the page.", use: "popover" },
    { when: "For a message that needs no answer.", use: "toast" },
    { when: "For a long form or a flow of several steps: give it its own page." },
    { when: "To confirm the deletion of one item in place.", use: "confirm-button" },
  ],
  bestPractices: [
    "Always a `Dialog.Title`; a `Dialog.Description` when the title is not enough.",
    "Name the buttons by what they do (“Send the invitation”), the cancel one by what it keeps (“Keep it”).",
    "Pass `closeLabel` translated: it names the close button.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Esc", action: "Closes the dialog (unless `dismissible={false}`)." },
      { keys: "Tab / Shift+Tab", action: "Move within the dialog: the focus is trapped while it is open." },
    ],
    notes: [
      "Radix Dialog: `role=\"dialog\"` (or `alertdialog`), `aria-modal`, named by its title and described by its description.",
      "The focus moves into the dialog when it opens and returns to the trigger when it closes; the page behind does not scroll.",
      "`AlertDialog` keeps the focus on the cancel button first.",
    ],
  },
  related: ["popover", "confirm-button", "command", "toast"],
  web: {
    imports: ["Dialog", "Sheet", "AlertDialog"],
    examples: [
      { name: "center", title: "Centred", description: "A short form, `size=\"md\"`." },
      { name: "bottom", title: "Bottom sheet", description: "`placement=\"bottom\"`: a sheet on a phone, centred from `sm` up." },
      { name: "right", title: "Side panel", description: "`placement=\"right\"`: full height, for details." },
      { name: "sheet-form", title: "Sheet with a form", description: "`Sheet`, `size=\"lg\"`." },
      { name: "alert-destructive", title: "Alert dialog", description: "`AlertDialog tone=\"danger\"` with an async `onConfirm`." },
      { name: "gate", title: "Gate", description: "No close button: it closes only through its actions." },
    ],
  },
} satisfies ComponentMeta;
