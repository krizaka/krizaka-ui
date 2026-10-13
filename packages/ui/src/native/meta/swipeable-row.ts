import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Swipeable row",
  summary: "A row whose actions show under a swipe: left for the trailing ones, right for the leading ones, a full swipe runs the outermost.",
  status: "beta",
  category: "data-display",
  platforms: "native",
  whenToUse: ["A conversation: pin, archive, delete.", "A notification: mark read, delete."],
  whenNotToUse: [
    { when: "For the only way to reach an action: offer it in the row's menu too.", use: "action-sheet" },
  ],
  bestPractices: ["Two actions per side at most; the outermost is the one a full swipe runs.", "Destructive actions in `danger`, at the far edge."],
  accessibility: {
    keyboard: [],
    notes: ["Each action is an accessibility action (the rotor on iOS, the actions menu on Android): nothing is reachable only by a gesture.", "A medium tick when a full swipe passes its threshold."],
  },
  related: ["list", "action-sheet"],
  native: {
    imports: ["SwipeableRow"],
    differences: [],
    examples: [
      { name: "conversation", title: "A conversation", description: "Pin on the right swipe; archive and delete on the left." },
    ],
  },
} satisfies ComponentMeta;
