import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Image cropper",
  summary: "A fixed frame — square, round, 9:16, a banner — over a picture or a video the person drags and zooms; a focus point and a zoom out, `cropRect` for the pixels.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "media",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#278", reason: "Avatars and covers are sent uncropped from the phone today." }, desktop: "web" },
  whenToUse: [
    "To frame a profile picture or a cover before sending it.",
    "To choose what a vertical (9:16) or square version of a landscape video keeps.",
  ],
  whenNotToUse: [
    { when: "To cut a video in time (not in space): the video trimmer.", use: "video-trimmer" },
    { when: "To send a file as it is: the file upload.", use: "file-upload" },
  ],
  bestPractices: [
    "Store the focus point and the zoom (screen-independent), and crop on the server with `cropRect`.",
    "Use `round` for an avatar: the person sees what others will see.",
    "Keep the zoom slider (`showZoom`): pinch and Ctrl + wheel are not obvious to everyone.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Move the picture in the frame (Shift: faster)." },
      { keys: "+ / −", action: "Zoom in or out." },
    ],
    notes: [
      "The frame is a focusable `group` named by `labels.frame` and described by `labels.instructions`.",
      "The zoom is a `slider` read as a percentage.",
      "Nothing moves but what the person moves.",
    ],
  },
  related: ["file-upload", "media-capture", "avatar", "slider"],
  web: {
    imports: ["ImageCropper", "cropRect"],
    examples: [
      { name: "avatar", title: "Profile picture", description: "A round mask on a square frame." },
      { name: "banner", title: "Banner", description: "A 3:1 frame for a profile's cover, zoomed in." },
      { name: "vertical-video", title: "Vertical version of a video", description: "A `<video>` as the media, a 9:16 frame: choose what the vertical cut keeps." },
    ],
  },
} satisfies ComponentMeta;
