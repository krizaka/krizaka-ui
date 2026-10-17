import type { ComponentMeta } from "./types";

export const meta = {
  title: "Geo map",
  summary: "Where: a world choropleth in one sequential hue, bubbles on places, country names in the reader's language — plain SVG, the world loaded on demand.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A choropleth over the world; a phone shows the MapLibre map of @krizaka/ui/native/map or a ranked list.", use: "bar-chart" }, desktop: "web" },
  engine: "svg",
  whenToUse: [
    "An audience by country: a creator's viewers, a service's users.",
    "Places with an amount: cities, data centres, as bubbles.",
  ],
  whenNotToUse: [
    { when: "Deployment regions and the links between them, as a showpiece.", use: "globe" },
    { when: "A precise comparison between a few countries.", use: "bar-chart" },
  ],
  bestPractices: [
    "Key the regions by ISO 3166-1 alpha-2 (`FR`, `US`): the names come from `Intl.DisplayNames` in the reader's locale.",
    "Map rates (per viewer, per capita) rather than raw counts when the countries' sizes differ widely.",
    "Pair it with a ranked table or bars when the exact order matters.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Walk the regions that have data, largest first, then the places." },
      { keys: "Home / End", action: "Jump to the largest or the last item." },
      { keys: "Esc", action: "Clears the active region." },
    ],
    notes: [
      "The summary names the five largest regions with their shares; the table lists every region and place.",
      "The Equal Earth projection keeps areas true: no country looks larger than it is.",
      "The world's countries (~38 kB) are loaded only when a map is drawn; a skeleton holds the height meanwhile.",
    ],
  },
  related: ["globe", "bar-chart", "heatmap"],
  web: {
    entry: "geo",
    imports: ["GeoMap"],
    examples: [{ name: "viewers", title: "Viewers by country", description: "A creator's viewers by country, the top cities as bubbles." }],
  },
} satisfies ComponentMeta;
