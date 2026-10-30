// Runs one task per item with at most `concurrency` at a time and waits for all of them: the answer keeps the order of the items,
// and a failure of one task never stops the others (each outcome is its own `PromiseSettledResult`). Framework-free; for a line the
// person controls (pause, retry, progress) use `createQueue`.

export type MapConcurrentOptions = {
  /** How many tasks run at once. Default 3. */
  concurrency?: number;
  /** Aborting it starts nothing new (the tasks under way are yours to stop with the same signal); the tasks not started are rejected with its reason. */
  signal?: AbortSignal;
};

// @fixed: three parallel uploads keep a phone's uplink busy without starving the page's own requests — a default, overridable.
const DEFAULT_CONCURRENCY = 3;

/** `Promise.allSettled` with a limit: `task(item, index)` for each item, at most `concurrency` at once, results in the items' order. */
export async function mapConcurrent<T, R>(items: readonly T[], task: (item: T, index: number) => Promise<R>, options: MapConcurrentOptions = {}): Promise<PromiseSettledResult<R>[]> {
  const { signal } = options;
  const width = Math.max(1, Math.min(options.concurrency ?? DEFAULT_CONCURRENCY, items.length));
  const results = new Array<PromiseSettledResult<R>>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      if (signal?.aborted) {
        results[index] = { status: "rejected", reason: signal.reason };
        continue;
      }
      try {
        results[index] = { status: "fulfilled", value: await task(items[index] as T, index) };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  };
  await Promise.all(Array.from({ length: width }, worker));
  return results;
}
