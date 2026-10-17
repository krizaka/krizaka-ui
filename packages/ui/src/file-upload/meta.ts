import type { ComponentMeta } from "../meta";

export const meta = {
  title: "File upload",
  summary: "A drop zone that checks type, size and count, a list of uploads with preview, progress, speed and the actions each state allows, and a queue that pauses and resumes — Tus-ready without depending on it.",
  status: "beta",
  category: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "On a phone files come from the camera roll or the camera.", use: "media-picker" }, desktop: "web" },
  whenToUse: [
    "To send files: a video to publish, documents to index, pictures for a gallery.",
    "With `useUploadQueue` for large files that must survive a pause, a failure or a slow network (Tus, multipart).",
  ],
  whenNotToUse: [
    { when: "To take a picture or a clip with the camera in the page: media capture.", use: "media-capture" },
    { when: "To choose a picture's frame before sending it: the cropper, then the upload.", use: "image-cropper" },
  ],
  bestPractices: [
    "Say what is accepted in `hint` (“MP4 or MOV, up to 4 GB”) and enforce it with `accept` and `maxSize`.",
    "Explain each refusal with `refusalLabel` (“clip.avi is not a supported format”).",
    "Wrap your upload client in `upload(file, { signal, onProgress, resumed })`: abort on `signal`, resume from the offset when `resumed`.",
    "Revoke previews you create yourself; `useUploadQueue` revokes its own.",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter / Space", action: "On the button: open the file picker (dropping is never the only way)." }],
    notes: [
      "The zone's button is described by the title and the hint; the file input itself stays out of the tab order.",
      "Each upload's progress is a `progressbar` named by the file; a failure is announced (`role=\"alert\"`).",
      "Every action is a button named with the file (“Pause clip.mp4”).",
    ],
  },
  related: ["progress", "media-capture", "image-cropper", "video-trimmer"],
  web: {
    imports: ["Dropzone", "UploadList", "useUploadQueue", "acceptsFile", "formatBytes"],
    examples: [
      { name: "video", title: "Publish a video", description: "The zone and the queue together: drop, watch the progress, pause and resume." },
      { name: "states", title: "Every state", description: "`UploadList` with an upload under way, a paused one, a failed one and a finished one." },
      { name: "images", title: "Several pictures", description: "Up to six images of 10 MB; the refused ones are listed with their reason." },
      { name: "tus", title: "Tus, resumable", description: "`useUploadQueue` around a resumable client: abort on pause, continue from the offset on resume." },
    ],
  },
} satisfies ComponentMeta;
