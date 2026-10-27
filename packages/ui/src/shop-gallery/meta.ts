import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Shop gallery",
  summary: "A shop's photos as a bento mosaic (one 2×2 lead, four tiles, the last one « + N photos »), a snap strip with a counter on a phone, and a lightbox with swipe, arrow keys and the alt text as caption. Fixed ratios, no layout shift; the lightbox is a lazy chunk.",
  status: "beta",
  category: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public page is a web page.", use: "photo-grid" }, desktop: "web" },
  whenToUse: [
    "The « Photos » section of a shop page: five to a few dozen real photos that a visitor looks at, then opens one by one.",
    "Any set of still images where a quiet mosaic and a full-size viewer are enough.",
  ],
  whenNotToUse: [
    { when: "Photos mixed with muted loops and captions on the tiles.", use: "media-gallery" },
    { when: "A feed of creator videos with counts and a preview.", use: "media-grid" },
  ],
  bestPractices: [
    "Give each photo its `alt`: it names the tile for a screen reader and is the lightbox's caption.",
    "Pass `srcSet` (400 / 800 / 1200 w) for the tiles and `fullSrcSet` for the lightbox; the tiles carry `sizes` and a fixed ratio, so the page never shifts.",
    "From five photos on a phone the mosaic becomes a snap strip with a « 1 / N » counter; with fewer it stays a two-column mosaic.",
    "Pass `labels` translated (`shopGalleryLabelsFr` for French); the host's text is never hard-coded here.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab / Enter / Space", action: "Move across the tiles and open one in the lightbox." },
      { keys: "← →", action: "Previous and next photo in the lightbox." },
      { keys: "Esc", action: "Close the lightbox; focus returns to the tile that opened it." },
    ],
    notes: [
      "Each tile is a button named « Open photo 3 of 12: … »; the lightbox is a modal dialog with its focus trapped, and swiping works on touch.",
      "Under reduced motion the hover zoom, the smooth strip scroll and the photo fade stop.",
    ],
  },
  related: ["media-gallery", "dialog", "shop", "wall"],
  web: {
    imports: ["ShopGallery", "shopGalleryLabels", "shopGalleryLabelsFr"],
    examples: [
      { name: "five", title: "Five photos", description: "The bento at its fullest: a lead and four tiles; a snap strip on a phone." },
      { name: "twelve", title: "Twelve photos", description: "The last tile reads « + 8 photos » and opens the rest in the lightbox." },
      { name: "three", title: "Three photos, in French", description: "A short set stays a mosaic on every screen; labels in French." },
    ],
  },
} satisfies ComponentMeta;
