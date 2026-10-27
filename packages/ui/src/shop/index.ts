/** @krizaka/ui/shop — the document of a shop page (`shopPageSchema`, `parseShopPage`, `migrateShopPage`, `defineSection`, the catalogue of 13 section types with their variants), the frame and rhythm every section draws in (`ShopPage`, `ShopSection`) and the five starter documents. Server-safe. */
export { SECTION_DEFINITIONS, SECTION_TYPES, type SectionDefinition, sectionDefinition, type SectionType } from "./catalogue";
export { defineSection, type ParsedSection, type SectionSpec } from "./define";
export { ShopFrame, type ShopFrameProps, type ShopPhoto, ShopSection, type ShopSectionProps } from "./frame";
export { SHOP_LIMITS } from "./limits";
export { createMigrator, migrateShopPage, type MigrationResult, SHOP_MIGRATIONS, type ShopMigration } from "./migrate";
export { parseShopPage, type Section, type SectionOf, SHOP_SCHEMA_VERSION, type ShopPage, type ShopPageIssue, type ShopPageResult,shopPageSchema } from "./schema";
export { type ShopStarterId, shopStarters } from "./starters";
export { type LocalizedText } from "./text";
