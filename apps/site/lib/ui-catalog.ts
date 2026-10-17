/* The catalogue of /docs/ui as data: one entry per component, with where it sits, what it is, why it is there and what
   its card shows. Built on the server from the registry (the code of the package), lib/ui-ia.ts and lib/ui-inventory.ts. */

import { readFileSync } from "node:fs";
import path from "node:path";

import { filterKeyOf } from "@/lib/ui-ia";
import { inventoryOf, type InventoryState, type Product } from "@/lib/ui-inventory";
import { exampleKey, getRegistryItems, type Platform, type RegistryItem, type Status } from "@/lib/ui-registry";
import { componentPath } from "@/lib/urls";

/** What a card shows above its title: the live example (loaded on view), a screenshot of a mobile one, or nothing yet. */
export type CatalogPreview =
  | { kind: "live"; key: string; heavy: boolean }
  | { kind: "shot"; dark: string; light: string; width: number; height: number; alt: string }
  | null;

export interface CatalogEntry {
  name: string;
  title: string;
  summary: string;
  platforms: Platform;
  status: Status;
  /** The filter value of its group: a job, a pattern or `templates` (lib/ui-ia.ts FILTER_KEYS). */
  group: string;
  /** Who imports it today. */
  usedBy: Product[];
  /** Used, planned or leaving — and the one line that says why. */
  state: InventoryState | null;
  why: string;
  href: string;
  preview: CatalogPreview;
}

/** Categories whose examples are whole pages, maps, charts or media: they load once the page has settled. */
const HEAVY_CATEGORIES = new Set(["charts", "media", "templates", "layouts"]);
const HEAVY_NAMES = new Set(["map", "video-player", "audio-player", "terminal-replay", "scroll-stage", "iso", "landscape"]);

/** A PNG's size from its header, so a screenshot reserves its space. */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

function previewOf(item: RegistryItem, alt: string): CatalogPreview {
  const web = item.web?.examples[0];
  if (web) return { kind: "live", key: exampleKey(web), heavy: HEAVY_CATEGORIES.has(item.category) || HEAVY_NAMES.has(item.name) };
  const shot = item.native?.examples.find((example) => example.screenshots);
  if (!shot?.screenshots) return null;
  const file = (theme: "dark" | "light") => shot.screenshots![theme].replace(/^examples\//, "");
  try {
    return { kind: "shot", dark: `/ui-examples/${file("dark")}`, light: `/ui-examples/${file("light")}`, ...pngSize(path.join(process.cwd(), "public", "ui-examples", file("dark"))), alt };
  } catch {
    return null;
  }
}

export function catalogEntries(locale: string, previewAlt: (name: string) => string): CatalogEntry[] {
  return getRegistryItems().map((item) => {
    const inventory = inventoryOf(item.name, item.status, item.deprecated);
    return {
      name: item.name,
      title: item.title,
      summary: item.summary,
      platforms: item.platforms,
      status: item.status,
      group: filterKeyOf(item),
      usedBy: inventory?.usedBy ?? [],
      state: inventory?.state ?? null,
      why: inventory?.why ?? "",
      href: `${componentPath(locale, item.name)}`,
      preview: previewOf(item, previewAlt(item.title)),
    };
  });
}

/** A family of the catalogue (a job, a pattern or the templates): its cover — a live example of one of its components —
    and its counts, read from the registry. */
export interface CatalogFamily {
  key: string;
  components: number;
  examples: number;
  mobile: number;
  cover: { key: string; heavy: boolean; scale: number } | null;
}

/** The component whose example stands for its family on the family's card (its first web example unless named). */
export const FAMILY_COVERS: Record<string, { component: string; example?: string; scale?: number }> = {
  actions: { component: "button", example: "sizes", scale: 0.65 },
  inputs: { component: "date-picker", example: "calendar" },
  navigation: { component: "nav-bar", example: "site" },
  overlays: { component: "command", example: "inline" },
  feedback: { component: "alert", example: "warning", scale: 0.7 },
  data: { component: "stat", example: "grid" },
  media: { component: "media-grid", example: "uniform" },
  maps: { component: "map", example: "places" },
  charts: { component: "line-chart", example: "creator-earnings", scale: 0.55 },
  brand: { component: "mascots", example: "flock" },
  utilities: { component: "kbd", example: "shortcut", scale: 1 },
  blocks: { component: "cta-panel", example: "discuss" },
  layouts: { component: "app-shell", example: "console" },
};

export function catalogFamilies(entries: CatalogEntry[], keys: readonly string[]): CatalogFamily[] {
  const items = new Map(getRegistryItems().map((item) => [item.name, item]));
  return keys.flatMap((key) => {
    const members = entries.filter((entry) => entry.group === key);
    if (members.length === 0) return [];
    const examples = members.reduce((n, entry) => n + (items.get(entry.name)?.web?.examples.length ?? 0) + (items.get(entry.name)?.native?.examples.length ?? 0), 0);
    const wanted = FAMILY_COVERS[key];
    const item = wanted && items.has(wanted.component) ? items.get(wanted.component)! : items.get(members.find((m) => m.preview?.kind === "live")?.name ?? "");
    const example = item?.web?.examples.find((e) => e.name === wanted?.example) ?? item?.web?.examples[0];
    // A cover that names a component or an example the registry no longer has fails the build: never a blank card.
    if (wanted && (!items.has(wanted.component) || (wanted.example && example?.name !== wanted.example)))
      throw new Error(`catalogue: the cover of "${key}" (${wanted.component}/${wanted.example ?? "first"}) is not in the registry`);
    return [{
      key,
      components: members.length,
      examples,
      mobile: members.filter((entry) => entry.platforms !== "web").length,
      cover: example && item ? { key: exampleKey(example), heavy: HEAVY_CATEGORIES.has(item.category) || HEAVY_NAMES.has(item.name), scale: wanted?.scale ?? 0.5 } : null,
    }];
  });
}
