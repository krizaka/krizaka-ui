import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Language switch",
  summary:
    "The one language control of the family: a globe and the current code (FR) that opens a short list of the languages, each named in its own language (Français · English), as links with hreflang to the same page.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "An app on a phone follows the system language, with a choice in its settings.", use: "settings-layout" }, desktop: "web" },
  whenToUse: [
    "In the bar of every Krizaka site and in the header of an app, between the theme and the account: `NavBar.Language` places it.",
    "As a row (`variant=\"inline\"`) in the mobile panel's preferences or in a settings page.",
  ],
  whenNotToUse: [
    { when: "To switch a view of the same language (a tab, a unit): it is not a language.", use: "tabs" },
    { when: "A pill that names the other language (“English” on a French page): it says what you are not in.", use: "language-switch" },
  ],
  bestPractices: [
    "Name every language in its own language (`Français`, `English`), never “French” on a French page: `languagesFor(path)` does it.",
    "Show the language you are in (`FR`), not the one you could go to.",
    "Link to the same page in the other language: `languageHref(path, to)` swaps the locale segment and keeps the query and the hash.",
    "Pass your router's `<Link>` as `linkAs` so the navigation stays client-side; the `hreflang` and `lang` attributes are set for you.",
    "Pass `label` translated (“Langue”).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "Opens or closes the list of languages." },
      { keys: "↓", action: "Opens the list and moves to the current language." },
      { keys: "↑ / ↓ · Home / End", action: "Walks the languages." },
      { keys: "Enter", action: "Follows the link to the page in that language." },
      { keys: "Esc", action: "Closes the list and returns the focus to the trigger; Tab out and a press outside close it too." },
    ],
    notes: [
      "A disclosure, not a menu: the trigger says `aria-expanded` and `aria-controls`, and is named “Language: Français” (the `label` and the current language), not by its code alone.",
      "Each item is a link with `hreflang` and `lang`; the current one says `aria-current=\"true\"` and a check.",
      "`variant=\"inline\"` is a `group` named by `label` of plain links, current one marked by `aria-current`.",
    ],
  },
  related: ["nav-bar", "theme", "site-footer"],
  web: {
    imports: ["LanguageSwitch", "languagesFor"],
    examples: [
      { name: "menu", title: "In the bar", description: "A globe and FR; the menu lists Français and English, each in its own language." },
      { name: "inline", title: "In a panel", description: "The same languages as a row, for the mobile panel's preferences." },
    ],
  },
} satisfies ComponentMeta;
