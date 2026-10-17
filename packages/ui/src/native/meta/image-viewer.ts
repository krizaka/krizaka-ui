import type { ComponentMeta } from "../../meta";

export const meta = {
  title: "Image viewer",
  summary: "Images full screen on black: pinch and double tap to zoom, swipe between images, swipe down to close.",
  status: "beta",
  category: "media",
  platforms: "native",
  parity: { web: { status: "gap", issue: "krizaka/krizaka-ui#279", reason: "The web galleries need a full-screen viewer too." }, desktop: { status: "gap", issue: "krizaka/krizaka-ui#279", reason: "The Mac app renders the web's viewer once it exists." } },
  whenToUse: ["The photos of a post or a message, opened full screen.", "A creator's gallery."],
  whenNotToUse: [
    { when: "For a video.", use: "video-player" },
    { when: "To crop an image before upload.", use: "image-cropper" },
  ],
  bestPractices: ["Give every image its words (`alt`); a caption when it adds something.", "Call `prefetchNeighbours` so the next swipe shows at once."],
  accessibility: {
    keyboard: [],
    notes: ["The image is named by its words and its position (“2 of 5”); swipes of the screen reader move between images.", "The close button is named by `closeLabel`; the escape gesture closes it."],
  },
  related: ["video-player", "image-cropper"],
  native: {
    imports: ["ImageViewer", "prefetchNeighbours"],
    differences: [],
    examples: [
      { name: "gallery", title: "A gallery", description: "Three photos, the first one open, its caption under it." },
    ],
  },
} satisfies ComponentMeta;
