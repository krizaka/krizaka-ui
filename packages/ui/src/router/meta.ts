import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Route state",
  summary: "The URL is the state: `useRouteState` keeps a selection (a tab, a type, a filter) in a search parameter, and Tabs, Chip.Group and ChoiceGrid bind to it with `routeKey`.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A native app routes with its navigator's params, not with a web address." }, desktop: "web" },
  whenToUse: [
    "For any choice the user would want to share, reload or come back to with the back button: a tab, a document type, a filter, a view.",
    "Pass `routeKey` to Tabs, Chip.Group (single) or ChoiceGrid: they read and write the parameter, no `useState`.",
  ],
  whenNotToUse: [
    { when: "For a state that must not outlive the screen: a hover card's tab, an open popover — keep it local and say why (`// @ephemeral: <reason>`)." },
    { when: "To move between pages that have their own path.", use: "tabs" },
  ],
  bestPractices: [
    "Type the values with an `as const` list: `const TYPES = [\"auto\", \"lease\"] as const`; an unknown value in the address reads as the default.",
    "The default is never written to the address, so the clean URL is the default view.",
    "`history: \"replace\"` for a filter toggled in passing; the default `push` for a section the user will go back from.",
    "In Next.js give your router once: `<RouteStateProvider adapter={…}>` in the root layout (search, navigate, subscribe).",
    "The lint rule `krizaka/route-state-selection` (`@krizaka/config`) refuses a page selection driven by local state.",
  ],
  accessibility: { keyboard: [], notes: ["No effect of its own: the bound component keeps its roles and keys; the address is announced by the browser on a push."] },
  related: ["tabs", "chip", "choice-grid"],
  web: {
    imports: ["useRouteState", "RouteStateProvider", "readRouteValue", "writeRouteValue"],
    examples: [{ name: "use-route-state", title: "A choice in the URL", description: "`useRouteState(\"type\", { values, default })` typed from a const list, and a Chip.Group bound with `routeKey`." }],
  },
} satisfies ComponentMeta;
