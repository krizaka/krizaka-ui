import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Confirm button",
  summary: "A destructive action in two presses: the first arms it and says what will happen, the second runs it.",
  status: "beta",
  category: "actions",
  platforms: "web",
  whenToUse: [
    "For a destructive action on one item, in place: delete a comment, remove a member, leave a group.",
    "When a dialog would be too heavy and an undo is not possible.",
  ],
  whenNotToUse: [
    { when: "When the consequences need explaining, or several things are affected.", use: "dialog" },
    { when: "For an action that is not destructive.", use: "button" },
    { when: "When the action can be undone: run it at once and offer “Undo” in a toast.", use: "toast" },
  ],
  bestPractices: [
    "`confirmLabel` says the consequence as a question: “Delete for good?”.",
    "Keep `timeoutMs` short (4 s by default): an armed button left on screen is a trap.",
    "Never use `window.confirm` for this.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "Arms, then confirms." },
      { keys: "Esc", action: "Disarms; so does moving the focus away." },
    ],
    notes: [
      "Once armed, `confirmLabel` names the button and is announced politely.",
      "An icon-only confirm button needs `label` while idle.",
      "The armed state is `data-armed`: style it with the danger tint, the words stay a text role.",
    ],
  },
  related: ["button", "dialog", "toast"],
  web: {
    imports: ["ConfirmButton"],
    examples: [
      { name: "idle", title: "Icon, idle", description: "An icon named by `label`." },
      { name: "armed", title: "Armed", description: "After the first press: the danger border and tint, the words legible." },
      { name: "with-text", title: "With words", description: "Once armed, `armedContent` replaces the words." },
    ],
  },
} satisfies ComponentMeta;
