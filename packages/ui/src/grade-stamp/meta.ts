import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Grade stamp",
  summary: "A teacher's red-ink grade, « 18/20 », with a short remark — only from a real measurement passed in by the host, its source in a tooltip.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#421", reason: "It comes with the native paper roles of the Cahier." },
    desktop: "web",
  },
  whenToUse: [
    "To say how a project does on a measured quality: test coverage, a Lighthouse score, a bundle against its budget.",
    "On a tool site's home or in a release note, where a teacher's grade is the Krizaka way to show the state.",
  ],
  whenNotToUse: [
    { when: "A number with its trend, no remark.", use: "stat" },
    { when: "A status such as stable or in progress.", use: "specimen-tag" },
  ],
  bestPractices: [
    "Never write a grade by hand: compute it from the measure (`coverage / 100 * 20`) and pass the source (`Vitest coverage, 2026-10-23`).",
    "Write the remark like a teacher, short and warm: « Très bien, continue ».",
    "A value outside 0 to `outOf`, or no source, renders nothing: a missing grade is better than a made-up one.",
    "One stamp per measure, a few per page: a wall of red reads as noise.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab", action: "Focuses the stamp, which opens the tooltip with its source." }],
    notes: [
      "The score and the remark are real text; the source is also in visually hidden text, so a screen reader reads it without the tooltip.",
      "The tilt is a transform: nothing moves under `prefers-reduced-motion` because nothing animates.",
      "The ink is the margin's red, chosen for 4.5:1 on the paper in dark and light.",
    ],
  },
  related: ["stat", "specimen-tag", "tooltip", "versus-card"],
  web: {
    imports: ["GradeStamp"],
    examples: [
      { name: "coverage", title: "Test coverage", description: "A coverage measure turned into a grade out of 20, with its source." },
      { name: "lighthouse", title: "Lighthouse", description: "Four Lighthouse scores, each stamped with its own source." },
    ],
  },
} satisfies ComponentMeta;
