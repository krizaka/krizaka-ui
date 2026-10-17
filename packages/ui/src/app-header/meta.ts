import type { ComponentMeta } from "../meta";

export const meta = {
  title: "App header",
  summary: "The top bar that sits next to a `RailNav`: the product's name as text, optional status chips, and the actions. The mark is the rail's; on a phone, where the rail is a bottom tab bar, the header shows it too, so one mark is visible at every width.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A native screen has its own header.", use: "header" }, desktop: "web" },
  whenToUse: [
    "Beside a `RailNav`, as the bar of every signed-in screen: name, status, theme, notifications, account.",
  ],
  whenNotToUse: [
    { when: "The bar of a site, with its menus and its call to action.", use: "nav-bar" },
    { when: "A screen's title and its actions inside an AppShell.", use: "app-shell" },
    { when: "A page's title block.", use: "page-header" },
  ],
  bestPractices: [
    "Pass the name as text and the mark as `mark`: never put a mark in the header that the rail already carries on a desktop (`mark` is hidden from `md` up for that reason).",
    "Chips say a state, not a place: « Local · Sovereign », « Dev », a version.",
    "Keep the actions to what changes the session (theme, notifications, account menu): the sections are in the rail.",
    "Make the name a link home with `homeLink` (your router's link) or `href`.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "A `header` landmark; the name is plain text (the page's `h1` is the screen's, below).",
      "The mark is decorative beside the name: give the home link its name through the visible text.",
    ],
  },
  related: ["rail-nav", "app-shell", "nav-bar", "badge", "page-header"],
  web: {
    imports: ["AppHeader"],
    examples: [
      { name: "basic", title: "Name, chip and actions", description: "Orazaka's bar: the name, a « Local · Sovereign » chip, and the theme and account on the right; the mark joins the name below `md`." },
    ],
  },
} satisfies ComponentMeta;
