import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Update prompt",
  summary: "The soft invitation to update: a banner the person can dismiss, with the versions and one button to the store.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "The web entry has no user (ADR-006 audit, 2026-10-25). The native `UpdatePrompt`, used by three mobile apps, stays.",
  },
  category: "feedback",
  domain: "feedback",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["When the backend says `updateMode: soft`: a newer version exists but the installed one still works.", "Once per version: after “Later”, the app does not ask again until the next release."],
  whenNotToUse: [{"when": "When the installed version can no longer work: block it.", "use": "force-update-screen"}, {"when": "For a message that is not about the app's version.", "use": "alert"}],
  bestPractices: ["Say what the update brings in one sentence (the backend's localized `message`), not a version number alone.", "Never show it over a task in progress: on the home screen or at launch.", "Remember the dismissal per `latestVersion` (`useAppConfig` does)."],
  accessibility: {
    keyboard: [],
    notes: ["A labelled `region`, read in order; the mark is decorative.", "Both buttons are reachable by keyboard and have visible names."],
  },
  related: ["force-update-screen", "maintenance-screen", "alert"],
  web: {
    imports: ["UpdatePrompt"],
    examples: [{ name: "default", title: "Default", description: "A banner with the versions, “Later” and “Update”." }],
  },
  native: {
    imports: ["UpdatePrompt"],
    differences: ["The buttons are native `Button`s (with `label`).", "Style with `style`, not `className`."],
    examples: [{ name: "default", title: "Default", description: "The soft prompt as a card at the top of the home screen." }],
  },
} satisfies ComponentMeta;
