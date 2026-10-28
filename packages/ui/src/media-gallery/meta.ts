import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Media gallery",
  summary: "A shop's own photos and loops in tiles — the first featured, loops playing muted while their tile is on screen (a still under reduced motion), a caption on the foot of a tile.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public storefront is a web page.", use: "photo-grid" }, desktop: "web" },
  whenToUse: ["The « look inside » of a business page: its real photos and short clips."],
  whenNotToUse: [
    { when: "A feed of videos with creators, counts and a preview.", use: "media-grid" },
    { when: "Editing and ordering a profile's photos.", use: "photo-grid" },
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
      "A loop is decorative (`aria-hidden`), starts only while its tile is on screen and never under reduced motion.",
    ],
  },
  related: ["media-grid", "photo-grid", "cover-hero"],
  web: {
    imports: ["MediaGallery"],
    examples: [{ name: "shop", title: "Shop", description: "Three photos, the first featured, one with a caption." }],
  },
} satisfies ComponentMeta;
