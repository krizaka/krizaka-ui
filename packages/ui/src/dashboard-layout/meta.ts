import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Dashboard layout",
  summary: "A dashboard: the screen's heading with its actions and filters, then a responsive grid of widgets — one column on a phone, two from sm, four from xl — each a titled region that spans one to four columns.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A phone dashboard is one scrolling screen of cards.", use: "screen" }, desktop: "web" },
  whenToUse: ["The home of a signed-in product: figures, what is running, what needs attention.", "A console's overview above its tables."],
  whenNotToUse: [
    { when: "For one object's page.", use: "detail-layout" },
    { when: "For a list to work through.", use: "split-view" },
  ],
  bestPractices: ["The most important figures first: on a phone they are read first.", "One sentence under the title that says what changed (`Three sales since yesterday`).", "Charts from @krizaka/charts and tables in `span={2}` or `full` widgets; a single figure in a one-column widget."],
  accessibility: {
    keyboard: [],
    notes: ["Each widget is a `section` named by its title.", "The heading is the screen's `h1`, or an `h2` inside an AppShell (`headingAs`).", "The quick actions are a `nav` named by `quickActionsLabel`, a list of links; the side column is an `aside`, after the widgets in reading order."],
  },
  related: ["app-shell", "stat", "data-table"],
  web: {
    imports: ["DashboardLayout", "Widget", "type QuickAction"],
    examples: [
      { name: "orazaka-eric", title: "Orazaka · Eric's console", description: "An accountant's on-premise console: requests, latency, credits, running jobs and packs, the period in a chip group.", template: true, purpose: "operate", why: "An operator reads the key figures at a glance and acts on what runs, for the period they chose." },
      { name: "today", title: "A shop's morning", description: "The date on the right of the heading, a lead sentence whose figures are links, four quick-access tiles, the widgets and a side column (#653).", template: true, purpose: "operate", why: "A small business owner sees today, the two things that wait and the four things they do most, without searching." },
      { name: "widgets", title: "The grid", description: "Four widgets of different spans." },
    ],
  },
} satisfies ComponentMeta;
