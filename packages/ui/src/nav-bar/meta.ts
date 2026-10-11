import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Nav bar",
  summary:
    "The Krizaka navigation bar: a floating pill that tightens as the page scrolls, one light that glides to the item under the pointer or the focus and rests on the current page, accessible menus with rich links, and a mobile panel.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  whenToUse: [
    "The top navigation of a site or a product: a brand, a few links, one or two menus, actions on the right.",
    "A section bar inside an app (`floating={false}`): videos, earnings, auctions.",
  ],
  whenNotToUse: [
    { when: "To switch views inside a page without changing the address.", use: "tabs" },
    { when: "For a list of actions on one object.", use: "dropdown-menu" },
    { when: "For search and commands across the app.", use: "command" },
  ],
  bestPractices: [
    "Five items at most on the bar; group the rest in a menu, each link with a name and one line (`NavBar.MenuLink`).",
    "Mark the current page with `active`: the light rests on it, `aria-current=\"page\"` says it.",
    "Use your router's link with `asChild` on `NavBar.Link`, `NavBar.MenuLink` and `NavBar.MobileLink`.",
    "One primary action at most in `NavBar.Actions` (a `Button` `size=\"sm\"` `shape=\"pill\"`).",
    "Wrap it in a `sticky top-3` (floating) or `sticky top-0` container to keep it on screen.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves between the brand, the items and the actions; leaving an open menu closes it." },
      { keys: "Enter / Space / ↓", action: "Opens a menu and moves into it." },
      { keys: "↑ / ↓ · Home / End", action: "Walks the links of an open menu." },
      { keys: "← / →", action: "Moves between the items of the bar." },
      { keys: "Esc", action: "Closes the menu or the mobile panel and returns the focus to its trigger." },
    ],
    notes: [
      "A `nav` named by `label`, a list of links and menu triggers (Radix NavigationMenu): `aria-expanded` and `aria-controls` on each trigger.",
      "The mobile panel is a disclosure (no focus trap): its toggle is named by `openLabel` / `closeLabel` and says `aria-expanded`.",
      "The light, the chevron and the tightening do not move under `prefers-reduced-motion`; the current page is tinted before scripts load.",
    ],
  },
  related: ["tabs", "dropdown-menu", "command", "button"],
  web: {
    imports: ["NavBar"],
    examples: [
      { name: "site", title: "A site's bar", description: "Brand, a Products menu, links, a call to action, a mobile panel — hover the items: one light glides between them." },
      { name: "menu-open", title: "A rich menu", description: "Two columns of links with icons whose node lights up, the current page tinted." },
      { name: "app-bar", title: "Inside an app", description: "`floating={false}`: a full-width bar with a hairline, for an app's sections." },
    ],
  },
} satisfies ComponentMeta;
