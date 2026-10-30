import { describe, expect, it } from "vitest";

import { mapConcurrent } from "../src/map-concurrent";

const tick = () => new Promise((resolve) => setTimeout(resolve, 1));

describe("mapConcurrent", () => {
  it("keeps the order of the items whatever the order of the ends", async () => {
    const results = await mapConcurrent([30, 1, 10], async (ms, index) => {
      await new Promise((resolve) => setTimeout(resolve, ms));
      return index;
    });
    expect(results.map((r) => (r.status === "fulfilled" ? r.value : null))).toEqual([0, 1, 2]);
  });

  it("never runs more than the limit at once", async () => {
    let running = 0;
    let peak = 0;
    await mapConcurrent([1, 2, 3, 4, 5, 6, 7], async () => {
      running += 1;
      peak = Math.max(peak, running);
      await tick();
      running -= 1;
    }, { concurrency: 2 });
    expect(peak).toBe(2);
  });

  it("settles every task: a failure does not stop the others", async () => {
    const results = await mapConcurrent(["a", "b", "c"], async (item) => {
      if (item === "b") throw new Error("boom");
      return item;
    });
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "rejected", "fulfilled"]);
    expect((results[1] as PromiseRejectedResult).reason.message).toBe("boom");
  });

  it("starts nothing new once the signal is aborted", async () => {
    const controller = new AbortController();
    const started: number[] = [];
    const results = await mapConcurrent([0, 1, 2, 3], async (item) => {
      started.push(item);
      controller.abort(new Error("stop"));
      await tick();
    }, { concurrency: 1, signal: controller.signal });
    expect(started).toEqual([0]);
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "rejected", "rejected", "rejected"]);
  });

  it("answers an empty list", async () => {
    expect(await mapConcurrent([], async () => 1)).toEqual([]);
  });
});
