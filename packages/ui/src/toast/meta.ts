import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Toast",
  summary:
    "A short message on frosted glass that comes and goes — its status a rail of light, with the time it has left drawn and paused under the pointer, an undo that waits before an action is final, a long task updated in place, and repeats folded into one toast that counts.",
  status: "stable",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "To confirm the result of an action: saved, sent, payment received.",
    "For an event the user did not trigger but should know: a new follower, a live auction.",
    "With an action (“Retry”, “Undo”) when there is one obvious next step.",
  ],
  whenNotToUse: [
    { when: "For a message that must stay until the situation changes.", use: "alert" },
    { when: "When the user must answer.", use: "dialog" },
    { when: "To report a form's errors: show them next to the fields.", use: "field" },
  ],
  bestPractices: [
    "Mount one `Toaster` in the root layout, with its `label` and `closeLabel` translated.",
    "A title in a few words, a description only if it adds something.",
    "Never put the only way to do something in a toast: it goes away.",
    "For what can be undone, act now and commit later: `undoToast` with `onUndo` and `onCommit` — no confirmation dialog.",
    "A background task: one `progressToast` updated with the same `id`, never a new toast per step.",
    "Events that repeat (messages, retries): `groupedToast` with a `countLabel` — one toast that counts, not a pile.",
  ],
  accessibility: {
    keyboard: [
      { keys: "F8", action: "Moves the focus to the toasts region (sonner's hotkey)." },
      { keys: "Tab / Enter", action: "Reach and press a toast's action or close button." },
    ],
    notes: ["The region is a landmark named by `label`; toasts are announced politely.", "Toasts pause while hovered or focused."],
  },
  related: ["alert", "dialog", "confirm-button"],
  web: {
    imports: ["toast", "Toaster", "undoToast", "progressToast", "groupedToast"],
    examples: [
      { name: "undo", title: "Undo before it is final", description: "`undoToast`: archived now, final when the hairline runs out — paused while you hover it." },
      { name: "upload-progress", title: "A task in the background", description: "`progressToast`: one toast updated in place, the glyph and a bar growing, a success at 100 %." },
      { name: "grouped", title: "Repeats fold", description: "`groupedToast`: five messages become one toast that counts “5 new messages”." },
      { name: "tones", title: "Tones", description: "Default, success, warning and error with an action." },
      { name: "custom", title: "Custom", description: "`toast.custom`: your JSX in the platform's shell." },
    ],
  },
  native: {
    imports: ["toast", "Toaster"],
    differences: [
      "`Toaster` takes `offset` (the safe-area inset) instead of a position; mount it inside `ThemeProvider`.",
      "Actions take `onPress`; a toast takes `onPress` to open what it is about.",
      "No `toast.custom`: an `icon` before the text instead.",
    ],
    examples: [
      { name: "tones", title: "Tones", description: "Default, success, and error with an action." },
      { name: "notification", title: "Notification", description: "An icon, tap to open it; `id` shows it once." },
    ],
  },
} satisfies ComponentMeta;
