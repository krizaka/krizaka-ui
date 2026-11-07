import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Badge",
  summary: "The @krizaka/ui badge with the 1.x `variant` kept as a deprecated alias of `tone`.",
  why: "Orazaka 1.x badges took `variant` (`default`, `success`…); the platform says `tone`. This adapter maps one onto the other so the apps keep working while they migrate.",
  status: "stable",
  category: "data-display",
  platforms: "web",
  builtOn: ["ui/badge"],
  whenToUse: [
    "In code already importing `Badge` from `@krizaka/orazaka-design-system`: a model's state, a job's status.",
  ],
  whenNotToUse: [{ when: "In new code: import `Badge` from `@krizaka/ui/badge` and write `tone`.", use: "ui/badge" }],
  bestPractices: [
    "Write `tone`, not `variant` (deprecated since 2.0; `default` → `neutral`).",
    "One or two words: `Local`, `Running`, `Failed`.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The primitive's: a `<span>` read with its content; the colour is never the only signal."],
  },
  related: ["ui/badge"],
  web: {
    imports: ["Badge"],
    examples: [
      {
        name: "model-state",
        title: "A model's state",
        description: "Local, loading, failed — the tones of the primitive.",
      },
    ],
  },
} satisfies ComponentMeta;
