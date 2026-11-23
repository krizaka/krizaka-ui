import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Clause demo",
  summary: "The lines of a document the visitor hovers, taps or reaches with the keyboard, and beside them what the check said of each: its verdict, the words it quotes and the reference it cites.",
  status: "beta",
  category: "blocks",
  domain: "page-blocks",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A public web page's demo; in a phone app the real report is the product's own screen, a list of findings with their detail." },
    desktop: { status: "n/a", reason: "A public site's block, not a window of the Mac app." },
  },
  whenToUse: ["A product page lets the visitor try the proof: touch a line, read the verdict.", "The data of a recorded run is at hand, not a video of it."],
  whenNotToUse: [{ when: "For a whole report.", use: "analysis-report" }],
  bestPractices: [
    "Lines and findings come from a recorded run, never typed for the page; the verdict's words are the product's (`To check`).",
    "It opens on the first `danger` line: the visitor sees the point at once.",
    "Three to six lines; the lines without a finding stay quiet text, not controls.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Moves to the next line with a finding and shows its answer." }],
    notes: [
      "Each line with a finding is a real `button` (`aria-pressed`, `aria-controls` the answer); hover, tap and focus open it.",
      "The answer is a polite live region: the verdict is read when it changes.",
    ],
  },
  related: ["product-page", "story-scroll"],
  web: {
    imports: ["ClauseDemo"],
    examples: [{ name: "lease", title: "A fictional lease", description: "Three lines, two with a finding; it opens on the line to check." }],
  },
} satisfies ComponentMeta;
