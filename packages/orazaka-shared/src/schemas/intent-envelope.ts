/**
 * @file intent-envelope.ts
 * @description Zod validation schemas for IntentEnvelope and IntentToken.
 * Mirrors the Java records in com.krizaka.orazaka.gateway.domain.model.intent.
 * Shared between all client packages via orazaka-shared.
 */

import { z } from "zod";

/**
 * IntentEnvelope — canonical input for the Sovereign Intent Router.
 */
export const IntentEnvelopeSchema = z.object({
  intentId: z.string().min(1, "intentId must not be empty"),
  userId: z.string().min(1, "userId must not be empty"),
  payload: z.string().min(1, "payload must not be empty"),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type IntentEnvelope = z.infer<typeof IntentEnvelopeSchema>;

/**
 * IntentToken — signed output of Level 0 gate evaluation.
 */
export const IntentTokenSchema = z.object({
  tokenValue: z.string().min(1, "tokenValue must not be empty"),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  gateDecision: z.string().min(1, "gateDecision must not be empty"),
});

export type IntentToken = z.infer<typeof IntentTokenSchema>;

/**
 * InterceptorPolicy — data-driven governance record.
 */
export const InterceptorPolicySchema = z.object({
  id: z.string().uuid(),
  interceptorName: z.string().min(1),
  executionOrder: z.number().int().nonnegative(),
  enabled: z.boolean(),
  predicates: z
    .array(
      z.object({
        field: z.string().min(1),
        operator: z.enum([
          "EQUALS",
          "NOT_EQUALS",
          "GREATER_THAN",
          "LESS_THAN",
          "GREATER_THAN_OR_EQUAL",
          "LESS_THAN_OR_EQUAL",
          "CONTAINS",
          "IN",
        ]),
        value: z.string(),
      }),
    )
    .default([]),
});

export type InterceptorPolicy = z.infer<typeof InterceptorPolicySchema>;

export type PolicyPredicate = InterceptorPolicy["predicates"][number];
