import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Form flow",
  summary: "A form told in steps on a screen: the step's question, its fields, the position in words, the main action pinned above the keyboard and clear of the home indicator, dimmed until the step is valid.",
  status: "experimental",
  adoption: "akinaza#104",
  category: "layout",
  domain: "navigation-shell",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "On the web a flow is a stepper above a form.", use: "stepper" }, desktop: { status: "n/a", reason: "The Mac app's window is the web: its flow is the stepper.", use: "stepper" } },
  whenToUse: ["Sign-up, a profile to fill, an application: more than four fields that read better one group at a time."],
  whenNotToUse: [
    { when: "Four fields or fewer.", use: "screen" },
    { when: "Settings that apply at once.", use: "settings-layout" },
  ],
  bestPractices: [
    "One question or one group of fields per step; say what the step is in `title`, why in `description`.",
    "The fields' values belong to the app, so Back never loses what was typed.",
    "Set `valid` on a step: the main action is dimmed until it is true. Validate on the server too.",
    "The last step's action says what happens (« Create my account »), not « Done ».",
    "Drive the step yourself (`step`, `onStepChange`) to keep it in the address; otherwise the flow keeps it.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The position is read in words (`Step 2 of 4`), and the title of a step is announced when it changes (polite live region).", "The main action rises with the keyboard and keeps clear of the home indicator (`Screen`'s keyboard avoidance and the safe area)."],
  },
  related: ["screen", "step-progress", "field", "button"],
  native: {
    imports: ["FormFlow"],
    differences: [],
    examples: [{ name: "signup", title: "Sign-up in steps", description: "Two steps, the position in words, the main action dimmed until the step is valid.", template: true, purpose: "act", why: "A person answers one question at a time with the thumb, the main action always above the keyboard." }],
  },
} satisfies ComponentMeta;
