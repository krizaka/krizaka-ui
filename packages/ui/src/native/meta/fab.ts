import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Floating action button",
  summary: "The screen's one main action, floating above the content in the accent, clear of the safe area and the tab bar.",
  status: "beta",
  category: "actions",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "A floating thumb-zone button is a touch idiom; a web screen puts its main action in the header.", use: "button" }, desktop: { status: "n/a", reason: "The Mac app puts its main action in the toolbar.", use: "button" } },
  whenToUse: ["Create on a list screen: a new challenge, a new message.", "Record on a camera-first screen."],
  whenNotToUse: [
    { when: "For a secondary action or several actions.", use: "button" },
    { when: "On a form: its submit button belongs at the bottom of the form.", use: "button" },
  ],
  bestPractices: ["One per screen, for the action the screen exists for.", "`extended` shows the words; collapse it while the list scrolls down.", "Pass the tab bar's height in `offset`."],
  accessibility: {
    keyboard: [],
    notes: ["A button named by `label`, extended or not.", "56 points high; a light tap when pressed."],
  },
  related: ["button", "tab-bar"],
  native: {
    imports: ["Fab"],
    differences: [],
    examples: [
      { name: "extended", title: "Extended and round", description: "With its words, and the round button alone." },
    ],
  },
} satisfies ComponentMeta;
