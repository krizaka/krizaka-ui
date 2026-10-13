import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Header",
  summary: "A screen's header: the bar under the status bar, and a large title that folds into it as the content scrolls.",
  status: "beta",
  category: "navigation",
  platforms: "native",
  whenToUse: ["The top of a section of the app: Earnings, Messages, Jobs.", "A detail screen with a back button (`size=\"inline\"`)."],
  whenNotToUse: [
    { when: "For the app's sections.", use: "tab-bar" },
    { when: "For a page header on the web.", use: "page-header" },
  ],
  bestPractices: ["Feed it the list's scroll with `useCollapsingHeader()`.", "Put a search field or tabs under the title as `children`.", "Two actions at most in the bar."],
  accessibility: {
    keyboard: [],
    notes: ["The title is the screen's heading for screen readers, folded or not.", "The back button is named by `backLabel`."],
  },
  related: ["tab-bar", "search-field", "page-header"],
  native: {
    imports: ["Header", "useCollapsingHeader"],
    differences: [],
    examples: [
      { name: "large-title", title: "Large title", description: "Folds into the bar as the list scrolls; a search field under it." },
    ],
  },
} satisfies ComponentMeta;
