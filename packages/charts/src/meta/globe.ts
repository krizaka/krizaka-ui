import type { ComponentMeta } from "./types";

export const meta = {
  title: "Globe",
  summary: "The world as a lit 3D sphere — places, great-circle arcs, tinted regions — turning slowly while on screen, dragged by hand, in SVG without WebGL.",
  status: "beta",
  tier: "advanced",
  category: "charts",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A WebGL globe for a site's hero; a phone shows a map or a list.", use: "bar-chart" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  engine: "svg",
  whenToUse: [
    "Deployment regions and their replication links, on a product or status page.",
    "A global presence told at a glance, with a few places named.",
  ],
  whenNotToUse: [
    { when: "Values to compare by country (half the globe is hidden).", use: "geo-map" },
    { when: "More than a dozen places: the far side hides them.", use: "geo-map" },
  ],
  bestPractices: [
    "Name the places as a reader knows them (“Paris · eu-west-3”); give their status a tone.",
    "Keep `autoRotate` for a showcase; turn it off where the reader works.",
    "Use `regions` for where the service is available, not for values.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Walk the places: the globe turns to each one, which is announced." },
      { keys: "Home / End", action: "Jump to the first or the last place." },
      { keys: "Esc", action: "Clears the active place; the turn resumes." },
    ],
    notes: [
      "The turn runs only while the globe is on screen and the page visible, never under reduced motion, and stops on focus or drag.",
      "The summary and the table list every place with its value and coordinates.",
      "No WebGL: the sphere is SVG (an orthographic projection), sharp at any size and exportable.",
    ],
  },
  related: ["geo-map", "sankey"],
  web: {
    entry: "globe",
    imports: ["Globe3D"],
    examples: [{ name: "deployment-regions", title: "Deployment regions", description: "Orazaka's regions, their health as tones, the replication arcs between them." }],
  },
} satisfies ComponentMeta;
