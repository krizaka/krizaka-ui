import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tabs",
  summary: "Views of the same page, one at a time: underlined sections, a segmented switch, pills or binder dividers that organise collections — one light glides from the active tab to the next.",
  status: "beta",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To split a page into sections the user switches between without leaving it: videos, stories, about.",
    "`variant=\"segmented\"` for a view switch (grid, list); `pills` for a feed's sections.",
    "`variant=\"binder\"` to organise a workspace's collections, tags or statuses as binder dividers (intercalaires): a coloured edge (`hue`), the words and a count; best as routes (`Tabs.Nav`), so the address is the state.",
  ],
  whenNotToUse: [
    { when: "For a filter that narrows a list.", use: "chip" },
    { when: "To go to other pages from a tablist: use `Tabs.Nav` (links), not `Tabs.Trigger`." },
    { when: "For a choice in a form.", use: "radio-group" },
  ],
  bestPractices: [
    "Short labels of one or two words; the active one should be clear without colour.",
    "Binder: the colour organises, it never says on its own — the words and the count do. `hue` takes a role of the theme (accent · success · warning · danger · neutral), each 3:1 or more on both themes; give a status divider its status' role. No paper texture: it is the products' register.",
    "Binder: « + » (`add`) sits after the dividers, outside the tab list, for creating a collection.",
    "Keep the URL in sync with the active tab when a tab is worth sharing: better, use `Tabs.Nav` (tabs as routes), where the route is the state and the active tab is read from it.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves to the active tab, then into its panel." },
      { keys: "Arrow keys / Home / End", action: "Move between tabs and activate them." },
    ],
    notes: [
      "Radix Tabs: `tablist`, `tab` with `aria-selected` and `aria-controls`, `tabpanel`; name the list with `aria-label`.",
      "A disabled tab is skipped.",
      "A count is part of the tab's name (« Regulars 21 »); a binder divider's colour is decoration (the words say it).",
      "The binder's « + » is a button after the list (a tablist holds only tabs), reached by Tab after the tabs.",
    ],
  },
  related: ["chip", "segmented", "radio-group"],
  web: {
    imports: ["Tabs"],
    examples: [
      { name: "underline", title: "Underline", description: "The sections of a page; a disabled tab is skipped." },
      { name: "segmented", title: "Segmented", description: "A view switch: equal segments in a track." },
      { name: "pills", title: "Pills", description: "A feed's sections, scrolling sideways on a phone." },
      { name: "vertical", title: "Vertical", description: "`orientation=\"vertical\"`: the list on the side." },
      { name: "binder", title: "Binder dividers", description: "`variant=\"binder\"` as routes: a client's collections as dividers with their colour and count, « + Divider » after them; they scroll sideways with fading edges when they do not fit." },
      { name: "routes", title: "Tabs as routes", description: "`Tabs.Nav` + `Tabs.NavLink`: each tab is a link, the active one comes from the current route (`aria-current=\"page\"`), the URL is the state." },
    ],
  },
  native: {
    imports: ["Tabs"],
    differences: [
      "`items` (value, label, count, content) instead of the web's parts.",
      "The underlined tab list scrolls sideways when it does not fit; for the app's main sections use `TabBar`.",
      "`hue` is on each item; `add` is a prop of `Tabs` (no routes on a phone: the selection is the screen's state).",
    ],
    examples: [
      { name: "sections", title: "Sections", description: "A creator's page: underlined tabs with counts." },
      { name: "segmented", title: "Segmented", description: "Two views of the same content." },
      { name: "binder", title: "Binder dividers", description: "`variant=\"binder\"`: collections as dividers with a coloured edge and a count, « + Divider » after them." },
    ],
  },
} satisfies ComponentMeta;
