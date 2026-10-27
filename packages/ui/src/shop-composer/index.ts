/** @krizaka/ui/shop-composer — our own shop composer: `ShopComposer` (the outline, the live preview of the product's page, the inspector of the selected section, the look), its commands, history (⌘Z, 100 steps), the publish diff, the settings form generated from a section's zod schema. A separate entry: never in a public page's bundle. Client. */
export { applyCommand, type Command, moved } from "./commands";
export { AUTOSAVE_MS, ShopComposer, type ShopComposerPreset, type ShopComposerProps } from "./composer";
export { type DiffEntry, diffPages } from "./diff";
export { describeSettings, type FieldSpec } from "./fields";
export { canRedo, canUndo, createHistory, type History, HISTORY_LIMIT, redo, run, undo } from "./history";
export { newKey } from "./keys";
export { defaultShopComposerMessages, fill, type ShopComposerMessages } from "./messages";
export { SectionThumbnail, type SectionThumbnailProps } from "./thumbnails";
