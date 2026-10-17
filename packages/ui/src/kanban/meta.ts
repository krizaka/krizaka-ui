import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Kanban",
  summary: "Cards in columns moved by drag and drop — and by the keyboard (Space, the arrows, Space) — every move announced, column limits in the counts.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A board needs width and dragging between columns; on a phone each column is a tab over a list.", use: "tabs" }, desktop: "web" },
  whenToUse: ["Orochia's moderation queue: to review, reviewing, resolved.", "A release plan, a support queue."],
  whenNotToUse: [
    { when: "On a phone: a segmented list per column moves cards with an action sheet.", use: "segmented" },
    { when: "For an ordered list without stages.", use: "list" },
  ],
  bestPractices: ["Update the data in `onMove`: the board shows `cards` as given.", "Set `limit` on the columns that must not overflow."],
  accessibility: {
    keyboard: [
      { keys: "Space / Enter", action: "Picks the focused card up, or drops the carried one." },
      { keys: "Arrow Left / Arrow Right", action: "Carry the card to the previous or next column." },
      { keys: "Arrow Up / Arrow Down", action: "Move it within its column." },
      { keys: "Esc", action: "Puts the card back where it was." },
    ],
    notes: ["Every pick, move, drop and cancel is announced in words (`labels`).", "Each card describes how to move it; each column is a named region."],
  },
  related: ["list", "data-table"],
  web: {
    imports: ["Kanban"],
    examples: [{ name: "moderation", title: "Moderation queue", description: "Reports moved between three stages, the first column limited." }],
  },
} satisfies ComponentMeta;
