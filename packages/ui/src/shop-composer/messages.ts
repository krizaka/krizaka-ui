// The composer's words (ADR-007 §5): every string is a prop — the product passes its translated copy. English is the default, so
// a story or a first integration works without a catalogue; `{name}`, `{n}`, `{total}` are replaced by `fill`.
import type { SectionType } from "../shop/catalogue";
import type { DiffEntry } from "./diff";

export type ShopComposerMessages = {
  title: string;
  /** The outline's name. */
  sections: string;
  addSection: string;
  addSectionHint: string;
  /** « Show {name} » / the switch's accessible name. */
  toggleVisible: string;
  sectionMenu: string;
  moveUp: string;
  moveDown: string;
  moveTop: string;
  remove: string;
  /** Announcements. */
  announceMoved: string;
  announceCannotMove: string;
  announceAdded: string;
  announceRemoved: string;
  announceShown: string;
  announceHidden: string;
  announceUndone: string;
  announceRedone: string;
  hiddenNote: string;
  /** The inspector. */
  inspector: string;
  noSelection: string;
  backToSections: string;
  variant: string;
  settings: string;
  words: string;
  titleField: string;
  leadField: string;
  french: string;
  english: string;
  blocks: string;
  addBlock: string;
  removeBlock: string;
  /** The look. */
  look: string;
  /** The six looks, as a group of swatches. */
  lookChoice: string;
  /** Said when a look is applied (`{name}`). */
  lookApplied: string;
  /** The accent within the chosen look. */
  accentChoice: string;
  /** The names of the accents a look lists (`krizaka`, `akinaza:accent-2`…); an unknown one reads as its id. */
  accentNames: Readonly<Record<string, string>>;
  preset: string;
  density: string;
  densityCompact: string;
  densityAiry: string;
  /** The toolbar. */
  undo: string;
  redo: string;
  saved: string;
  saving: string;
  saveFailed: string;
  publish: string;
  discard: string;
  /** The preview. */
  preview: string;
  previewTitle: string;
  phone: string;
  desktop: string;
  viewPreview: string;
  closePreview: string;
  /** The publish dialog. */
  publishTitle: string;
  publishWhat: string;
  publishNothing: string;
  publishConfirm: string;
  cancel: string;
  problemsTitle: string;
  problemIn: string;
  /** The names. */
  sectionNames: Record<SectionType, string>;
  /** `type.variant` → « Poster ». */
  variantNames: Record<string, string>;
  blockNames: Record<string, string>;
  settingNames: Record<string, string>;
  optionNames: Record<string, string>;
  /** One line per kind of change, with `{name}` (the section) and `{from}` / `{to}` / `{n}`. */
  diff: Record<DiffEntry["kind"], string>;
};

/** `fill("Moved to {n}", { n: 2 })`. */
export const fill = (message: string, vars: Record<string, string | number>) => message.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));

const sectionNames: Record<SectionType, string> = {
  hero: "Hero", services: "Services", booking: "Booking", gallery: "Photos", video: "Video", reviews: "Reviews", bulletin: "News",
  team: "Team", visit: "Visit", story: "Story", social: "Social", faq: "Questions", policies: "Policies",
};

const variantNames: Record<string, string> = {
  "hero.poster": "Poster", "hero.split": "Split", "hero.banner": "Banner", "hero.tv": "Television",
  "services.menu": "Menu", "services.cards": "Cards", "services.index": "Index cards", "services.carousel": "Carousel",
  "booking.strip": "Next times", "booking.panel": "Closing call", "booking.sticky": "Phone bar",
  "gallery.mosaic": "Mosaic", "gallery.filmstrip": "Filmstrip", "gallery.wall": "Wall", "gallery.grid": "Grid",
  "video.tv": "Television", "video.shorts": "Reels",
  "reviews.summary-cards": "Score and reviews", "reviews.quote": "One quote", "reviews.strip": "Score line",
  "bulletin.board": "Board", "bulletin.banner": "Banner line",
  "team.row": "Row", "team.cards": "Cards",
  "visit.card": "Card", "visit.map": "Map", "visit.split": "Hours and map",
  "story.quote": "Quote", "story.owner": "Owner",
  "social.links": "Links", "social.facade": "Latest reel",
  "faq.list": "List", "policies.inline": "Inline",
};

export const defaultShopComposerMessages: ShopComposerMessages = {
  title: "Shop page",
  sections: "Sections",
  addSection: "Add a section",
  addSectionHint: "Choose what to add to your page.",
  toggleVisible: "Show {name}",
  sectionMenu: "Actions for {name}",
  moveUp: "Move up",
  moveDown: "Move down",
  moveTop: "Move to top",
  remove: "Remove",
  announceMoved: "{name} moved to position {n} of {total}",
  announceCannotMove: "{name} cannot move further",
  announceAdded: "{name} added at position {n}",
  announceRemoved: "{name} removed",
  announceShown: "{name} is shown",
  announceHidden: "{name} is hidden",
  announceUndone: "Undone",
  announceRedone: "Redone",
  hiddenNote: "hidden",
  inspector: "Section",
  noSelection: "Choose a section to change how it is drawn.",
  backToSections: "Back to sections",
  variant: "How it is drawn",
  settings: "Settings",
  words: "Your words",
  titleField: "Title",
  leadField: "Line under the title",
  french: "French",
  english: "English",
  blocks: "Items",
  addBlock: "Add",
  removeBlock: "Remove {name}",
  look: "Look",
  lookChoice: "Look of the page",
  lookApplied: "Look: {name}",
  accentChoice: "Accent",
  accentNames: { krizaka: "Krizaka blue", akinaza: "Akinaza green", "akinaza:accent-2": "Copper", yomizaka: "Indigo", orazaka: "Orange" },
  preset: "Style",
  density: "Spacing",
  densityCompact: "Compact",
  densityAiry: "Airy",
  undo: "Undo",
  redo: "Redo",
  saved: "Saved",
  saving: "Saving…",
  saveFailed: "Not saved",
  publish: "Publish",
  discard: "Discard the draft",
  preview: "Preview",
  previewTitle: "Live preview of your page",
  phone: "Phone",
  desktop: "Desktop",
  viewPreview: "View",
  closePreview: "Close",
  publishTitle: "Publish this page",
  publishWhat: "What changes",
  publishNothing: "Nothing has changed since the last publication.",
  publishConfirm: "Publish",
  cancel: "Cancel",
  problemsTitle: "Fix {n} problem before publishing",
  problemIn: "{name}",
  sectionNames,
  variantNames,
  blockNames: { fact: "Fact", service: "Service", photo: "Photo", note: "Note", sign: "Sign", reel: "Reel", flyer: "Flyer", member: "Member", link: "Link", question: "Question" },
  settingNames: { media: "Photo", focus: "Crop", source: "Source", groupBy: "Group by", columns: "Columns", aside: "Beside the list", serviceId: "Service", count: "How many", texture: "Wall", cabinet: "Cabinet", channel: "Channel", rule: "Which reviews", showPhone: "Show the phone number", body: "Text", show: "Show" },
  optionNames: { center: "Centre", top: "Top", bottom: "Bottom", all: "All", pick: "Pick", category: "Category", none: "None", hours: "Hours", plaster: "Plaster", brick: "Brick", ridge: "Ridge", zellige: "Zellige", cabinet: "Cabinet", portable: "Portable", best: "Best", latest: "Latest", cancellation: "Cancellation", prices: "Prices", "booking-window": "Booking window" },
  diff: {
    added: "{name} added",
    removed: "{name} removed",
    moved: "{name} moved from {from} to {to}",
    variant: "{name} drawn as {to} (was {from})",
    settings: "{name}: settings changed",
    blocks: "{name}: items changed",
    text: "{name}: words changed",
    disabled: "{name} hidden",
    enabled: "{name} shown",
    preset: "Style changed to {to} (was {from})",
    density: "Spacing changed to {to} (was {from})",
  },
};
