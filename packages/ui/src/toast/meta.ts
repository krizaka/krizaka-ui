import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Toast",
  summary: "A short message that comes and goes: `toast()` from anywhere, one `Toaster` per app.",
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
    imports: ["toast", "Toaster"],
    examples: [
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
