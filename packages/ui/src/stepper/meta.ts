import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Stepper",
  summary:
    "The steps of a journey or a job: done steps checked, the current one traced by the Krizaka glyph (growing to its value), failures crossed, connectors that fill — and every state said in words.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  whenToUse: [
    "A job the user follows in steps: an upload that is checked, transcoded and published; a payout; an import.",
    "A short journey with a known order: a checkout, an onboarding (`orientation=\"horizontal\"`).",
    "A history of what happened, in order (a timeline of a request).",
  ],
  whenNotToUse: [
    { when: "For one task with a known size and no steps.", use: "progress" },
    { when: "To switch between views the user can visit in any order.", use: "tabs" },
  ],
  bestPractices: [
    "Name steps by what happens (“Transcoding”), with a line of detail (a size, a time).",
    "Put what the user can do or watch into the current or failed step's `content`: a Progress with its ETA, a retry.",
    "A failure says what went wrong and what to do next, in the step itself.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "An ordered list (name it with `aria-label`); the current step has `aria-current=\"step\"`.",
      "Each step's state is read with its title (`labels`, translated): never colour alone.",
      "Under `prefers-reduced-motion` the current glyph rests on a still frame and the connectors do not animate.",
    ],
  },
  related: ["progress", "loader", "tabs"],
  web: {
    imports: ["Stepper"],
    examples: [
      { name: "job", title: "A job in steps", description: "Uploaded, checked, transcoding (traced, with its Progress and ETA), then published." },
      { name: "failed", title: "A failed step", description: "A cross, the danger colour, “Failed” in words — and the action that fixes it." },
      { name: "checkout", title: "A short journey", description: "`orientation=\"horizontal\"`: the connectors fill as it advances." },
    ],
  },
} satisfies ComponentMeta;
