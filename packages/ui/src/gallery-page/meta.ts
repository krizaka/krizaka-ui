import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Gallery page",
  summary: "A demo or a gallery: the filters as links, then the pieces in staggered columns, each framed with how it was made.",
  status: "beta",
  category: "templates",
  platforms: "web",
  whenToUse: ["What a product made (images, voices) or recordings of it.", "A portfolio of real work."],
  whenNotToUse: [
    { when: "For a catalogue of things to open and compare.", use: "catalogue-page" },
    { when: "For one recording.", use: "video-player" },
  ],
  bestPractices: ["Filters as links: the address keeps the choice.", "A caption says how each piece was made (a prompt, a seed, a time).", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["Each piece is a `figure` with its caption; images carry their `alt`.", "The gallery is a list named by `galleryLabel`."],
  },
  related: ["catalogue-page", "chip-link", "video-player"],
  web: {
    imports: ["GalleryPage"],
    examples: [
      { name: "made-here", title: "Made on this Mac", description: "Images Orazaka generated locally, with their prompt and seed.", template: true, purpose: "show", why: "A visitor browses real results, each with how it was made." },
    ],
  },
} satisfies ComponentMeta;
