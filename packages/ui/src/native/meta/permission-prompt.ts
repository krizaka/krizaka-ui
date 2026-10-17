import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Permission prompt",
  summary: "Before the system's permission dialog, the app says why: a bird, what it is for, the button that asks — and the way to the settings once refused.",
  status: "beta",
  category: "feedback",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "The browser asks for a permission itself; the page explains it beforehand.", use: "alert" }, desktop: { status: "n/a", reason: "macOS asks for a permission itself; the app explains it beforehand.", use: "alert" } },
  whenToUse: ["Before the camera, the microphone, notifications, the photo library.", "When the permission was refused for good: the way to the settings."],
  whenNotToUse: [
    { when: "For a message that needs no permission.", use: "empty-state" },
  ],
  bestPractices: ["Ask in context, when the feature is used, never at launch.", "Say what the app does and does not do with it, in one or two sentences.", "Pass the module's status: `blocked` when the system will not ask again."],
  accessibility: {
    keyboard: [],
    notes: ["The bird is decorative; the words carry the message.", "Once granted it renders its children: the feature itself."],
  },
  related: ["empty-state", "media-capture"],
  native: {
    imports: ["PermissionPrompt"],
    differences: [],
    examples: [
      { name: "camera", title: "Camera", description: "Why the camera, before the system asks." },
      { name: "blocked", title: "Blocked", description: "Notifications refused: the way to the settings." },
    ],
  },
} satisfies ComponentMeta;
