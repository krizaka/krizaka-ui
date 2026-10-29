import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Maintenance screen",
  summary: "The screen of a service down on purpose: what is happening, when to come back, one button to check again.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "The web entry has no user (ADR-006 audit, 2026-10-25). The native `MaintenanceScreen`, used by mobile apps, stays.",
  },
  category: "feedback",
  domain: "feedback",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["When the backend's parameters say maintenance is on.", "In place of the app, for the minutes the service is down."],
  whenNotToUse: [{"when": "When something broke unexpectedly.", "use": "error-page"}, {"when": "When the installed version is too old.", "use": "force-update-screen"}],
  bestPractices: ["Say what is happening and, if you know, when to come back.", "Keep “Try again”: the person decides when to check.", "Take the text from the backend's `maintenance.message` so the operator can write it."],
  accessibility: {
    keyboard: [],
    notes: ["The title and message are a polite `status`; the mark is decorative."],
  },
  related: ["force-update-screen", "status-page", "error-page"],
  web: {
    imports: ["MaintenanceScreen"],
    examples: [{ name: "default", title: "Default", description: "The title, the operator's message and “Try again”." }],
  },
  native: {
    imports: ["MaintenanceScreen"],
    differences: ["The retry is a native `Button` (with `label`).", "Fills the screen; style with `style`, not `className`."],
    examples: [{ name: "default", title: "Default", description: "The maintenance screen with the retry button." }],
  },
} satisfies ComponentMeta;
