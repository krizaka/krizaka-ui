import type { ComponentMeta } from "../meta";

export const meta = {
  title: "App header",
  summary:
    "The family's top bar beside a `RailNav`: the product's name as text, optional status chips, then the session's controls in a fixed order — search (⌘K), language, the host's actions, messages and notifications with their unread counts, the primary action, the account with its name. Every slot is the host's; an empty one draws nothing.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "Beside a `RailNav`, as the bar of every signed-in screen of a Krizaka app (Orazaka, Yomizaka, Akinaza): the same bar in every product.",
    "With `search` (`AppHeaderSearch`) when the app has a palette (`CommandDialog`): ⌘K opens it from anywhere.",
    "With `messages` and `notifications` (`AppHeaderCount`) when the app has an inbox: the unread count is drawn and said.",
  ],
  whenNotToUse: [
    { when: "The bar of a site, with its menus and its call to action.", use: "nav-bar" },
    { when: "A screen's title and its actions inside an AppShell.", use: "app-shell" },
    { when: "A page's title block.", use: "page-header" },
    { when: "A native screen's title that folds as the list scrolls.", use: "header" },
  ],
  bestPractices: [
    "Pass the name as text and the mark as `mark`: never put a mark in the header that the rail already carries on a desktop (`mark` is hidden from `md` up for that reason).",
    "Fill the slots, never `actions` with everything: the order (search · language · actions · messages · notifications · primary · account) is the family's, so every product's bar reads the same.",
    "`AppHeaderSearch` comes from `@krizaka/ui/app-header/search` (a client entry: its ⌘K listener); the bar itself stays server-safe.",
    "Give each count its words with their plural (`countLabel=\"3 nouvelles\"`): the badge is decorative, the name says it.",
    "The language is `LanguageSwitch` (the same control as `NavBar.Language`); the account is `AccountMenu` with `showName` (the name from `sm`).",
    "Chips say a state, not a place: « Local · Sovereign », « Dev », a version.",
    "Make the name a link home with `homeLink` (your router's link) or `href`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "⌘ K / Ctrl K", action: "Opens the palette from anywhere on the page (`AppHeaderSearch`, `shortcut`)." },
      { keys: "Tab", action: "Walks the controls in their visual order: search, language, actions, messages, notifications, primary, account." },
      { keys: "Enter / Space", action: "Opens the palette, follows a count's link or opens the host's popover." },
    ],
    notes: [
      "A `header` landmark (`banner`); the name is plain text (the page's `h1` is the screen's, below).",
      "A count is in the control's name: « Notifications, 3 new »; the digits on the icon are hidden from screen readers. A page it leads to is `aria-current=\"page\"`.",
      "The search trigger is a button named by its words at every width (sr-only below `md`), with `aria-haspopup=\"dialog\"` and `aria-keyshortcuts`.",
      "Reduced motion: the controls' colour transitions stop; nothing else moves.",
      "At 360 px the name truncates and the controls keep their size: nothing is clipped.",
    ],
  },
  related: ["rail-nav", "app-shell", "nav-bar", "command", "language-switch", "account-menu", "badge", "page-header"],
  web: {
    imports: ["AppHeader", "AppHeaderCount"],
    examples: [
      { name: "basic", title: "Name, chip and actions", description: "Orazaka's bar: the name, a « Local · Sovereign » chip, and the account on the right; the mark joins the name below `md`." },
      { name: "family", title: "The family's bar", description: "Yomizaka's bar: search with ⌘K and its palette, the language, messages and notifications with their counts, the account with its name." },
    ],
  },
  native: {
    imports: ["AppHeader", "AppHeaderCount", "AppHeaderSearch"],
    differences: [
      "`onHome` instead of `href`/`homeLink`; no `chips` (a phone has no room).",
      "`AppHeaderSearch` is an icon (no ⌘K): it opens the app's search screen; `AppHeaderCount` takes `onPress`.",
      "The safe area's top inset is the provider's (`insets`).",
    ],
    examples: [{ name: "family", title: "The family's bar", description: "Search, language, notifications with their count and the account, at 360 pt." }],
  },
} satisfies ComponentMeta;
