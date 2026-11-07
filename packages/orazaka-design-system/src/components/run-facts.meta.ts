import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Run facts",
  summary: "What a run recorded, as a description list: label left, value right, in mono.",
  why: "Orazaka shows what proves a result — model, seed, frame, length, time, cost, run id — the same way everywhere. A long id breaks instead of overflowing, so the same list reads on a phone and in a wide card.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  builtOn: [],
  whenToUse: [
    "Under a generated result (a clip, an image) to say how it was made.",
    "In a run's detail, beside its steps.",
  ],
  whenNotToUse: [{ when: "Many rows to compare side by side." }],
  bestPractices: [
    "Say the real source (`Made by`, `Run by`), never a flattering one.",
    "Values are as the run recorded them: never rounded to look better.",
  ],
  accessibility: { keyboard: [], notes: ["A `dl`: a screen reader reads each label with its value."] },
  related: ["video-result", "clip-player"],
  web: {
    imports: ["RunFacts"],
    examples: [
      {
        name: "clip-run",
        title: "The run of a clip",
        description: "Model, seed, frame, length and the run id of Eric's tea-pour shot.",
      },
    ],
  },
} satisfies ComponentMeta;
