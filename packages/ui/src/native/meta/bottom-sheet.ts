import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Bottom sheet",
  summary: "A sheet from the bottom edge that rests at snap points, dragged by its handle, rising with the keyboard.",
  status: "beta",
  category: "overlays",
  platforms: "native",
  whenToUse: ["Comments over a video: half the screen first, drag up to read more.", "Filters or a short form with a main action pinned at the bottom.", "The native `Sheet`: anything that belongs to the screen under it."],
  whenNotToUse: [
    { when: "To confirm a destructive action.", use: "dialog" },
    { when: "For a short list of actions on an item.", use: "action-sheet" },
  ],
  bestPractices: ["Give one or two `snapPoints`, lowest first: the content should be useful at the first one.", "Pin the main action in `footer`: it stays above the keyboard and the home indicator.", "Pass the safe-area insets to `ThemeProvider insets`."],
  accessibility: {
    keyboard: [],
    notes: ["A modal `dialog` named by `title`, announced when it opens.", "Drag down, the scrim and the back button close it; `closeLabel` adds a button for everyone else.", "Under reduced motion it appears without sliding."],
  },
  related: ["dialog", "action-sheet", "field"],
  native: {
    imports: ["BottomSheet"],
    differences: [],
    examples: [
      { name: "comments", title: "Comments", description: "Half the screen, then nine tenths: drag between them." },
      { name: "filters", title: "Filters", description: "A pinned footer with the main action." },
    ],
  },
} satisfies ComponentMeta;
