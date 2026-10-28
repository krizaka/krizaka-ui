import type { ComponentMeta } from "../meta";

export const meta = {
  title: "App frame",
  summary: "The one signed-in frame of a Krizaka web product: the rail (a bottom tab bar on a phone), the family's top bar and the account menu, composed from data — sections, account and the primary action. The frame owns what must not differ between products: the account menu's content and order, the preferences living in the menu, a place being on the rail or under the avatar, never both.",
  status: "beta",
  category: "layouts",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "On a phone the frame is a tab bar, a header and a screen: the native twin is the tabs shell template.", use: "tab-bar" }, desktop: "web" },
  whenToUse: [
    "Every signed-in screen of a product: Yomizaka, Akinaza, Orazaka — and each one's administration (`variant=\"admin\"`).",
    "When a fourth product needs the frame: write its sections, not another header.",
  ],
  whenNotToUse: [
    { when: "A console with grouped sections, counts and keyboard shortcuts in a collapsing sidebar of words.", use: "app-shell" },
    { when: "A public page of a site.", use: "nav-bar" },
    { when: "A desktop window (Tauri) with a title bar.", use: "app-shell" },
  ],
  bestPractices: [
    "Pass the sections the product has: `place: \"foot\"` puts one at the rail's foot; `gated` leaves one out for this person (a permission, a feature not open). Five main sections at most: a phone's tab bar carries five.",
    "The account menu is fixed: identity, Profile, Settings, Billing (only when you pass it), Administration (only for an admin), then Language and Theme, then Sign out. Settings is one entry that lands on the settings home, never a tab.",
    "A place is on the rail or under the avatar, never both: a section with the id of an account link (`settings`, `billing`) leaves the rail.",
    "The theme and the language are always in the menu, never in the header: a phone's header has no room. The theme is the `ThemeProvider`'s unless you pass `theme`.",
    "Say the shared words with the shared vocabulary (`navWords`, EN/FR): Docs, Terms / Conditions d'utilisation, Settings / Réglages. Override one (`words`) only when the product truly says it otherwise (« Credits and usage »).",
    "The public bar is the other half of the family: `publicBarLinks` gives its flat links, four at most — How it works · Pricing · Docs · Download.",
    "The page inside is `<main id=\"content\">`; the frame does not draw it.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the rail's items, the search, the primary action and the account menu." },
      { keys: "↑ ↓ (rail) · ← → (tab bar)", action: "Moves between the rail's items." },
      { keys: "Enter / Space / Arrow down", action: "Opens the account menu; Arrow right opens Language or Theme, Esc goes back." },
      { keys: "⌘K / Ctrl+K", action: "Opens the search (the host's command palette)." },
    ],
    notes: [
      "The rail is a `nav` named by `label`; the current section carries `aria-current=\"page\"`.",
      "Exactly one brand mark is visible at every width (the rail's on a desktop, the top bar's on a phone).",
      "A count on a section is said in words with `badgeLabel`.",
    ],
  },
  related: ["rail-nav", "app-header", "account-menu", "app-shell", "nav-bar"],
  web: {
    imports: ["AppFrame", "navWords", "publicBarLinks", "framePlaces"],
    examples: [
      { name: "app", title: "A product's signed-in app", description: "Yomizaka: four sections with a count, the search, the primary action « Check a document », and the account menu with Language and Theme.", template: true, purpose: "operate", why: "A person works in a few sections all day and finds their account, language and theme in the same place in every Krizaka product." },
      { name: "admin", title: "The administration", description: "`variant=\"admin\"` in French: the same frame, a chip that says where you are, and no way into the administration offered again.", template: true, purpose: "operate", why: "An administrator moves from the app to its administration without the frame changing under them." },
    ],
  },
} satisfies ComponentMeta;
