import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Countdown",
  summary: "The time left until a moment, in tabular figures, turning urgent under a threshold.",
  status: "stable",
  category: "data-display",
  platforms: "both",
  whenToUse: [
    "For a deadline the user acts against: an auction, an offer, a live event about to start.",
    "With the server's clock (`skewMs`) when the end is decided by the server.",
  ],
  whenNotToUse: [
    { when: "For a date far away: write the date (“Ends on 12 May”)." },
    { when: "For the progress of a task.", use: "progress" },
    { when: "For an elapsed time that keeps growing: format a duration in the text." },
  ],
  bestPractices: [
    "Pass `units` and `label` translated: they are the app's words.",
    "Use `size=\"md\"` or larger when it can turn urgent: the danger colour is large-text safe from `md`.",
    "Say what happens at zero next to it: the countdown only shows zeros.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"timer\"` named by `label`, without live announcements: a screen reader is not interrupted every second.",
      "Announce the end yourself (a toast, a status) if it matters.",
      "The pulse of the last segment stops under `prefers-reduced-motion`.",
    ],
  },
  related: ["progress", "badge", "stat"],
  web: {
    imports: ["Countdown"],
    examples: [
      { name: "hours", title: "Hours", description: "Hours, minutes and seconds." },
      { name: "days", title: "Days", description: "Days appear when there are some." },
      { name: "sizes", title: "Sizes", description: "`sm`, `md` (default), `lg`." },
      { name: "urgent", title: "Urgent", description: "Under a minute: the danger role, the last segment pulses." },
      { name: "ended", title: "Ended", description: "Past the target: zeros and `data-ended`." },
    ],
  },
  native: {
    imports: ["Countdown"],
    differences: ["Same props and same clock as the web; style with `style`.", "`useCountdown` and `splitDuration` are exported for a custom layout."],
    examples: [
      { name: "hours", title: "Hours", description: "Hours, minutes, seconds." },
      { name: "days", title: "Days", description: "Days, hours, minutes." },
      { name: "sizes", title: "Sizes", description: "`sm`, `md`, `lg`." },
      { name: "urgent", title: "Urgent", description: "Under a minute: the danger role." },
    ],
  },
} satisfies ComponentMeta;
