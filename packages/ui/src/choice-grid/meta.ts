import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Choice grid",
  summary:
    "A line-up of choices as tiles — a visual, a name, a line: a radio group with roving focus when selectable, a named showcase otherwise; sober by default, a select screen in the arcade flavour.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding.", use: "radio-group" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Choosing one of a few options that are best recognised by a picture: a plan, a persona, a team, an avatar, a side.",
    "Presenting a line-up at the top of a told page (products, characters, members), without selection.",
  ],
  whenNotToUse: [
    { when: "More than eight options, or options without a visual.", use: "radio-group" },
    { when: "Switching between views of the same content.", use: "tabs" },
    { when: "Picking several interests or tags.", use: "chip" },
  ],
  bestPractices: [
    "Two to four tiles per row: the name short, the line under it saying what the choice gives.",
    "Pass `label`: the group's accessible name, also when the tag and caption say it visually.",
    "Keep the arcade flavour for a told page; in a product flow, the default tiles.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves into the group, onto the chosen tile, then out of it." },
      { keys: "Arrow keys", action: "Move to the next or previous tile and choose it." },
      { keys: "Home / End", action: "Move to the first or last tile and choose it." },
      { keys: "Space / Enter", action: "Chooses the focused tile." },
    ],
    notes: [
      "Selectable: `role=\"radiogroup\"` named by `label`, each tile a `radio` with `aria-checked`; the chosen one is also marked by a ring and a check, not by colour alone.",
      "Not selectable: a list named by `label`, one item per tile.",
      "The visuals are decorative: the name carries the meaning. The arrival and the corner locks stop under `prefers-reduced-motion`.",
    ],
  },
  related: ["radio-group", "profile-card", "scroll-stage"],
  web: {
    imports: ["ChoiceGrid"],
    examples: [
      { name: "plans", title: "Choose a plan", description: "Selectable: three plans as tiles, the arrow keys move and choose." },
      { name: "line-up", title: "A line-up (arcade)", description: "The select screen: each tile in its brand, the corners locking on each one in turn." },
    ],
  },
} satisfies ComponentMeta;
