import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Opening hours",
  summary: "A shop's weekly hours in one quiet row — « Open now · closes at 5 pm » and today's hours — that unfolds into the whole week, today highlighted.",
  status: "beta",
  category: "data-display",
  domain: "commerce",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public storefront is a web page.", use: "list" }, desktop: "web" },
  whenToUse: [
    "A shop's page or a place's card: when it is open now, and the week for whoever wants it.",
  ],
  whenNotToUse: [
    { when: "Hours as data to sort or edit.", use: "data-table" },
    { when: "A few facts of an object.", use: "description-list" },
  ],
  bestPractices: [
    "Compute `status` from the hours, the shop's time zone and the current time on the server; the block only lays it out.",
    "Pass each day's hours already formatted, with your word for closed when there are none (`Closed`).",
    "Name today (`today`) so its row is marked; the closed row then shows today's hours on a wide screen.",
    "Keep the row collapsed on a phone: the week is one tap away.",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter or Space", action: "Unfolds or folds the week (a native disclosure)." }],
    notes: [
      "A native `details`: the summary is the one control, named by the status, the detail and `label`.",
      "Today's row is `aria-current=\"date\"`; the status dot is decorative, the words say open or closed.",
    ],
  },
  related: ["service-card", "slot-picker", "description-list"],
  web: {
    imports: ["OpeningHours"],
    examples: [{ name: "week", title: "Week", description: "Open now, closing at 5 pm, with the week unfolded and Tuesday marked." }],
  },
} satisfies ComponentMeta;
