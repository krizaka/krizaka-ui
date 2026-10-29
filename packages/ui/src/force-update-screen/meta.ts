import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Force update screen",
  summary: "The blocking screen of a version that can no longer run: the mark, one sentence, one button to the store.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "The web entry has no user (ADR-006 audit, 2026-10-25). The native `ForceUpdateScreen`, used by mobile apps, stays.",
  },
  category: "feedback",
  domain: "feedback",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["When the backend says `updateMode: force` or answers `426 Upgrade Required`.", "In place of the whole app: nothing behind it must be reachable."],
  whenNotToUse: [{"when": "When the installed version still works: invite, do not block.", "use": "update-prompt"}, {"when": "When the service is down on purpose.", "use": "maintenance-screen"}],
  bestPractices: ["Say why in one sentence and give one way out: the store button.", "Show the installed and the required version, in mono.", "Offer “Check again” for the person who just updated from the store."],
  accessibility: {
    keyboard: [],
    notes: ["A `main` with the title as its `h1`; the update button takes focus at once.", "The mark is decorative."],
  },
  related: ["update-prompt", "maintenance-screen", "error-page"],
  web: {
    imports: ["ForceUpdateScreen"],
    examples: [{ name: "default", title: "Default", description: "The title, the sentence, the versions and the store button." }],
  },
  native: {
    imports: ["ForceUpdateScreen"],
    differences: ["The buttons are native `Button`s (with `label`).", "Fills the screen; style with `style`, not `className`."],
    examples: [{ name: "default", title: "Default", description: "The blocking screen with the store button." }],
  },
} satisfies ComponentMeta;
