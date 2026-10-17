import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Nav bar",
  summary:
    "The Krizaka navigation bar, the same on every site of the family: a floating pill that tightens as the page scrolls, the family switcher on the brand, one light that glides to the item under the pointer or the focus and rests on the current page, accessible menus with rich links, and a mobile panel.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A site's top bar; an app on a phone navigates with its tab bar.", use: "tab-bar" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "The top navigation of a site or a product: a brand, a few links, one or two menus, actions on the right.",
    "A section bar inside an app (`floating={false}`): videos, earnings, auctions.",
    "Every site of the Krizaka family (www, ui., java., dev.<product>, admin.<product>): the brand and `NavBar.Family` on the left, at most four of the site's sections in the middle, the tools on the right.",
  ],
  whenNotToUse: [
    { when: "To switch views inside a page without changing the address.", use: "tabs" },
    { when: "For a list of actions on one object.", use: "dropdown-menu" },
    { when: "For search and commands across the app.", use: "command" },
    { when: "To link to another site of the family from the bar's middle: the family switcher holds them.", use: "sites" },
  ],
  bestPractices: [
    "Five items at most on the bar; group the rest in a menu, each link with a name and one line (`NavBar.MenuLink`).",
    "Mark the current page with `active`: the light rests on it, `aria-current=\"page\"` says it.",
    "Use your router's link with `asChild` on `NavBar.Link`, `NavBar.MenuLink` and `NavBar.MobileLink`.",
    "One primary action at most in `NavBar.Actions` (a `Button` `size=\"sm\"` `shape=\"pill\"`).",
    "Wrap it in a `sticky top-3` (floating) or `sticky top-0` container to keep it on screen.",
    "Three zones on every Krizaka site: who I am (`NavBar.Brand` + `NavBar.Family current=\"<site>\"`, then `NavBar.Badge` with the version or `DEV · v1.2.3`), this site (at most four sections, never a link to another site), tools (search when there is something to search, `NavBar.Repo`, theme, language, one primary action).",
    "Place a second `NavBar.Family` as the last child of `NavBar.Mobile`: below `md` the family is the panel's last group.",
    "Pass the family's words translated: `labels={familyLabels[locale]}` from `@krizaka/ui/sites`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves between the brand, the items and the actions; leaving an open menu closes it." },
      { keys: "Enter / Space / ↓", action: "Opens a menu and moves into it." },
      { keys: "↑ / ↓ · Home / End", action: "Walks the links of an open menu." },
      { keys: "← / →", action: "Moves between the items of the bar." },
      { keys: "Esc", action: "Closes the menu, the family or the mobile panel and returns the focus to its trigger." },
      { keys: "Enter / Space / ↓ (family)", action: "Opens the family from its chevron; ↑ / ↓ walk the sites. It never opens on hover." },
    ],
    notes: [
      "A `nav` named by `label`, a list of links and menu triggers (Radix NavigationMenu): `aria-expanded` and `aria-controls` on each trigger.",
      "The mobile panel is a disclosure (no focus trap): its toggle is named by `openLabel` / `closeLabel` and says `aria-expanded`.",
      "The light, the chevron and the tightening do not move under `prefers-reduced-motion`; the current page is tinted before scripts load.",
      "The family is its own `nav` named by `labels.family`; its chevron is a button with the same name, `aria-expanded` and `aria-controls`. Each group is a list named by its heading, the current site says `aria-current=\"true\"` and “You are here”, a site not released says its status in words.",
      "`NavBar.Repo` is an icon link named by `label`; `NavBar.Badge` is plain text (`DEV · v1.2.3`), hidden below `sm`.",
    ],
  },
  related: ["sites", "site-footer", "tabs", "dropdown-menu", "command", "button"],
  web: {
    imports: ["NavBar"],
    examples: [
      { name: "family-www", title: "www.krizaka.com", description: "The company's bar: the mark and the family switcher, Products · Open source · Our story, the repository and Contact. Open the chevron: every site of Krizaka, grouped, the current one marked." },
      { name: "family-ui", title: "ui.krizaka.com", description: "Krizaka UI: the family, the version of the packages, Get started · Foundations · Components · Templates, the repository." },
      { name: "family-java", title: "java.krizaka.com", description: "Krizaka Java: the family, the version of the building blocks, Get started · Building blocks · Guides." },
      { name: "family-product", title: "dev.<product>", description: "A product's site: its mark and the family, `DEV · v1.2.3`, How it works · Demo · Docs, and “Talk to us” on krizaka.com while sign-up is closed." },
      { name: "family-admin", title: "admin.<product>", description: "A console: the mark, the family and `DEV`, no sections, a full-width bar." },
      { name: "site", title: "A site's bar", description: "Brand, a Products menu, links, a call to action, a mobile panel — hover the items: one light glides between them." },
      { name: "menu-open", title: "A rich menu", description: "Two columns of links with icons whose node lights up, the current page tinted." },
      { name: "app-bar", title: "Inside an app", description: "`floating={false}`: a full-width bar with a hairline, for an app's sections." },
    ],
  },
} satisfies ComponentMeta;
