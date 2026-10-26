import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Rail nav",
  summary: "The compact navigation of an application: a vertical rail of icons on a desktop — the product's mark on top, a tooltip on each icon, an accent bar on the current one, a footer for settings and the account — that becomes a bottom tab bar on a phone. Paired with `AppHeader`, which carries the product's name (and, on a phone, its mark).",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "On a phone the rail is already a bottom tab bar; a native app uses the TabBar.", use: "tab-bar" }, desktop: "web" },
  whenToUse: [
    "An application with three to eight destinations the user works in all day (Home, Studios, Chat, Jobs, Settings) and little else in the way: the rail leaves the screen to the work.",
    "When the same sections must read as a vertical rail on a desktop and as tabs on a phone, written once.",
  ],
  whenNotToUse: [
    { when: "Grouped sections, counts and a collapsing sidebar of words, a console with shortcuts.", use: "app-shell" },
    { when: "A public site's pages.", use: "nav-bar" },
    { when: "A native mobile app.", use: "tab-bar" },
    { when: "Views of one screen.", use: "tabs" },
  ],
  bestPractices: [
    "Five main items at most: on a phone they are the tabs (the footer's items follow them in the same bar, so keep both short).",
    "Give every item an icon and a word: the icon is all a desktop shows, the word is the tooltip, the tab's caption and the accessible name.",
    "Put the product's mark in `mark` and its name in `AppHeader`: the mark is shown once, in the rail on a desktop and in the header on a phone. Never draw it in both.",
    "Render your router's links with `RailNav.Item asChild`; set `current` from the route.",
    "Scope the product's colours with `accent` (`orazaka`, `yomizaka`…) or let the page's brand class do it.",
    "`expandable` is for apps whose users know the icons less well: it widens the rail to show the words. Uncontrolled and without `defaultExpanded`, it is expanded from 1280 px (the words fit there) until the person toggles it.",
    "`shortcuts` (with `shortcutsLabel`, « Raccourcis ») holds the product's quick ways in — a saved view, a frequent client, « New invoice » — above the footer; two to four, never a second navigation. Desktop only: a phone's tab bar keeps its destinations.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the items, the footer's controls and the expand button." },
      { keys: "↑ ↓ (rail) · ← → (tab bar)", action: "Moves the focus to the previous or next item, wrapping at the ends; both pairs always work." },
      { keys: "Home / End", action: "Focuses the first or the last item." },
      { keys: "Esc", action: "Dismisses a tooltip that is showing." },
    ],
    notes: [
      "A `nav` named by `label`; the current item carries `aria-current=\"page\"`.",
      "The shortcuts are a `group` named by `shortcutsLabel` (its heading, visible once the rail is expanded); the arrows walk through them like the other items.",
      "Each item is named by its `label` (and `badgeLabel`): the tooltip and the caption repeat it, they never replace it.",
      "The focus ring is the Krizaka signature (`focus-ring-inset`), kept inside the rail's edge so it is never clipped.",
      "A tab is at least 56 px tall, clear of the home indicator (`env(safe-area-inset-bottom)`); the motion of the width respects `prefers-reduced-motion`.",
      "Exactly one brand mark is visible at every width: the rail's `mark` below `md` is hidden and `AppHeader`'s `mark` is shown there, and the reverse above.",
    ],
  },
  related: ["app-header", "app-shell", "nav-bar", "tooltip", "tab-bar"],
  web: {
    imports: ["RailNav"],
    examples: [
      { name: "studio", title: "A studio", description: "Orazaka's signed-in app: the mark on top of the rail, five sections with the current one lit, settings at the foot, the header with the name and a status chip.", template: true, purpose: "operate", why: "A person works in a few sections all day: the rail keeps them one icon away and leaves the screen to the work; on a phone the same sections are the tabs." },
      { name: "shortcuts", title: "Shortcuts and the family's bar", description: "Akinaza's frame: the rail with a « Shortcuts » group above the expand toggle, expanded from 1280 px, and the family's top bar — search, notifications with a count, the account with its name from 1024 px." },
      { name: "expandable", title: "Expandable", description: "The same rail with a button that widens it to show the words, for users who do not know the icons yet." },
    ],
  },
} satisfies ComponentMeta;
