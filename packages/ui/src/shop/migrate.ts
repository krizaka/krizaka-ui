// Migrations of the document (ADR-007 §1): pure functions schema n → n + 1, applied in memory when an older document is
// read; the product writes the migrated one back on the next save. A newer document than this code knows is refused.
import { SHOP_SCHEMA_VERSION } from "./schema";

export type ShopMigration = {
  /** The schema it reads. */
  from: number;
  /** Pure: returns a new document, never mutates. */
  up: (doc: Record<string, unknown>) => Record<string, unknown>;
};

/** The migrations of the document, oldest first. Schema 1 is the first format: none yet. */
export const SHOP_MIGRATIONS: readonly ShopMigration[] = [];

export type MigrationResult = { ok: true; doc: Record<string, unknown>; from: number } | { ok: false; reason: string };

/** A migrator over a list of migrations and a current version (the shop's own are `migrateShopPage`). */
export function createMigrator(migrations: readonly ShopMigration[], current: number) {
  return (input: unknown): MigrationResult => {
    if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, reason: "a document is an object" };
    let doc = input as Record<string, unknown>;
    const from = doc.schema;
    if (typeof from !== "number" || !Number.isInteger(from) || from < 1) return { ok: false, reason: "the document has no schema version" };
    if (from > current) return { ok: false, reason: `schema ${from} is newer than this code knows (${current})` };
    for (let n = from; n < current; n++) {
      const step = migrations.find((m) => m.from === n);
      if (!step) return { ok: false, reason: `no migration from schema ${n}` };
      doc = { ...step.up(doc), schema: n + 1 };
    }
    return { ok: true, doc, from };
  };
}

/** Brings a stored document to the current schema (then `parseShopPage` it). */
export const migrateShopPage = createMigrator(SHOP_MIGRATIONS, SHOP_SCHEMA_VERSION);
