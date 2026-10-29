/* The twelve functional domains of Krizaka UI (ADR-008 §3), as the docs navigate them: the order, the support level
   order, and the facts of an entry — who really imports it, how big it is against its budget. The list and the domain of
   each entry are the registry's (`domain` in meta.ts); the size and the consumers are the dated inventory
   (docs/inventory/ui-usage.json, `pnpm inventory:usage`); the domains' size budgets are packages/ui/size-budgets.json.
   Pure data: the sidebar, the catalogue, the pages and tests/domains.test.mjs share it. Words are messages (docs.ia.domains). */

import inventory from "../../../docs/inventory/ui-usage.json" with { type: "json" };
import budgets from "../../../packages/ui/size-budgets.json" with { type: "json" };
import { domainOf,DOMAINS } from "./domains.ts";
import type { Domain, RegistryItem, Status } from "./ui-registry";

export { domainOf,DOMAINS };

/** Stable and beta first, experimental after, deprecated last (and out of the sidebar). */
const LEVEL_ORDER: Record<Status, number> = { stable: 0, beta: 1, experimental: 2, deprecated: 3 };

export const levelRank = (status: Status): number => LEVEL_ORDER[status];

/** The entries of a domain in reading order: by support level, then by title. */
export function inDomain<T extends Pick<RegistryItem, "domain" | "status" | "title">>(items: readonly T[], domain: Domain): T[] {
  return items.filter((item) => domainOf(item) === domain).sort((a, b) => levelRank(a.status) - levelRank(b.status) || a.title.localeCompare(b.title));
}

/** The products and sites whose imports the page counts: the live consumers, in a fixed order. */
export const CONSUMERS = ["yomizaka", "akinaza", "orazaka-web-client", "krizaka-com"] as const;
export type Consumer = (typeof CONSUMERS)[number];

interface InventoryEntry {
  pkg: string;
  name: string;
  importers: Record<string, number>;
  live: number;
  sizeGzip: number | null;
  budget: number | null;
}

const ENTRIES = new Map((inventory.entries as InventoryEntry[]).map((entry) => [entry.name, entry]));

export interface EntryFacts {
  /** Files of the live consumers that import it. */
  live: number;
  byConsumer: Partial<Record<Consumer, number>>;
  /** Gzip bytes of the entry and its chunks, and its size-limit budget (null where not measured). */
  sizeGzip: number | null;
  budget: number | null;
}

/** What the inventory knows of an entry; null for an entry it does not list (the page then says nothing). */
export function factsOf(name: string): EntryFacts | null {
  const entry = ENTRIES.get(name);
  if (!entry) return null;
  const byConsumer = Object.fromEntries(CONSUMERS.flatMap((consumer) => (entry.importers[consumer] ? [[consumer, entry.importers[consumer]]] : [])));
  return { live: entry.live, byConsumer, sizeGzip: entry.sizeGzip, budget: entry.budget };
}

/** The frozen size budget of a domain, in bytes (the sum of its entries' size-limit rows; it only goes down). */
export const domainBudget = (domain: Domain): number => (budgets.domains as Record<string, number>)[domain] ?? 0;

export const INVENTORY_DATE: string = inventory.generated;

/** 1234 → "1.2 kB" */
export const kb = (bytes: number): string => `${(bytes / 1000).toFixed(1)} kB`;
