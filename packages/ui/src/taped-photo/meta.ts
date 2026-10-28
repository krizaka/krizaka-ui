import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Taped photo",
  summary:
    "A print taped in the notebook: slightly tilted, a thin white print border, a soft paper shadow and strips of tape. It holds any picture — an image, a video, a live scene.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "The picture that opens a page on the Cahier: the flock's scene on www.krizaka.com, a chapter of /story.",
    "A photo the reader should feel was kept by hand: a shop's counter on its wall, a team photo.",
  ],
  whenNotToUse: [
    { when: "A set of pictures to browse.", use: "media-gallery" },
    { when: "The birds as numbered figures with their promises.", use: "bird-plate" },
  ],
  bestPractices: [
    "One taped photo per screen: two prints side by side read as a collage, not as the page's picture.",
    "Keep the tilt small (−2° to 2°); lean the prints of one page the same way unless they face each other.",
    "The picture keeps its own box (an `aspect-ratio` or a sized image), so the tilt never moves the layout.",
    "Write the caption as a note, not a title: what it shows, where, when.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `figure`; the caption is its `figcaption`, real text.",
      "The tape and the shadow are decoration (pseudo-elements). Give the picture its own alternative text, or mark a decorative scene `aria-hidden` and say it in the caption.",
      "The tilt is a transform: nothing moves under `prefers-reduced-motion` because nothing animates.",
    ],
  },
  related: ["bird-plate", "flock", "media-gallery", "specimen-tag"],
  web: {
    imports: ["TapedPhoto"],
    examples: [
      { name: "scene", title: "The flock's scene", description: "A live scene as a print taped at two corners, its caption written on it." },
      { name: "top", title: "Taped at the top", description: "`tape=\"top\"`, leaning right: a shop's photo on its wall." },
    ],
  },
} satisfies ComponentMeta;
