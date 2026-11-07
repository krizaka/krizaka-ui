import assert from "node:assert/strict";

import { test } from "vitest";

import { AutomationRunSchema, AutomationSchema, TriggerSchema } from "../src/index.ts";

const automation = {
  id: "0b2f6e0a-9f3a-4a3e-8f55-2c1b9a1a0001",
  name: "Lease check on request",
  studioKey: "compliance-check",
  inputs: { jurisdiction: "QC" },
  enabled: true,
  createdAt: "2026-10-20T12:00:00Z",
  updatedAt: "2026-10-20T12:00:00Z",
};

test("an automation of the API parses as returned", () => {
  assert.equal(AutomationSchema.parse(automation).studioKey, "compliance-check");
});

test("inputs that are not an object read as none rather than breaking the list", () => {
  assert.deepEqual(AutomationSchema.parse({ ...automation, inputs: "oops" }).inputs, {});
});

test("a webhook trigger carries its secret once; a read has none", () => {
  const created = TriggerSchema.parse({
    id: "t1",
    automationId: automation.id,
    kind: "webhook",
    enabled: true,
    webhookUrl: "https://dev.orazaka.com/edge/hooks/t1",
    secretHint: "ab12",
    secret: ["whsec", "A".repeat(43) + "="].join("_"),
    catchUp: "once",
    createdAt: "2026-10-20T12:00:00Z",
  });
  assert.match(created.secret, /^whsec_/);
  const read = TriggerSchema.parse({ ...created, secret: undefined });
  assert.equal(read.secret, undefined);
});

test("a schedule trigger has its slot", () => {
  const trigger = TriggerSchema.parse({
    id: "t2",
    automationId: automation.id,
    kind: "schedule",
    enabled: true,
    schedule: { time: "08:00", zone: "America/Toronto", days: ["MON", "TUE"] },
    catchUp: "skip",
    nextFireAt: "2026-10-21T12:00:00Z",
    createdAt: "2026-10-20T12:00:00Z",
  });
  assert.deepEqual(trigger.schedule.days, ["MON", "TUE"]);
});

test("a trigger of an unknown kind is refused rather than shown as something it is not", () => {
  assert.throws(() =>
    TriggerSchema.parse({ id: "t", automationId: "a", kind: "email", enabled: true, catchUp: "once", createdAt: "x" }),
  );
});

test("a run parses; its status is one of the states the service reaches", () => {
  const run = AutomationRunSchema.parse({
    id: "r1",
    automationId: automation.id,
    automationName: "Lease check on request",
    trigger: "webhook",
    status: "running",
    studioRunId: "s1",
    startedAt: "2026-10-20T12:00:01Z",
  });
  assert.equal(run.status, "running");
  assert.throws(() => AutomationRunSchema.parse({ ...run, status: "lost" }));
});
