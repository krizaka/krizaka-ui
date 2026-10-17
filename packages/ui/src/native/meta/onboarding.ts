import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Onboarding",
  summary: "A first launch in a few slides: swipe or tap Next, Skip at any time, dots that say where you are.",
  status: "beta",
  category: "layout",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "A web first run is a few steps on one page.", use: "stepper" }, desktop: { status: "n/a", reason: "The Mac app's first run is the install wizard, a stepper.", use: "stepper" } },
  whenToUse: ["The first launch of an app: three promises, then the sign-in."],
  whenNotToUse: [
    { when: "To explain a single feature in place.", use: "permission-prompt" },
  ],
  bestPractices: ["Three slides, one promise each, a bird each.", "Remember that it was seen in `onDone`; never show it twice."],
  accessibility: {
    keyboard: [],
    notes: ["Each slide is announced with its position; the buttons do everything a swipe does.", "The safe areas are kept."],
  },
  related: ["mascots", "button"],
  native: {
    imports: ["Onboarding"],
    differences: [],
    examples: [
      { name: "first-launch", title: "First launch", description: "Orochia's three promises." },
    ],
  },
} satisfies ComponentMeta;
