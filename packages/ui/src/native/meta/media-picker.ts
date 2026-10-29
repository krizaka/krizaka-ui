import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Media picker",
  summary: "Photos and videos picked from the library or the camera, as a grid of tiles with a remove button and a count.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "native",
  parity: { web: { status: "n/a", reason: "The web picks files with an upload field.", use: "file-upload" }, desktop: { status: "n/a", reason: "The Mac app picks files with the upload field and drag and drop.", use: "file-upload" } },
  whenToUse: ["The photos of a story, a post, a profile.", "A proof of delivery for a challenge."],
  whenNotToUse: [
    { when: "To film in the app itself." },
    { when: "For files on the web.", use: "file-upload" },
  ],
  bestPractices: ["Set `max`, and `accept` to what the feature takes.", "Upload from the `uri` of each picked item (a `Dropzone` on the web)."],
  accessibility: {
    keyboard: [],
    notes: ["The add tile and each remove button are named (`labels`).", "Refused camera: `onPermissionDenied` shows a `PermissionPrompt`."],
  },
  related: ["permission-prompt", "image-viewer"],
  native: {
    entry: "@krizaka/ui/native/media-picker",
    imports: ["MediaPicker"],
    differences: [],
    examples: [
      { name: "story", title: "A story's photos", description: "Up to four photos, from the library or the camera." },
    ],
  },
} satisfies ComponentMeta;
