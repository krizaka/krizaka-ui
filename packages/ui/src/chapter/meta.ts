import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chapter",
  summary:
    "The chapters of a story on the Cahier's ruled lines (ADR-004): `ChapterIndex` (one ruled line per chapter, the number in the margin, the serif title the link, the latest marked « New »), `ChapterHead` and `ChapterFoot` for the top and bottom of a chapter's page. No boxes. `variant=\"album\"` draws each chapter's cover as a taped print beside its title, the rows alternating left and right.",
  status: "beta",
  category: "blocks",
  domain: "cahier",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A long read's index and page frame on a public site; an app lists its items with List.", use: "list" },
    desktop: "web",
  },
  whenToUse: [
    "The chapters of a story or a series, read in order: a timeline you follow, never a feed of cards.",
    "The home of a blog or a story, where each chapter has a cover: `variant=\"album\"`, light, a taped print and one line each.",
    "The head of a chapter's page (its number, title, period and reading time, the standfirst once) and its foot (previous, next, back to the story).",
  ],
  whenNotToUse: [
    { when: "Entries the reader browses or picks among, with a picture or an argument each.", use: "link-card" },
    { when: "The sections of the page being read.", use: "toc" },
    { when: "A documentation's index with page numbers.", use: "page-index" },
  ],
  bestPractices: [
    "Short numbers in the margin (`01`, `§ 1`): the margin is 3 rem wide; the word « Chapter » belongs to the page's heading.",
    "One line per chapter: the title and its period. Say what was faced and what was built once, on the chapter's page (`ChapterHead`'s standfirst); `detail` is for an index that truly needs a second line.",
    "In the album, give every chapter a `cover` with its real `width` and `height` (the print keeps its aspect-ratio, nothing shifts) and one short `detail`: what was built, in a sentence. The covers after the first two load lazily.",
    "Inside a `Page` that already draws the margin, the chapters keep their number column and draw no second red line.",
    "Mark only the latest chapter `isNew`, and only while it is new.",
    "`ChapterIndex` rules its own lines so every row lands on one: put it in a section without `paper`, or pass `paper={false}` when the list starts on the page's module.",
    "Give `ChapterHead` the two `versusLabels`: the arrow of the standfirst is drawn, a screen reader hears the labels.",
    "Pass the router link as `linkAs` so internal chapters prefetch.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves from one chapter's title to the next; the focus ring outlines the whole row." }],
    notes: [
      "`ChapterIndex` is an ordered list (`role=\"list\"`, kept by VoiceOver without bullets) of links named by their title; the « New » mark is read inside the link, the number and the period around it.",
      "The whole row is the link's hit area (a stretched pseudo-element); only the title and the mark are its name.",
      "`ChapterHead` renders a real `h1` (or `h2` with `level={2}`); the meta line's separator and the standfirst's arrow are hidden from assistive technology.",
      "`ChapterFoot` is a `nav` named by `label` (« Chapters »); its links carry `rel=\"prev\"` and `rel=\"next\"`, their arrows are decorative.",
      "In the album the cover is decorative (`alt=\"\"`, the print `aria-hidden`): the title is the link's name, the whole row its hit area.",
      "Nothing moves: hover and focus underline the title in the hue, also under reduced motion.",
    ],
  },
  related: ["page", "page-index", "toc", "footnote", "taped-photo"],
  web: {
    imports: ["ChapterIndex", "ChapterHead", "ChapterFoot"],
    examples: [
      { name: "index", title: "The chapters of a story", description: "Eight chapters in reading order, one ruled line each, the latest marked « Nouveau »." },
      { name: "detail", title: "With a second line", description: "The optional `detail`: what was faced → what was built, on the next ruled line." },
      { name: "album", title: "The chapters as an album", description: "`variant=\"album\"`: each cover a taped print, alternating left and right, the title, one line and the period beside it." },
      { name: "in-ruled-page", title: "Inside a ruled page", description: "In a `Page` with `margin`, one red rule only: the page's." },
      { name: "head", title: "A chapter's head", description: "The number in the margin, the title, the period and the reading time, the standfirst once." },
      { name: "foot", title: "A chapter's foot", description: "The previous and the next chapters on the lines, then one line back to the story." },
      { name: "reading-page", title: "The latest chapter, top and bottom", description: "Head and foot around the reading column; no next chapter yet." },
    ],
  },
} satisfies ComponentMeta;
