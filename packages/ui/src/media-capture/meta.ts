import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Media capture",
  summary: "The camera in the page: a photo or a clip, front or back, the permission asked only on a gesture, and a way out every time the camera cannot start.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No web user (ADR-006 audit, 2026-10-25), and no app imports `@krizaka/ui/native/media-capture`. Nothing is removed before 4.0; pick files with `FileUpload` on the web or `MediaPicker` in a mobile app.",
  },
  category: "media",
  domain: "media",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To take a profile picture or a selfie for a verification without leaving the page.",
    "To record a short clip (a story, a reply, a proof) with a maximum length.",
  ],
  whenNotToUse: [
    { when: "To send files the person already has: a drop zone.", use: "file-upload" },
    { when: "For a long recording with editing: record, then trim with the video trimmer.", use: "video-trimmer" },
  ],
  bestPractices: [
    "Say why the camera is needed in `labels.prompt` before asking: the browser's prompt then makes sense.",
    "Never ask on load: `autoStart` starts only when the permission is already granted.",
    "Set `maxDuration` for clips and show the limit; send the blob with the file upload's queue.",
    "In React Native, import it from `@krizaka/ui/native/media-capture` (expo-camera, an optional peer).",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "Turn the camera on, take the photo, start or stop the recording." }],
    notes: [
      "A `region` named by `labels.region`; the preview is decorative, the shutter is a button named by its action.",
      "A refusal or a missing camera is announced (`role=\"alert\"`) with the file picker as the way out.",
      "The recording time is a `timer`; under reduced motion the recording dot does not pulse.",
    ],
  },
  related: ["file-upload", "image-cropper", "video-player"],
  web: {
    imports: ["MediaCapture"],
    examples: [
      { name: "profile-photo", title: "Profile photo", description: "The front camera, a photo: the prompt explains before the browser asks." },
      { name: "clip", title: "Photo or clip", description: "`mode=\"both\"`: a switch above the preview, clips up to 60 seconds." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/media-capture",
    imports: ["MediaCapture"],
    differences: [
      "Its own entry, `@krizaka/ui/native/media-capture`, on expo-camera (an optional peer).",
      "`facing` is `front` or `back`; `onCapture` receives a file `uri`, not a blob; a refusal for good opens the Settings.",
      "`mode` is `photo` or `video`; `labels` is required.",
    ],
    examples: [{ name: "photo", title: "Photo", description: "Before the permission: why, and the button that asks." }],
  },
} satisfies ComponentMeta;
