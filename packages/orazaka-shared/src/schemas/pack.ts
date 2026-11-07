/**
 * @file pack.ts
 * @description Zod schemas for the Pack catalogue served by orazaka-studio-service
 * (`/api/v1/studios/packs`), mirroring PackSummaryResponse, PackDetailResponse and
 * PackCategoryResponse.
 *
 * These live apart from `billing.ts` because the split they encode is the point of
 * ADR-036: **billing answers what a pack costs, the catalogue answers what it is.**
 * `PackSchema` in `billing.ts` is now a price tag and nothing else; everything a
 * marketplace card renders — name, shelf, icon, tagline, bundle — is here.
 */

import { z } from "zod";

/**
 * One marketplace shelf.
 *
 * **Fetched, not enumerated.** This used to be `z.enum(["BUSINESS", "LIFESTYLE"])`
 * mirroring a SQL CHECK constraint, with its French labels hardcoded in two React
 * components. Adding a shelf therefore meant editing three files in two languages and
 * inventing a translation nobody had written. A shelf is a row now, and it arrives
 * already localised — which is exactly the nameability the old comment was defending.
 */
export const PackCategorySchema = z.object({
  categoryKey: z.string().min(1),
  label: z.string().min(1),
  description: z.string().nullable(),
  iconKey: z.string().min(1),
  sortWeight: z.number().int(),
});
export type PackCategory = z.infer<typeof PackCategorySchema>;

/** How much regulatory weight a pack carries. Nothing in the client acts on it yet (ADR-036). */
export const RegulatoryClassSchema = z.enum(["STANDARD", "SENSITIVE", "REGULATED"]);
export type RegulatoryClass = z.infer<typeof RegulatoryClassSchema>;

/**
 * How a pack reaches the user (ADR-061), mirroring `PackKind` and `ck_pack_kind`.
 *
 * VERTICAL is chosen and installed; TOOLKIT is simply had by an entitled actor, whose
 * installation is derived and never stored — so a TOOLKIT card and a TOOLKIT Studio
 * never offer an Install button. Orthogonal to `regulatoryClass`: do not read one from
 * the other.
 */
export const PackKindSchema = z.enum(["VERTICAL", "TOOLKIT"]);
export type PackKind = z.infer<typeof PackKindSchema>;

/**
 * How **this actor** gets this pack, decided by the server (ADR-066).
 *
 * The client used to read `kind === "TOOLKIT"` and print "included" on its own, which
 * told an actor entitled to nothing that they already had the pack — and then offered
 * them no way to get it. `kind` says what a pack is; only the entitlement snapshot says
 * what this person has, and that snapshot lives on the server.
 *
 * INCLUDED — entitlement already grants it, nothing to add.
 * BUYABLE — not granted, and billing named a price.
 * UNAVAILABLE — not granted and no price to show; the card says so rather than quoting
 * an amount nobody gave it.
 */
export const PackAccessSchema = z.enum(["INCLUDED", "BUYABLE", "UNAVAILABLE"]);
export type PackAccess = z.infer<typeof PackAccessSchema>;

/**
 * One marketplace card.
 *
 * `priceCents` is **nullable and that is load-bearing**: `0` means free, `null` means
 * the billing service did not answer. The card renders the second as "—". Coercing
 * null to 0 here would have the marketplace advertise a price the product never agreed
 * to, every time billing restarts — which is why there is no `.default(0)` on it.
 */
export const PackSummarySchema = z.object({
  packKey: z.string().min(1),
  categoryKey: z.string().min(1),
  label: z.string().min(1),
  tagline: z.string().nullable(),
  iconKey: z.string().min(1),
  heroAssetId: z.string().nullable(),
  regulatoryClass: RegulatoryClassSchema,
  kind: PackKindSchema,
  access: PackAccessSchema,
  studioKeys: z.array(z.string()),
  priceCents: z.number().int().nonnegative().nullable(),
  includedCredits: z.number().int().nonnegative().nullable(),
});
export type PackSummary = z.infer<typeof PackSummarySchema>;

/** One pack's detail screen: the card's payload plus the long copy and its shelf. */
export const PackDetailSchema = PackSummarySchema.omit({ categoryKey: true }).extend({
  category: PackCategorySchema,
  description: z.string().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "WITHDRAWN"]),
  locales: z.array(z.string()),
});
export type PackDetail = z.infer<typeof PackDetailSchema>;
