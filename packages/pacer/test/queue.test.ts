import { createQueue, type JobContext, type JobSnapshot } from "../src";

/** A job the test finishes by hand. */
function manual() {
  const calls: { context: JobContext; resolve: () => void; reject: (error: Error) => void }[] = [];
  const run = (context: JobContext) =>
    new Promise<void>((resolve, reject) => {
      calls.push({ context, resolve, reject });
      context.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
    });
  return { run, calls };
}
const statuses = (jobs: readonly JobSnapshot<unknown>[]) => jobs.map((j) => `${j.id}:${j.status}`);
const flush = () => vi.advanceTimersByTimeAsync(0);

describe("createQueue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("runs `concurrency` jobs at once and starts the next when one finishes", async () => {
    const q = createQueue({ concurrency: 2 });
    const work = manual();
    for (const id of ["a", "b", "c"]) q.add(work.run, { id, meta: undefined });
    expect(statuses(q.snapshot())).toEqual(["a:running", "b:running", "c:queued"]);
    work.calls[0].resolve();
    await flush();
    expect(statuses(q.snapshot())).toEqual(["a:done", "b:running", "c:running"]);
    expect(q.isPaused).toBe(false);
  });

  it("starts higher priorities first and keeps the order of equals", () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    q.add(work.run, { id: "first", meta: undefined });
    q.add(work.run, { id: "low", meta: undefined });
    q.add(work.run, { id: "urgent", priority: 5, meta: undefined });
    q.add(work.run, { id: "low2", meta: undefined });
    expect(q.snapshot().map((j) => j.id)).toEqual(["urgent", "first", "low", "low2"]);
    expect(statuses(q.snapshot())[1]).toBe("first:running");
  });

  it("refuses an id that exists, and makes one when none is given", () => {
    const q = createQueue();
    const work = manual();
    const id = q.add(work.run, { meta: undefined });
    expect(id).toMatch(/^job-/);
    q.add(work.run, { id: "x", meta: undefined });
    expect(() => q.add(work.run, { id: "x", meta: undefined })).toThrow(/already/);
  });

  it("pauses a running job (its signal is aborted), frees its place, and resumes it with resumed: true", async () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    q.add(work.run, { id: "b", meta: undefined });
    q.pause("a");
    expect(work.calls[0].context.signal.aborted).toBe(true);
    await flush();
    expect(statuses(q.snapshot())).toEqual(["a:paused", "b:running"]);
    work.calls[1].resolve();
    await flush();
    q.resume("a");
    expect(work.calls[2].context.resumed).toBe(true);
    expect(statuses(q.snapshot())).toEqual(["a:running", "b:done"]);
  });

  it("holds a queued job too, and ignores pause on a finished one", async () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    q.add(work.run, { id: "b", meta: undefined });
    q.pause("b");
    work.calls[0].resolve();
    await flush();
    expect(statuses(q.snapshot())).toEqual(["a:done", "b:paused"]);
    q.pause("a");
    q.pause("missing");
    expect(statuses(q.snapshot())[0]).toBe("a:done");
    q.resume("a");
    expect(statuses(q.snapshot())[0]).toBe("a:done");
  });

  it("records a failure and retries it by hand", async () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    work.calls[0].reject(new Error("disk full"));
    await flush();
    expect(q.snapshot()[0]).toMatchObject({ status: "error", error: expect.objectContaining({ message: "disk full" }) });
    q.retry("a");
    expect(q.snapshot()[0].status).toBe("running");
    expect(work.calls[1].context.resumed).toBe(true);
    expect(q.snapshot()[0].error).toBeUndefined();
  });

  it("wraps what is not an Error", async () => {
    const q = createQueue();
    q.add(() => Promise.reject("plain"), { id: "a", meta: undefined });
    await flush();
    expect(q.snapshot()[0].error?.message).toBe("plain");
  });

  it("retries a failure with a backoff, up to `retries`, then reports it", async () => {
    const q = createQueue({ retries: 2, backoff: { kind: "fixed", baseMs: 100 } });
    const run = vi.fn((context: JobContext) => Promise.reject(new Error(`attempt ${context.attempt}`)));
    q.add(run, { id: "a", meta: undefined });
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(100);
    expect(run).toHaveBeenCalledTimes(2);
    expect(q.snapshot()[0].attempt).toBe(2);
    await vi.advanceTimersByTimeAsync(100);
    expect(run).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(0);
    expect(q.snapshot()[0]).toMatchObject({ status: "error", attempt: 3 });
    expect(q.snapshot()[0].error?.message).toBe("attempt 3");
    expect(run.mock.calls[1][0].resumed).toBe(true);
  });

  it("succeeds on a retry", async () => {
    const q = createQueue({ retries: 3, backoff: { kind: "linear", baseMs: 10, maxMs: 15, jitter: 0 } });
    let n = 0;
    q.add(() => (++n < 3 ? Promise.reject(new Error("flaky")) : Promise.resolve()), { id: "a", meta: undefined });
    await vi.advanceTimersByTimeAsync(100);
    expect(q.snapshot()[0]).toMatchObject({ status: "done", attempt: 3 });
  });

  it("does not retry an error that shouldRetry refuses", async () => {
    const q = createQueue({ retries: 5, backoff: { baseMs: 10 }, shouldRetry: (error) => error.message !== "forbidden" });
    const run = vi.fn(() => Promise.reject(new Error("forbidden")));
    q.add(run, { id: "a", meta: undefined });
    await vi.advanceTimersByTimeAsync(1_000);
    expect(run).toHaveBeenCalledTimes(1);
    expect(q.snapshot()[0].status).toBe("error");
  });

  it("retries an error that shouldRetry accepts", async () => {
    const shouldRetry = vi.fn(() => true);
    const q = createQueue({ retries: 1, backoff: { baseMs: 10 }, shouldRetry });
    const run = vi.fn(() => Promise.reject(new Error("again")));
    q.add(run, { id: "a", meta: undefined });
    await vi.advanceTimersByTimeAsync(1_000);
    expect(run).toHaveBeenCalledTimes(2);
    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 1);
  });

  it("cancels a job whatever it is doing, and removes a finished one", async () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    q.add(work.run, { id: "b", meta: undefined });
    q.cancel("a");
    expect(work.calls[0].context.signal.aborted).toBe(true);
    await flush();
    expect(statuses(q.snapshot())).toEqual(["b:running"]);
    work.calls[1].resolve();
    await flush();
    q.remove("b");
    q.remove("missing");
    expect(q.snapshot()).toEqual([]);
  });

  it("does not let a cancelled job's late result change anything", async () => {
    const q = createQueue();
    let finish: () => void = () => {};
    q.add(() => new Promise<void>((resolve) => (finish = resolve)), { id: "a", meta: undefined });
    q.cancel("a");
    finish();
    await flush();
    expect(q.snapshot()).toEqual([]);
  });

  it("updates a job's meta (a value or a function) and tells the subscribers", () => {
    const q = createQueue<{ progress: number }>();
    const work = manual();
    const listener = vi.fn();
    const off = q.subscribe(listener);
    q.add(work.run, { id: "a", meta: { progress: 0 } });
    q.update("a", { progress: 0.5 });
    q.update("a", (m) => ({ progress: m.progress + 0.25 }));
    q.update("missing", { progress: 1 });
    expect(q.snapshot()[0].meta).toEqual({ progress: 0.75 });
    const calls = listener.mock.calls.length;
    off();
    q.update("a", { progress: 1 });
    expect(listener.mock.calls.length).toBe(calls);
  });

  it("keeps the same snapshot until something changes", () => {
    const q = createQueue();
    const first = q.snapshot();
    expect(q.snapshot()).toBe(first);
    q.add(manual().run, { meta: undefined });
    expect(q.snapshot()).not.toBe(first);
  });

  it("starts nothing while paused, and everything on resumeAll", () => {
    const q = createQueue({ paused: true });
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    expect(q.isPaused).toBe(true);
    expect(work.calls).toHaveLength(0);
    q.pauseAll();
    q.resumeAll();
    expect(work.calls).toHaveLength(1);
    expect(q.isPaused).toBe(false);
  });

  it("takes a new concurrency for what starts next", () => {
    const q = createQueue({ concurrency: 1 });
    const work = manual();
    for (const id of ["a", "b", "c"]) q.add(work.run, { id, meta: undefined });
    q.configure({ concurrency: 3 });
    expect(work.calls).toHaveLength(3);
  });

  it("aborts everything on dispose, and can be used again", () => {
    const q = createQueue();
    const work = manual();
    q.add(work.run, { id: "a", meta: undefined });
    q.dispose();
    expect(work.calls[0].context.signal.aborted).toBe(true);
    expect(q.snapshot()).toEqual([]);
    q.add(work.run, { id: "a", meta: undefined });
    expect(q.snapshot()).toHaveLength(1);
  });
});
