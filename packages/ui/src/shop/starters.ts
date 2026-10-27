// The starter documents (ADR-007 §4, §8): the five compositions of the ADR as data — a section list and a preset. A
// product's template becomes one of these; the composer's « Start from » lists them. They hold no price, no text of a
// shop and no photo: references and rules only.
import type { SectionOf, ShopPage } from "./schema";

const s = (key: string) => key;
const doc = (preset: string, density: "compact" | "airy", sections: ShopPage["sections"]): ShopPage => ({
  schema: 1,
  preset: { id: preset, version: 1 },
  density,
  sections,
});
const hero = (variant: "poster" | "split" | "banner" | "tv"): SectionOf<"hero"> => ({
  key: s("s_hero"),
  type: "hero",
  variant,
  settings: { focus: "center" },
  blocks: [
    { key: "b_open", type: "fact", settings: { kind: "open-now" } },
    { key: "b_area", type: "fact", settings: { kind: "area" } },
    { key: "b_score", type: "fact", settings: { kind: "score" } },
  ],
});
const menu = (columns: 1 | 2, aside: "hours" | "none"): SectionOf<"services"> => ({
  key: s("s_services"),
  type: "services",
  variant: "menu",
  settings: { source: "all", groupBy: "category", columns, aside },
});
const booking = (variant: "strip" | "panel" | "sticky", key: string): SectionOf<"booking"> => ({ key, type: "booking", variant, settings: { count: 4 } });
const gallery = (variant: "mosaic" | "filmstrip" | "wall" | "grid", key: string, extra: Partial<Pick<SectionOf<"gallery">, "settings" | "blocks">> = {}): SectionOf<"gallery"> => ({
  key,
  type: "gallery",
  variant,
  settings: { source: "all", texture: "plaster" },
  ...extra,
});

/** The salon, compact: the poster, the next free times, the price board beside the hours, a filmstrip, the reviews. */
export const salonCompact = doc("salon-vitrine", "compact", [
  hero("poster"),
  booking("strip", "s_times"),
  menu(1, "hours"),
  gallery("filmstrip", "s_photos"),
  { key: "s_reviews", type: "reviews", variant: "summary-cards", settings: { rule: "best", count: 2 } },
  booking("panel", "s_book"),
]);

/** The salon, editorial: a split hero, the quote, the two-column menu, the mosaic, the visit. */
export const salonEditorial = doc("salon-atelier", "airy", [
  hero("split"),
  { key: "s_story", type: "story", variant: "quote", settings: { body: {} } },
  menu(2, "none"),
  gallery("mosaic", "s_photos"),
  { key: "s_visit", type: "visit", variant: "split", settings: { showPhone: true } },
  booking("panel", "s_book"),
]);

/** The salon, gallery first: the sign and the old TV, the mosaic, the menu, the wall. */
export const salonGallery = doc("salon-atelier", "compact", [
  hero("tv"),
  gallery("mosaic", "s_photos"),
  menu(1, "hours"),
  gallery("wall", "s_wall", { blocks: [{ key: "b_note", type: "note", settings: { text: "Merci Jade !", signature: "Nadia" } }] }),
  booking("sticky", "s_sticky"),
]);

/** The dog walker, route: the poster, the areas, the menu, the next free times, a filmstrip. */
export const petsRoute = doc("pets-canal", "compact", [
  hero("poster"),
  { key: "s_visit", type: "visit", variant: "map", settings: { showPhone: false } },
  menu(1, "none"),
  booking("strip", "s_times"),
  gallery("filmstrip", "s_photos"),
]);

/** The dog walker, journal: a hero on paper, the notebook wall, the menu, the TV with notes. */
export const petsJournal = doc("pets-carnet", "airy", [
  hero("split"),
  gallery("wall", "s_wall", { settings: { source: "all", texture: "ridge" } }),
  menu(1, "none"),
  { key: "s_tv", type: "video", variant: "tv", settings: { cabinet: "portable" } },
  booking("panel", "s_book"),
]);

export const shopStarters = { salonCompact, salonEditorial, salonGallery, petsRoute, petsJournal } as const;
export type ShopStarterId = keyof typeof shopStarters;
