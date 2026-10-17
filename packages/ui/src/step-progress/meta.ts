import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Step progress",
  summary: "The head of a multi-step flow — a sign-up, a profile to fill: back, segments that fill, the position in words.",
  status: "beta",
  category: "navigation",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["The onboarding of a dating app: name, birth date, photos, interests, location.", "A checkout in several steps."],
  whenNotToUse: [
    { when: "For the steps of a running process.", use: "stepper" },
    { when: "For a first launch's promises.", use: "onboarding" },
  ],
  bestPractices: ["Five steps or fewer; let people skip what is optional.", "Keep the position in words (`label`)."],
  accessibility: {
    keyboard: [],
    notes: ["A `progressbar` named and valued by the position in words."],
  },
  related: ["stepper", "onboarding", "progress"],
  web: {
    imports: ["StepProgress"],
    examples: [
      { name: "sign-up", title: "Sign-up", description: "Step 2 of 5, back and skip." },
    ],
  },
  native: {
    imports: ["StepProgress"],
    differences: ["`backLabel` + `onBack` instead of a `back` node; it keeps clear of the status bar."],
    examples: [
      { name: "sign-up", title: "Sign-up", description: "Step 2 of 5, back and skip." },
    ],
  },
} satisfies ComponentMeta;
