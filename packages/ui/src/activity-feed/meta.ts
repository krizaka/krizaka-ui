import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Activity feed",
  summary: "What happened, newest first: grouped by day, runs folded (“×3”), “2 min ago” kept fresh, new events announced — and `Timeline`, one thing's history on a rail.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  whenToUse: ["Orazaka's job activity, Orochia's notifications and tips.", "The bids of a live auction (`live`).", "A payout's or a job's history (`Timeline`)."],
  whenNotToUse: [
    { when: "For the steps still to come of a process.", use: "stepper" },
    { when: "For records to browse or select.", use: "list" },
  ],
  bestPractices: [
    "Write each event as a sentence (“Mina tipped your video $5”), passed translated.",
    "Give `actor` and `kind` to fold repeated events.",
    "Pass `now` from the server to render the same “… ago” on both sides.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["Days are headings; each time is a `time` with its full date.", "`live` announces how many new events arrived, politely, never each one."],
  },
  related: ["list", "stepper", "toast"],
  web: {
    imports: ["ActivityFeed", "Timeline"],
    examples: [
      { name: "job-activity", title: "Activity", description: "By day, three tips folded into one, how long ago." },
      { name: "live", title: "Live", description: "New bids announced, each led by its bidder's avatar." },
      { name: "timeline", title: "Timeline", description: "A payout's history, oldest first." },
    ],
  },
  native: {
    imports: ["ActivityFeed"],
    differences: ["A SectionList with sticky day headings; `live` announces through the platform.", "No `Timeline` yet: use `Stepper` for a history on a phone."],
    examples: [{ name: "notifications", title: "Notifications", description: "The activity tab: by day, tips folded." }],
  },
} satisfies ComponentMeta;
