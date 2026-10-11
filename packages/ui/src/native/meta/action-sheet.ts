import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Action sheet",
  summary: "A short list of actions on an item from the bottom edge, the destructive one in danger, cancel apart.",
  status: "beta",
  category: "overlays",
  platforms: "native",
  whenToUse: ["The “more” button of a video, a message, a comment.", "Choosing where a photo comes from: the library or the camera."],
  whenNotToUse: [
    { when: "For more than six actions or for content.", use: "bottom-sheet" },
    { when: "To confirm what the action does.", use: "dialog" },
  ],
  bestPractices: ["Put the destructive action last, in its own words (“Delete the video”).", "Keep it to verbs: share, edit, start an auction."],
  accessibility: {
    keyboard: [],
    notes: ["A `menu` of `menuitem`s named by the title; cancel is a button apart.", "A selection tick on each action when the app gives haptics."],
  },
  related: ["bottom-sheet", "dialog", "dropdown-menu"],
  native: {
    imports: ["ActionSheet"],
    differences: [],
    examples: [
      { name: "video-actions", title: "A video's actions", description: "Share, auction, edit, delete — cancel apart." },
    ],
  },
} satisfies ComponentMeta;
