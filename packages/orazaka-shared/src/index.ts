/**
 * @file index.ts
 * @description Barrel export for orazaka-shared schemas, types, and design tokens.
 */

export type { IntentEnvelope, IntentToken, InterceptorPolicy, PolicyPredicate } from "./schemas/intent-envelope";
export { IntentEnvelopeSchema, IntentTokenSchema, InterceptorPolicySchema } from "./schemas/intent-envelope";
export type { SovereignWorkflowContext } from "./schemas/sovereign-workflow-context";
export { minimalContext,SovereignWorkflowContextSchema } from "./schemas/sovereign-workflow-context";
export type { ThemeColors, ThemeName,Tokens } from "./tokens";
export { radius, shadows, status,themes, tokens, typeScale } from "./tokens";

// ── Jobs ───────────────────────────────────────────────────────────────────
export type { JobPage,JobRecord, JobStatus } from "./schemas/job";
export { JobPageSchema,JobSchema, JobStatusSchema } from "./schemas/job";

// ── Cloud automations: triggers, webhooks, schedules and their runs (ADR-079, ADR-084) ──
export type {
  Automation,
  AutomationRun,
  AutomationRunStatus,
  ScheduleView,
  Trigger,
  TriggerKind,
} from "./schemas/automation";
export {
  AutomationRunSchema,
  AutomationRunStatusSchema,
  AutomationSchema,
  ScheduleViewSchema,
  TriggerKindSchema,
  TriggerSchema,
} from "./schemas/automation";

// ── Billing & credits (ADR-033) ────────────────────────────────────────────
export type {
  ActorConsumption,
  BillableCapability,
  BillableUnit,
  CapabilityUsage,
  CatalogModel,
  CostEstimate,
  CreditBucket,
  Entitlement,
  EntitlementSnapshot,
  MarginPreview,
  Pack,
  PackSubscription,
  Plan,
  PricebookRate,
  Refusal,
  Subscription,
  SubscriptionStatus,
  Wallet,
} from "./schemas/billing";
export {
  ActorConsumptionSchema,
  availableCredits,
  BillableCapabilitySchema,
  BillableUnitSchema,
  capabilityForModelCategory,
  CapabilityUsageSchema,
  CatalogModelSchema,
  CostEstimateSchema,
  CreditBucketSchema,
  EntitlementSchema,
  EntitlementSnapshotSchema,
  formatCredits,
  formatPrice,
  isModelPriced,
  MarginPreviewSchema,
  PackSchema,
  PackSubscriptionSchema,
  PlanSchema,
  PricebookRateSchema,
  RefusalSchema,
  spendableCredits,
  SubscriptionSchema,
  SubscriptionStatusSchema,
  suggestedUnitFor,
  WalletSchema,
} from "./schemas/billing";
export type { PackAccess, PackCategory, PackDetail,PackKind, PackSummary, RegulatoryClass } from "./schemas/pack";
export {
  PackAccessSchema,
  PackCategorySchema,
  PackDetailSchema,
  PackKindSchema,
  PackSummarySchema,
  RegulatoryClassSchema,
} from "./schemas/pack";

// ── Studios: installable business workflows (ADR-034) ──────────────────────
export type {
  ArtefactType,
  BlueprintStatus,
  BlueprintVersion,
  ComposerInputKind,
  ComposerStudio,
  Installation,
  InstallationStatus,
  LockReason,
  Run,
  RunArtefact,
  RunOutputs,
  RunStatus,
  RunStep,
  RunStepStatus,
  StudioDetail,
  StudioPricing,
  StudioStatus,
  StudioSummary,
} from "./schemas/studio";
export {
  ArtefactTypeSchema,
  BlueprintStatusSchema,
  BlueprintVersionSchema,
  ComposerInputKindSchema,
  ComposerStudioSchema,
  InstallationSchema,
  InstallationStatusSchema,
  isTerminalRun,
  LockReasonSchema,
  RunArtefactSchema,
  RunOutputsSchema,
  RunSchema,
  RunStatusSchema,
  RunStepSchema,
  RunStepStatusSchema,
  StudioDetailSchema,
  StudioPricingSchema,
  StudioStatusSchema,
  StudioSummarySchema,
} from "./schemas/studio";

// ── Document pre-flight (web, phone and desktop share one) ─────────────────
export type { DocumentPreflight, FileKind, Inspection, PreflightRules, RejectReason } from "./preflight";
export {
  base64ToBytes,
  bytesToLatin1,
  createInspector,
  DEFAULT_MAX_BYTES,
  documentRules,
  maxPdfBytesFor,
  reasonKey,
  sniff,
} from "./preflight";
