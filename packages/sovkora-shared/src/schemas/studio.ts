/**
 * @file studio.ts
 * @description Zod schemas and types for the Studio context (ADR-034).
 *
 * Single source for both web clients: the admin console authors this data and the
 * user client browses, installs and runs it, so a duplicated interface would drift
 * the moment either side changed (AGENTS.md §8). Parsed rather than cast at the BFF
 * boundary — a blueprint the UI renders a form from must not be whatever the network
 * happened to return.
 */

import { z } from "zod";

import { PackKindSchema } from "./pack";

/** How an actor obtains the right to install a Studio. Mirrors the Tier-1 StudioPricing. */
export const StudioPricingSchema = z.enum(["FREE", "INCLUDED", "PAID"]);
export type StudioPricing = z.infer<typeof StudioPricingSchema>;

/** Publication lifecycle of a marketplace item. Mirrors the Tier-1 StudioStatus. */
export const StudioStatusSchema = z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "DEPRECATED", "WITHDRAWN"]);
export type StudioStatus = z.infer<typeof StudioStatusSchema>;

/** Publication lifecycle of one blueprint version. */
export const BlueprintStatusSchema = z.enum(["DRAFT", "PUBLISHED", "DEPRECATED"]);
export type BlueprintStatus = z.infer<typeof BlueprintStatusSchema>;

/**
 * Why a Studio is not installable by this actor.
 *
 * `UNKNOWN` is deliberately distinct from the two refusals: billing being unreachable
 * says nothing about the actor, and rendering it as "you are not entitled" is the one
 * failure that costs trust rather than a click (ADR-034 §8.3).
 */
export const LockReasonSchema = z.enum(["NONE", "REQUIRES_PURCHASE", "REQUIRES_PLAN", "UNKNOWN"]);
export type LockReason = z.infer<typeof LockReasonSchema>;

/** Lifecycle of one actor's copy of a Studio. */
export const InstallationStatusSchema = z.enum(["ACTIVE", "PAUSED", "UPGRADE_AVAILABLE", "REVOKED"]);
export type InstallationStatus = z.infer<typeof InstallationStatusSchema>;

/** Lifecycle of one execution of an installation. */
export const RunStatusSchema = z.enum([
  "PENDING_APPROVAL",
  "RUNNING",
  "AWAITING_INPUT",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
  "COMPENSATING",
]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

/** Lifecycle of one node of a run's DAG — deliberately not the run's own vocabulary. */
export const RunStepStatusSchema = z.enum(["PENDING", "RUNNING", "SUCCEEDED", "FAILED", "SKIPPED", "CANCELLED"]);
export type RunStepStatus = z.infer<typeof RunStepStatusSchema>;

/**
 * One catalogue card.
 *
 * `locked` travels with the card rather than filtering it out: a Studio the actor
 * cannot yet install is the top of the funnel, so the grid greys it and offers the
 * upsell. Hiding it destroys the funnel (ADR-034 §4).
 */
export const StudioSummarySchema = z.object({
  studioKey: z.string(),
  label: z.string(),
  tagline: z.string().nullable(),
  profession: z.string(),
  iconKey: z.string(),
  heroAssetId: z.string().nullable(),
  pricing: StudioPricingSchema,
  kind: PackKindSchema,
  latestVersion: z.string().nullable(),
  locked: z.boolean(),
  lockedReason: LockReasonSchema,
  packKey: z.string().nullable(),
});
export type StudioSummary = z.infer<typeof StudioSummarySchema>;

/**
 * The Studio detail screen.
 *
 * `inputSchema` and `configSchema` arrive as raw JSON Schema strings so the client
 * generates its own forms. A hand-written form per Studio would make every new
 * profession a frontend release — the same deploy-per-Studio failure ADR-034 exists
 * to avoid, on this side of the wire.
 */
export const StudioDetailSchema = z.object({
  studioKey: z.string(),
  label: z.string(),
  tagline: z.string().nullable(),
  description: z.string().nullable(),
  profession: z.string(),
  iconKey: z.string(),
  heroAssetId: z.string().nullable(),
  pricing: StudioPricingSchema,
  kind: PackKindSchema,
  status: StudioStatusSchema,
  latestVersion: z.string().nullable(),
  estimatedCredits: z.number(),
  inputSchema: z.string().nullable(),
  configSchema: z.string().nullable(),
  locked: z.boolean(),
  lockedReason: LockReasonSchema,
  packKey: z.string().nullable(),
});
export type StudioDetail = z.infer<typeof StudioDetailSchema>;

/** One row of a Studio's version history, with the changelog an upgrade is agreed against. */
export const BlueprintVersionSchema = z.object({
  version: z.string(),
  status: BlueprintStatusSchema,
  estimatedCredits: z.number(),
  changelog: z.string().nullable(),
  publishedAt: z.string().nullable(),
});
export type BlueprintVersion = z.infer<typeof BlueprintVersionSchema>;

/** One actor's installation: a pinned version plus their own configuration. */
export const InstallationSchema = z.object({
  id: z.string(),
  studioKey: z.string(),
  label: z.string(),
  iconKey: z.string(),
  pinnedVersion: z.string(),
  latestVersion: z.string().nullable(),
  status: InstallationStatusSchema,
  config: z.record(z.string(), z.string()),
  installedAt: z.string(),
  lastRunAt: z.string().nullable(),
});
export type Installation = z.infer<typeof InstallationSchema>;

/** One node of a run, as the live timeline renders it. */
export const RunStepSchema = z.object({
  stepId: z.string(),
  ordinal: z.number(),
  jobId: z.string().nullable(),
  status: RunStepStatusSchema,
  attempts: z.number(),
  error: z.string().nullable(),
  /** When the step was dispatched (ISO-8601). */
  startedAt: z.string().nullish(),
  /** The measured median wall time of this step in this Studio, ms; absent until enough runs exist. */
  estimateMs: z.number().nullish(),
  /** How many past runs `estimateMs` is the median of. */
  estimateSamples: z.number().nullish(),
});
export type RunStep = z.infer<typeof RunStepSchema>;

/** How a produced artefact should be shown, as the blueprint declared it. */
export const ArtefactTypeSchema = z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO"]);
export type ArtefactType = z.infer<typeof ArtefactTypeSchema>;

/**
 * One artefact a finished run produced.
 *
 * A list rather than a keyed object, and each entry carries its own label and type:
 * the blueprint declares its outputs in a deliberate order (the finished Reel before
 * the hashtags), and without the type a client can only print an asset id as text.
 */
export const RunArtefactSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: ArtefactTypeSchema.catch("TEXT"),
  value: z.string(),
});
export type RunArtefact = z.infer<typeof RunArtefactSchema>;

/** What a finished run produced, in declaration order. */
export const RunOutputsSchema = z.array(RunArtefactSchema);
export type RunOutputs = z.infer<typeof RunOutputsSchema>;

/** One execution of a Studio. */
export const RunSchema = z.object({
  id: z.string(),
  /**
   * Null for a TOOLKIT run (ADR-061): its installation is derived from entitlement and
   * has no row, so there is no id to carry. Non-nullable here would make every TOOLKIT
   * run fail to parse in the client that started it.
   */
  installationId: z.string().nullable(),
  studioKey: z.string(),
  blueprintVersion: z.string(),
  status: RunStatusSchema,
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
  errorMessage: z.string().nullable(),
  steps: z.array(RunStepSchema),
  outputs: RunOutputsSchema,
});
export type Run = z.infer<typeof RunSchema>;

/**
 * What the composer puts into a button's single input.
 *
 * Declared by the pack, not inferred by the client: an asset id and a sentence are
 * both strings, and a composer that guessed would paste a prompt into a field the
 * server resolves against the asset store (ADR-068 §3).
 */
export const ComposerInputKindSchema = z.enum(["TEXT", "ASSET"]);
export type ComposerInputKind = z.infer<typeof ComposerInputKindSchema>;

/**
 * One button of the chat composer.
 *
 * What replaced the capability row the chat bar used to be built from. There is no
 * `uriPath`, no `httpMethod` and no `payloadTemplate`, because the client no longer
 * composes a call: it starts a run of `studioKey` and the blueprint decides the rest.
 *
 * Membership in this row is structural — one step, one required input — so a Studio
 * joins or leaves it by changing its blueprint, never by a list shipped in a client.
 */
export const ComposerStudioSchema = z.object({
  studioKey: z.string(),
  label: z.string(),
  iconKey: z.string(),
  version: z.string(),
  capabilityKey: z.string(),
  inputKey: z.string(),
  inputKind: ComposerInputKindSchema,
  /** Where the prose the user typed goes; null when the schema offers nowhere for it. */
  promptKey: z.string().nullable(),
  available: z.boolean(),
  lockedReason: LockReasonSchema,
});
export type ComposerStudio = z.infer<typeof ComposerStudioSchema>;

/**
 * Whether a run's outcome is settled, for components that must stop polling.
 *
 * Owned here rather than re-derived per component: three screens ask this question
 * and a fourth answer would eventually disagree with the saga.
 *
 * @param status - the run's current status
 * @returns whether no further transition will occur
 */
export function isTerminalRun(status: RunStatus): boolean {
  return status === "SUCCEEDED" || status === "FAILED" || status === "CANCELLED";
}
