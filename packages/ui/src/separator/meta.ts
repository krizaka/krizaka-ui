import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Separator",
  summary: "A line between groups of content, horizontal or vertical, decorative by default.",
  status: "stable",
  category: "layout",
  domain: "foundations",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "A hairline between rows; Orazaka's settings group draws its own." }, desktop: "web" },
  whenToUse: ["Between groups of a list or a menu.", "Between items of a toolbar or a row of links (`orientation=\"vertical\"`)."],
  whenNotToUse: [
    { when: "To separate every item of a list: use spacing." },
    { when: "To separate items of a menu.", use: "dropdown-menu" },
  ],
  bestPractices: ["Prefer space to lines; a separator marks a change of group.", "`variant=\"hand\"` (the Cahier) between the body sections of a page, one shape per page; it is decorative and its height is fixed, so nothing shifts.", "`decorative={false}` only when the separation means something to a screen-reader user."],
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
      { name: "hand", title: "Drawn by hand", description: "`variant=\"hand\"`: `stroke`, `wave` or `dash`, 6 px tall, the hue at 60 % or the ink." },
    ],
  },
} satisfies ComponentMeta;
