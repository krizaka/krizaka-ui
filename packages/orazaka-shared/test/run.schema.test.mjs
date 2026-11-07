import assert from "node:assert/strict";

import { test } from "vitest";

import { JobSchema, RunSchema } from "../src/index.ts";

const run = {
  id: "5a3c0c1e-6a4a-4c58-9a57-5c5f3c0d3b11",
  installationId: null,
  studioKey: "image-generation",
  blueprintVersion: "1.2.0",
  status: "RUNNING",
  startedAt: "2026-10-16T10:00:00Z",
  finishedAt: null,
  errorMessage: null,
  outputs: [],
  steps: [
    {
      stepId: "image",
      ordinal: 0,
      jobId: "j1",
      status: "RUNNING",
      attempts: 1,
      error: null,
      startedAt: "2026-10-16T10:00:01Z",
      estimateMs: 8400,
      estimateSamples: 12,
    },
  ],
};

test("a running step carries its start and the measured estimate", () => {
  const step = RunSchema.parse(run).steps[0];
  assert.equal(step.estimateMs, 8400);
  assert.equal(step.estimateSamples, 12);
  assert.equal(step.startedAt, "2026-10-16T10:00:01Z");
});

test("an older server without timing still parses", () => {
  const timing = new Set(["startedAt", "estimateMs", "estimateSamples"]);
  const bare = Object.fromEntries(Object.entries(run.steps[0]).filter(([key]) => !timing.has(key)));
  const step = RunSchema.parse({ ...run, steps: [bare] }).steps[0];
  assert.equal(step.estimateMs, undefined);
});

test("a cancelled or deleted job is a legal state, not an error", () => {
  const job = {
    id: "a",
    userId: "u",
    featureKey: "f",
    payload: {},
    result: null,
    createdAt: "2026-10-16T10:00:00Z",
    updatedAt: "2026-10-16T10:00:00Z",
  };
  assert.equal(JobSchema.parse({ ...job, status: "CANCELLED" }).status, "CANCELLED");
  assert.equal(JobSchema.parse({ ...job, status: "DELETED" }).status, "DELETED");
});

test("a live progress event keeps its phase and step", () => {
  const job = {
    id: "a",
    userId: "u",
    featureKey: "f",
    status: "PROCESSING",
    payload: {},
    result: null,
    createdAt: "2026-10-16T10:00:00Z",
    updatedAt: "2026-10-16T10:00:00Z",
  };
  const parsed = JobSchema.parse({ ...job, phase: "generating", step: 4, steps: 10 });
  assert.equal(parsed.phase, "generating");
  assert.equal(parsed.steps, 10);
});
