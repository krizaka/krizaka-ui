import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Separator",
  summary: "A line between groups of content, horizontal or vertical, decorative by default.",
  status: "stable",
  category: "layout",
  platforms: "web",
  whenToUse: ["Between groups of a list or a menu.", "Between items of a toolbar or a row of links (`orientation=\"vertical\"`)."],
  whenNotToUse: [
    { when: "To separate every item of a list: use spacing." },
    { when: "To separate items of a menu.", use: "dropdown-menu" },
  ],
  bestPractices: ["Prefer space to lines; a separator marks a change of group.", "`decorative={false}` only when the separation means something to a screen-reader user."],
  accessibility: {
    keyboard: [],
    notes: ["Radix Separator: decorative by default (`role=\"none\"`); `decorative={false}` gives `role=\"separator\"` and its orientation."],
  },
  related: ["dropdown-menu", "card"],
  web: {
    imports: ["Separator"],
    examples: [
      { name: "horizontal", title: "Horizontal", description: "Between two groups." },
      { name: "vertical", title: "Vertical", description: "Between items of a row, as real separators." },
    ],
  },
} satisfies ComponentMeta;
