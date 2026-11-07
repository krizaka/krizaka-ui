import { z } from "zod";

/**
 * Cloud automations (ADR-079, ADR-084): what runs (a Studio and its fixed inputs), how it starts (a signed webhook or
 * a schedule) and the history of its runs. One contract for the web client and any other client of the automation API.
 */

/** A cloud automation: a Studio with fixed inputs that its triggers start. */
export const AutomationSchema = z.object({
  id: z.string(),
  name: z.string(),
  studioKey: z.string(),
  inputs: z.record(z.string(), z.unknown()).catch({}),
  enabled: z.boolean(),
  /** ISO-8601. */
  createdAt: z.string(),
  /** ISO-8601. */
  updatedAt: z.string(),
});
export type Automation = z.infer<typeof AutomationSchema>;

export const TriggerKindSchema = z.enum(["webhook", "schedule"]);
export type TriggerKind = z.infer<typeof TriggerKindSchema>;

/** « Daily at a time in a zone, on these weekdays ». */
export const ScheduleViewSchema = z.object({
  /** `HH:mm`. */
  time: z.string(),
  /** A region id such as `America/Toronto`. */
  zone: z.string(),
  /** `MON`…`SUN`, in week order. */
  days: z.array(z.string()),
});
export type ScheduleView = z.infer<typeof ScheduleViewSchema>;

/**
 * A trigger. `secret` is present only in the answer that creates a webhook trigger or rotates its secret — shown
 * once, never returned by a read; `secretHint` is its last characters, to tell two secrets apart.
 */
export const TriggerSchema = z.object({
  id: z.string(),
  automationId: z.string(),
  kind: TriggerKindSchema,
  enabled: z.boolean(),
  /** The address a sender calls (webhook only). */
  webhookUrl: z.string().nullish(),
  secretHint: z.string().nullish(),
  secret: z.string().nullish(),
  schedule: ScheduleViewSchema.nullish(),
  catchUp: z.enum(["once", "skip"]),
  nextFireAt: z.string().nullish(),
  lastFiredAt: z.string().nullish(),
  createdAt: z.string(),
});
export type Trigger = z.infer<typeof TriggerSchema>;

export const AutomationRunStatusSchema = z.enum(["queued", "running", "succeeded", "failed", "skipped_budget"]);
export type AutomationRunStatus = z.infer<typeof AutomationRunStatusSchema>;

/** One run of the history. `payload` (the webhook body it was started with) is in the detail of a run only. */
export const AutomationRunSchema = z.object({
  id: z.string(),
  automationId: z.string(),
  automationName: z.string().nullish(),
  triggerId: z.string().nullish(),
  trigger: TriggerKindSchema.nullish(),
  status: AutomationRunStatusSchema,
  /** The Studio run it started, once the engine accepted it. */
  studioRunId: z.string().nullish(),
  errorCode: z.string().nullish(),
  errorMessage: z.string().nullish(),
  webhookId: z.string().nullish(),
  payloadBytes: z.number().int().nonnegative().nullish(),
  startedAt: z.string(),
  finishedAt: z.string().nullish(),
  payload: z.record(z.string(), z.unknown()).nullish(),
});
export type AutomationRun = z.infer<typeof AutomationRunSchema>;
