import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Continue prompt",
  summary:
    "The last call of a page or a flow: a short question, what counts (days, seats, seconds), and the one action that continues — a calm card by default, an arcade cabinet as a variant.",
  status: "beta",
  category: "actions",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding.", use: "onboarding" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The end of a trial or an offer: what is left, and the way to continue.",
    "The end of a told page: start again, go to the products.",
    "A drop or an event with places left, beside the one action.",
  ],
  whenNotToUse: [
    { when: "A call to act inside a page's section, with two actions.", use: "cta-panel" },
    { when: "A countdown on its own, to a deadline.", use: "countdown" },
    { when: "Confirming a destructive action.", use: "confirm-button" },
  ],
  bestPractices: [
    "One action, named by what it does (“Continue with Creator”), never “OK”.",
    "For a real deadline, pass a live `Countdown` as `count`; a still figure otherwise.",
    "No false urgency: the count says something true.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The action is a `button` (with `onAction`) or a link (with `href`), named by `actionLabel`; the key-cap and the arrow are decorative.",
      "The arcade screen switches on once in a stage; its loop runs only while on screen and never under `prefers-reduced-motion`.",
    ],
  },
  related: ["cta-panel", "countdown", "button"],
  web: {
    imports: ["ContinuePrompt"],
    examples: [
      { name: "offer", title: "The end of a trial", description: "Three days left, everything on, the one link that continues." },
      { name: "arcade", title: "Arcade flavour", description: "The cabinet at the end of a told page: a dark screen, a key-cap, back to the top." },
    ],
  },
} satisfies ComponentMeta;
