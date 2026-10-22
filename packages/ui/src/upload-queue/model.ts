// Headless: the vocabulary and the arithmetic of an upload queue (what each row is doing, what the tray says).

/** Where a file is: waiting, being read, being checked, finished well, or not. */
export const QueueStatus = { Queued: "queued", Reading: "reading", Checking: "checking", Done: "done", Failed: "failed" } as const;
export type QueueStatus = (typeof QueueStatus)[keyof typeof QueueStatus];

/** A row while it works: the shimmer and the live progress belong to these states only. */
export function isWorking(status: QueueStatus): boolean {
  return status === QueueStatus.Reading || status === QueueStatus.Checking;
}

export interface QueueTally {
  total: number;
  working: number;
  queued: number;
  done: number;
  failed: number;
}

/** What the tray's header says: how many are working, finished, failed. */
export function tally(items: readonly { status: QueueStatus }[]): QueueTally {
  const count = (test: (status: QueueStatus) => boolean) => items.filter((item) => test(item.status)).length;
  return {
    total: items.length,
    working: count(isWorking),
    queued: count((s) => s === QueueStatus.Queued),
    done: count((s) => s === QueueStatus.Done),
    failed: count((s) => s === QueueStatus.Failed),
  };
}

/** The progress of a row clamped to 0–1, or `undefined` when it has none (an indeterminate wait). */
export function progressOf(value: number | undefined): number | undefined {
  return value === undefined || Number.isNaN(value) ? undefined : Math.min(1, Math.max(0, value));
}
