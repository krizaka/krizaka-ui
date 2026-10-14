import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Skip link",
  summary: "The first tab stop of a page: a link that skips the navigation and lands on the content — hidden until it is focused.",
  status: "stable",
  category: "navigation",
  platforms: "web",
  whenToUse: [
    "At the top of every application shell that keeps its own navigation (`MarketingLayout` and `AppShell` already include it).",
    "On any page where several navigation stops come before the content.",
  ],
  whenNotToUse: [
    { when: "To jump inside a long page (a contents list).", use: "toc" },
    { when: "In a native app: screen readers have their own rotor and headings.", use: "tab-bar" },
  ],
  bestPractices: [
    "Make it the very first focusable element, before the header.",
    "Pass the label already translated (“Skip to content”), and point `href` at the element that holds the content (`<main id=\"content\">`).",
    "One per page. It is a link, so it stays in the page's history; the target takes focus.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "The first stop: the link appears as a pill above everything, in the brand ring." },
      { keys: "Enter", action: "Moves focus to the target, which becomes focusable (`tabindex=\"-1\"`) when it is not." },
    ],
    notes: [
      "WCAG 2.4.1 Bypass Blocks. A visually hidden link is still read by screen readers as a link to the content.",
      "Focus really moves, even when a router intercepts hash links.",
    ],
  },
  related: ["app-shell", "marketing-layout", "toc"],
  web: {
    imports: ["SkipLink"],
    examples: [{ name: "default", title: "Default", description: "Press Tab: the link appears; Enter lands on the content." }],
  },
} satisfies ComponentMeta;
