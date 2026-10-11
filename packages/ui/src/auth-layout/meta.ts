import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Auth layout",
  summary: "An entry screen — sign in, sign up, verify, onboarding: the product's brand panel (its gradient, a promise, a quote) beside a calm form; one column on a phone with the mark above the form.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  whenToUse: ["Sign-in, sign-up, password reset, email verification.", "The first steps of an onboarding."],
  whenNotToUse: [
    { when: "For settings once signed in.", use: "settings-layout" },
    { when: "For a dialog that asks to sign in over a page.", use: "dialog" },
  ],
  bestPractices: ["One primary action (cut, shimmer) at full width; the alternatives as secondary buttons under it.", "The promise in five words, a real person's sentence under it.", "Autocomplete on every field (`email`, `current-password`, `one-time-code`)."],
  accessibility: {
    keyboard: [],
    notes: ["The form's title is the page's `h1`, inside `main`.", "The brand panel is decorative on a phone (hidden); its text is read on a desktop."],
  },
  related: ["field", "button", "stepper"],
  web: {
    imports: ["AuthLayout"],
    examples: [
      { name: "sign-in", title: "Orochia · sign in", description: "The brand panel with the promise and a creator's words, email and password, a passkey.", template: true },
      { name: "onboarding", title: "Onboarding", description: "The steps in words above the current step's form.", template: true },
      { name: "verify", title: "Verify an email", description: "The smallest entry screen: a code." },
    ],
  },
} satisfies ComponentMeta;
