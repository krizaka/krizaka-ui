import assert from "node:assert/strict";

import { test } from "vitest";

import { JobPageSchema, JobSchema } from "../src/index.ts";

const job = {
  id: "a43ebd5a",
  userId: "1c10ee07",
  featureKey: "orazaka.core.media.image",
  status: "COMPLETED",
  payload: { prompt: "A ceramic lamp" },
  result: { url: "/api/v1/assets/a43ebd5a/image.png" },
  createdAt: "2026-10-11T06:30:12Z",
  updatedAt: "2026-10-11T06:31:22Z",
};

test("a job of the job service parses as returned", () => {
  assert.deepEqual(JobSchema.parse(job).result, job.result);
});

test("a running job has no result yet: it reads as an empty one", () => {
  assert.deepEqual(JobSchema.parse({ ...job, status: "PROCESSING", result: null }).result, {});
});

test("an unknown status is refused rather than shown as something it is not", () => {
  assert.throws(() => JobSchema.parse({ ...job, status: "LOST" }));
});

test("a page defaults its totals", () => {
  assert.deepEqual(JobPageSchema.parse({ content: [job] }).totalElements, 0);
});
