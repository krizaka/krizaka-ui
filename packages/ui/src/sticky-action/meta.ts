import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Sticky action",
  summary: "The one action of a page held at the bottom edge of a phone's screen while it scrolls — pure CSS, not drawn from `md` up.",
  status: "beta",
  category: "layout",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A native screen has its own bottom bar.", use: "fab" }, desktop: "web" },
  whenToUse: ["A public page with one thing to do (book, buy, contact) that must stay within thumb reach on a phone."],
  whenNotToUse: [
    { when: "An app's navigation on a phone.", use: "rail-nav" },
    { when: "Several equal actions.", use: "action-bar" },
  ],
  bestPractices: [
    "Put it as the last child of the page's `main`: a sticky element holds the edge inside its container.",
    "`hideWhileVisible=\"#hero-book\"` hides the bar while the page's own button is on screen (an IntersectionObserver): the bar keeps its place, so nothing shifts, and cannot be focused or pressed while hidden. Under reduced motion it only fades. Reserve its height with `scroll-padding-bottom` so a focused element is never covered.",
    "One `Button` with a verb (« Book »); hide the same button from the hero on a phone so it is not shown twice.",
    "It clears the home indicator through the safe-area inset.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["A plain container (a client component since `hideWhileVisible`): the action inside keeps its own role and name; while hidden the bar is `inert` and `aria-hidden`. In `phone` mode it is not rendered from `md` up (`display: none`); in `task` mode it stays, with the `summary` (the total) read before the action."],
  },
  related: ["cover-hero", "button", "action-bar"],
  web: {
    imports: ["StickyAction"],
    examples: [
      { name: "phone", title: "Phone", description: "A scrolling page with its one action stuck to the bottom edge." },
      { name: "hide-while-visible", title: "Hidden while the page's own action shows", description: "`hideWhileVisible=\"#hero-book\"`: the bar appears only once the hero's button has scrolled away." },
    ],
  },
} satisfies ComponentMeta;
