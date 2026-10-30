import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Document viewer",
  summary: "A PDF drawn page by page with pdf.js, and the passages of a report lit where they sit — found from the PDF's own text positions, one box per line; the page and the quote when the text layer cannot place them.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#278", reason: "Needs a PDF module; Yomizaka has no phone app yet." }, desktop: "web" },
  whenToUse: [
    "To read a document beside what was said about it: findings, comments, extracted fields.",
    "To make a quoted passage visible in the original file instead of in a copy of its text.",
  ],
  whenNotToUse: [
    { when: "To play a video or a recording.", use: "video-player" },
    { when: "To show an image to crop." },
    { when: "To let the browser open the file as it is: a link to the file is enough.", use: "button" },
  ],
  bestPractices: [
    "Keep the list of passages in the page, next to the viewer: the viewer is not a keyboard route to each box, your list is (`activeId` / `onActiveChange`).",
    "Light a region instead of a quote when the app already knows where the evidence sits (`region: { page, x, y, width, height }`, fractions of the page): no text layer needed, and a region outside the page is never drawn.",
    "Pass the quote as the text layer reads it and, when you know it, the page: a quote the layout cut is still placed by its opening words, and a page alone still scrolls.",
    "Use `onLocate` to tell the person what was placed and what was not (« page 3 », « not found in the text layer ») — a passage is never drawn at a guessed place.",
    "Load pdf.js with `() => import(\"pdfjs-dist\")` and give it a same-origin worker (`workerSrc`): the engine only reaches pages that show a document.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, arrows, Page Up / Down", action: "The pages' region is focusable and scrolls like any scrollable area." }],
    notes: [
      "The region is named by `labels.region`; each page is announced by its caption (« Page 2 of 5 »).",
      "The highlight boxes are decorative (`aria-hidden`): the passages are reached through your list, whose entries scroll to them.",
      "A scanned PDF has no text layer: nothing is lit, and the pages stay readable as images — offer the text alternative yourself.",
      "A passage that cannot be placed is announced in a bar with its quote.",
    ],
  },
  related: ["tabs", "split-view", "video-player"],
  web: {
    imports: ["DocumentViewer", "locateQuote", "locateRegion"],
    examples: [
      { name: "highlights", title: "Findings in the file", description: "A one-page lease, two passages told by their quote and one by a region; pick one and the page scrolls to it and lights it." },
    ],
  },
} satisfies ComponentMeta;
