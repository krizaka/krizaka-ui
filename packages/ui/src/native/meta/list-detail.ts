import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "List and detail",
  summary: "A list and the item open from it. One pane at a time on a phone — the list, then the item with the way back — and both side by side when the room holds them, decided by the width the layout is given, not by the device.",
  status: "beta",
  category: "layout",
  domain: "navigation-shell",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "On the web the same two panes are the split view.", use: "split-view" }, desktop: { status: "n/a", reason: "The Mac app's window is the web: its list and detail are the split view.", use: "split-view" } },
  whenToUse: ["Messages, jobs, files: a list where each item opens a screen of its own.", "An app that must work on a phone and a tablet with the same screens."],
  whenNotToUse: [
    { when: "A list whose items open nothing.", use: "list" },
    { when: "A detail that is a full-screen flow.", use: "form-flow" },
  ],
  bestPractices: [
    "The app owns the selection: pass `detail` when an item is open, `undefined` when none is; `onBack` clears it. Keep it in the address (expo-router) so the back gesture works.",
    "Give the list a `List` (it scrolls itself) and the detail a plain content (it scrolls inside the layout).",
    "Both panes show from `listWidth + minDetailWidth` points (340 + 400 by default); at 200 % text the detail needs twice its width, so a tablet at the largest text size shows one pane.",
    "Say what the empty detail means (`empty`: « Select a message »): it only shows when both panes do.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Each pane has its own heading (the large title of the list, the title in the bar of the detail).", "On one pane the back button is named by `backLabel` (the list's title); both panes show no back button."],
  },
  related: ["grid", "header", "list", "screen", "split-view"],
  native: {
    imports: ["ListDetail"],
    differences: [],
    examples: [{ name: "inbox", title: "Inbox", description: "Messages: the list, then the message with the way back; both side by side on a tablet.", template: true, purpose: "converse", why: "A person reads a thread of messages one at a time on a phone, and the list stays in view when the room allows it." }],
  },
} satisfies ComponentMeta;
