import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Button",
  summary:
    "The @krizaka/ui button with the Orazaka 1.x default kept: without a `variant`, it is the primary (orange) button.",
  why: "Orazaka 1.x buttons were primary by default; the platform's default is `secondary`. This adapter keeps the 1.x default so the apps written against it look the same — everything else is the primitive's.",
  status: "stable",
  category: "actions",
  platforms: "web",
  builtOn: ["ui/button"],
  whenToUse: ["In code already importing `Button` from `@krizaka/orazaka-design-system`."],
  whenNotToUse: [
    { when: "In new code: import `Button` from `@krizaka/ui/button` and say the variant.", use: "ui/button" },
  ],
  bestPractices: [
    'One primary action per view: pass `variant="secondary"` or `"ghost"` to the others.',
    "Lock it while sending (`disabled` + `loading`): the input-blocking rule (ERR-126).",
  ],
  accessibility: {
    keyboard: [],
    notes: ["The primitive's: a native `<button>`, its focus ring, `loading` sets `aria-busy`."],
  },
  related: ["ui/button", "icon"],
  web: {
    imports: ["Button"],
    examples: [
      {
        name: "send",
        title: "Send a prompt",
        description: "The primary by default; locked while the answer is generated.",
      },
    ],
  },
} satisfies ComponentMeta;
