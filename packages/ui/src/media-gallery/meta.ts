import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Media gallery",
  summary: "Also `MediaCarousel` (3 to 4 realisations, one at a time) and `MediaPlayer` (the one video frame: inline, lightbox, 9:16). A shop's own photos and loops in tiles — the first featured, loops playing muted while their tile is on screen (a still under reduced motion), a caption on the foot of a tile.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public storefront is a web page." }, desktop: "web" },
  whenToUse: ["The « look inside » of a business page: its real photos and short clips."],
  whenNotToUse: [
    { when: "A demo gallery with titles and captions per piece." },
  ],
  bestPractices: [
    "Real photos only; every tile has `alt` text that says what it shows.",
    "Give a landscape source `shape=\"wide\"` so it is not cropped to a portrait.",
    "Keep loops short and few: one or two per gallery.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A list named by `label`; each tile is a figure with the photo's `alt` and its caption.",
      "`MediaCarousel` is a `carousel` region named by `label`; each slide is a numbered group, only the one in view is exposed (`inert` on the others); previous / next are buttons in a `toolbar` that also takes ← / → (at an end the focus moves to the other button), a swipe turns one slide, the track has no scroll of its own to reach, the count is polite.",
      "`MediaPlayer` in a lightbox: one button named `playLabel` opens a modal dialog (focus trapped, Escape closes, focus returns) holding the VideoPlayer; the press starts it with sound.",
      "Nothing moves under the pointer and nothing advances by itself; a loop plays only on the slide in view, never under reduced motion (the still shows, the buttons stay).",
      "A loop is decorative (`aria-hidden`), starts only while its tile is on screen and never under reduced motion.",
    ],
  },
  related: ["cover-hero"],
  web: {
    imports: ["MediaGallery", "MediaCarousel", "MediaPlayer"],
    examples: [
      { name: "shop", title: "Shop", description: "Three photos, the first featured, one with a caption." },
      { name: "carousel", title: "Carousel", description: "Three realisations one at a time, the first opens its film; buttons (and ← / → on them), swipe, nothing advances by itself." },
      { name: "player", title: "Player", description: "The one video frame: a poster that opens a lightbox started by the press (with sound), 16:9 and vertical 9:16." },
    ],
  },
} satisfies ComponentMeta;
