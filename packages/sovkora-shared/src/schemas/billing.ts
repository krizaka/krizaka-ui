/**
 * @file billing.ts
 * @description Zod schemas and types for the billing context (ADR-033).
 *
 * Single source for both web clients: the admin console edits this data and the
 * user client reads it, so a duplicated interface would drift the moment either
 * side changed (AGENTS.md §8). Parsed rather than cast at the BFF boundary — a
 * balance the UI trusts must not be whatever the network happened to return.
 */

import { z } from "zod";

/** Which balance a movement touched. Granted credits expire; purchased ones do not. */
export const CreditBucketSchema = z.enum(["GRANTED", "PURCHASED"]);
export type CreditBucket = z.infer<typeof CreditBucketSchema>;

/** The capabilities that can be metered. Mirrors the Tier-1 BillableCapability. */
export const BillableCapabilitySchema = z.enum(["CHAT", "IMAGE", "AUDIO", "VIDEO", "AGENT"]);
export type BillableCapability = z.infer<typeof BillableCapabilitySchema>;

/** How a capability's consumption is counted. */
export const BillableUnitSchema = z.enum([
  "KILOTOKEN",
  "IMAGE_STEP",
  "OUTPUT_SECOND",
  "KILOCHAR",
  "AUDIO_MINUTE",
  "GPU_SECOND",
  "CALL",
]);
export type BillableUnit = z.infer<typeof BillableUnitSchema>;

/** A user's balances. `held` is reserved by in-flight work and is not spendable. */
export const WalletSchema = z.object({
  actorId: z.string(),
  balanceGranted: z.number().int().nonnegative(),
  balancePurchased: z.number().int().nonnegative(),
  held: z.number().int().nonnegative(),
});
export type Wallet = z.infer<typeof WalletSchema>;

/**
 * What an actor may do and how much they have left.
 *
 * `planKey` may be the unresolved sentinel when billing could not be reached; the
 * UI treats that as "do not gate", matching the server-side rule.
 */
export const EntitlementSnapshotSchema = z.object({
  actorId: z.string(),
  planKey: z.string(),
  entitlements: z.record(z.string(), z.string()),
  availableCredits: z.number().int(),
  expiresAt: z.string(),
});
export type EntitlementSnapshot = z.infer<typeof EntitlementSnapshotSchema>;

/** One typed grant. Plans and packs are both built from these (design §14). */
export const EntitlementSchema = z.object({
  key: z.string().min(1),
  valueType: z.enum(["boolean", "int", "string"]),
  value: z.string(),
});
export type Entitlement = z.infer<typeof EntitlementSchema>;

/** A commercial plan and what it unlocks. */
export const PlanSchema = z.object({
  planKey: z.string().min(1),
  label: z.string().min(1),
  tierRank: z.number().int(),
  monthlyCreditGrant: z.number().int().nonnegative(),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
  rateLimitTierKey: z.string().min(1),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  entitlements: z.array(EntitlementSchema),
});
export type Plan = z.infer<typeof PlanSchema>;

/**
 * A pack's price tag — same entitlement grammar as a plan, bought separately from one.
 *
 * It used to carry `label`, `category` and `profession`, and the category was a closed
 * enum here mirroring a SQL CHECK. The comment that defended the enum argued the
 * front-end has to *label* each shelf, so a value it cannot name renders as a raw key.
 * That reasoning was right and it is why the enum is gone: a shelf that needs a French
 * label, an icon and a sort order is a row, and it now arrives already localised from
 * the catalogue (ADR-036 — see `PackCategorySchema` in `./pack`).
 *
 * What is left here is what billing is authoritative for: **what it costs and what it
 * grants.** The half a marketplace card renders is `PackSummary` in `./pack`.
 */
export const PackSchema = z.object({
  packKey: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  includedCredits: z.number().int().nonnegative(),
  isActive: z.boolean(),
  entitlements: z.array(EntitlementSchema),
});
export type Pack = z.infer<typeof PackSchema>;

/** One credit rate. Rates are versioned and closed, never overwritten. */
export const PricebookRateSchema = z.object({
  version: z.number().int().positive(),
  capability: BillableCapabilitySchema,
  modelName: z.string().nullable(),
  unit: BillableUnitSchema,
  creditsPerUnit: z.number(),
  minimumCredits: z.number().int().nonnegative(),
  estimateCredits: z.number().int().nonnegative(),
});
export type PricebookRate = z.infer<typeof PricebookRateSchema>;

/**
 * What a proposed rate would have charged over real traffic.
 *
 * `sampleEvents` is not decoration: a verdict drawn from three events must not be
 * presented like one drawn from three thousand.
 */
export const MarginPreviewSchema = z.object({
  capability: BillableCapabilitySchema,
  modelName: z.string().nullable(),
  sampleEvents: z.number().int().nonnegative(),
  currentCredits: z.number().int().nonnegative(),
  proposedCredits: z.number().int().nonnegative(),
});
export type MarginPreview = z.infer<typeof MarginPreviewSchema>;

/** Consumption and refusals for one capability × model. */
export const CapabilityUsageSchema = z.object({
  capability: z.string(),
  modelName: z.string().nullable(),
  events: z.number().int().nonnegative(),
  creditsCharged: z.number().int().nonnegative(),
  refusals: z.number().int().nonnegative(),
  enforcedRefusals: z.number().int().nonnegative(),
  gpuSeconds: z.number().nullable(),
});
export type CapabilityUsage = z.infer<typeof CapabilityUsageSchema>;

/** One actor's spend, for the top-consumers view. */
export const ActorConsumptionSchema = z.object({
  actorId: z.string(),
  events: z.number().int().nonnegative(),
  creditsCharged: z.number().int().nonnegative(),
});
export type ActorConsumption = z.infer<typeof ActorConsumptionSchema>;

/** Lifecycle of a subscription. The first three grant the plan's entitlements. */
export const SubscriptionStatusSchema = z.enum(["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

/** An actor's commercial standing. */
export const SubscriptionSchema = z.object({
  actorId: z.string(),
  planKey: z.string(),
  status: SubscriptionStatusSchema,
  periodStart: z.string(),
  periodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;
/**
 * One pack an actor holds.
 *
 * Separate from `Subscription` because the cardinality is: an actor has exactly one
 * plan and any number of packs. Collapsing the two types would make "which pack" an
 * optional field on something that is otherwise always singular.
 */
export const PackSubscriptionSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  packKey: z.string(),
  status: SubscriptionStatusSchema,
  subscribedAt: z.string(),
  periodEnd: z.string().nullable(),
});
export type PackSubscription = z.infer<typeof PackSubscriptionSchema>;

/**
 * The structured refusal behind a 402.
 *
 * Never a bare status: the paywall needs the shortfall, the capability and the
 * remedies, and re-deriving any of them client-side is how it drifts from the
 * ledger (design §6.1).
 */
export const RefusalSchema = z.object({
  status: z.string(),
  capability: z.string().optional(),
  required: z.number().int().optional(),
  balance: z.number().int().optional(),
  remedies: z.array(z.string()).default([]),
  message: z.string().optional(),
});
export type Refusal = z.infer<typeof RefusalSchema>;

/**
 * What a request is expected to cost, shown before the user commits to it.
 *
 * The design is explicit that this is not a nicety: an unexpected debit on a job
 * the user did not know was expensive is the number-one support ticket in credit
 * products (§12).
 */
export const CostEstimateSchema = z.object({
  capability: BillableCapabilitySchema,
  modelName: z.string().nullable(),
  estimateCredits: z.number().int().nonnegative(),
  availableCredits: z.number().int(),
  affordable: z.boolean(),
});
export type CostEstimate = z.infer<typeof CostEstimateSchema>;

/** Spendable balance: what is left once in-flight reservations are set aside. */
export function availableCredits(wallet: Wallet): number {
  return wallet.balanceGranted + wallet.balancePurchased - wallet.held;
}

/**
 * The balance to SHOW: spendable credits, never below zero.
 *
 * The ledger may legitimately go below zero (a bounded settlement overshoot, or shadow metering on dev); a negative balance
 * is a ledger fact, not something to tell a customer ("-860 available" reads as a debt). Decisions (can this run
 * start?) keep using {@link availableCredits}.
 */
export function spendableCredits(wallet: Wallet): number {
  return Math.max(0, availableCredits(wallet));
}

/**
 * Formats credits for display.
 *
 * Grouped rather than abbreviated: "1.2k credits" reads as an approximation, and a
 * balance a user is about to spend against should never look approximate.
 */
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(credits);
}

/** Formats a plan price from cents, in its own currency. */
export function formatPrice(priceCents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}

/** One AI model as the model catalogue describes it. */
export const CatalogModelSchema = z.object({
  modelName: z.string(),
  modelLabel: z.string().nullable().optional(),
  category: z.string(),
  providerName: z.string().nullable().optional(),
  isDefault: z.boolean().nullable().optional(),
});
export type CatalogModel = z.infer<typeof CatalogModelSchema>;

/**
 * Which capability a model bills as, from its catalogue category.
 *
 * The join lives here because neither side can do it alone: the billing context
 * prices `(capability, model)` and has no idea what categories exist, while the
 * model catalogue knows categories and nothing about credits. They are separate
 * bounded contexts with separate databases, so the console is the composition
 * point — and this is the one place that mapping is written down.
 */
export function capabilityForModelCategory(category: string): BillableCapability {
  const normalised = category.toLowerCase();
  if (normalised.includes("video")) return "VIDEO";
  if (normalised.includes("speech") || normalised.includes("audio")) return "AUDIO";
  if (normalised.includes("image") || normalised.includes("vision")) return "IMAGE";
  if (normalised.includes("agent")) return "AGENT";
  return "CHAT";
}

/**
 * The unit a category is normally metered in, offered as the form's default.
 *
 * A suggestion, not a rule: the admin can override it, because the unit is a
 * property of the model rather than of its category. Speech and transcription
 * share the AUDIO capability and bill differently — characters in, minutes in —
 * which is exactly why AUDIO has no capability-wide default rate.
 */
export function suggestedUnitFor(category: string): BillableUnit {
  const normalised = category.toLowerCase();
  if (normalised.includes("video")) return "OUTPUT_SECOND";
  if (normalised.includes("speech")) return "KILOCHAR";
  if (normalised.includes("audio")) return "AUDIO_MINUTE";
  if (normalised.includes("image")) return "IMAGE_STEP";
  return "KILOTOKEN";
}

/**
 * Whether a model is covered by a rate.
 *
 * A model-specific row covers it; so does a capability default. AUDIO has no
 * default by design, so its models are only ever covered individually — which is
 * why "unpriced" has to be computed rather than assumed from the capability.
 *
 * An uncovered model is not cosmetic: the hold refuses it outright rather than
 * guessing a price, so the capability simply stops working for that model.
 */
export function isModelPriced(model: CatalogModel, rates: Pick<PricebookRate, "capability" | "modelName">[]): boolean {
  const capability = capabilityForModelCategory(model.category);
  return rates.some(
    (rate) => rate.capability === capability && (rate.modelName === model.modelName || rate.modelName === null),
  );
}
