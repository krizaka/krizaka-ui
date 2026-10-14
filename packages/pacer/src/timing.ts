// Debounce and throttle as plain functions, on TanStack Pacer's Debouncer and Throttler. A wait of 0 (or less) calls
// through at once — the same contract the primitives of @krizaka/ui had before they moved here.
import { Debouncer } from "@tanstack/pacer/debouncer";
import { Throttler } from "@tanstack/pacer/throttler";

export type TimingOptions = {
  /** Run on the first call of a burst. Default `false` for a debounce, `true` for a throttle. */
  leading?: boolean;
  /** Run once more after the burst (with the last arguments). Default `true`. */
  trailing?: boolean;
};

/** A function that waits, with the controls of what is waiting. */
export type Paced<A extends unknown[]> = {
  (...args: A): void;
  /** Drops the pending call. */
  cancel: () => void;
  /** Runs the pending call now. */
  flush: () => void;
  /** Whether a call is waiting. */
  readonly pending: boolean;
  /** Changes the wait (ms) for the next calls. */
  setWait: (wait: number) => void;
};

/** Adds the controls to a paced function; `pending` is read live (a getter copied by `Object.assign` would freeze). */
function withPending<A extends unknown[]>(paced: (...args: A) => void, pending: () => boolean, controls: Omit<Paced<A>, "pending">): Paced<A> {
  return Object.defineProperty(Object.assign(paced, controls), "pending", { get: pending, enumerable: true }) as Paced<A>;
}

/** Calls `fn` once `wait` ms have passed without a new call (the last arguments win). */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number, options: TimingOptions = {}): Paced<A> {
  let ms = wait;
  let pending = false;
  const debouncer = new Debouncer<(...args: A) => void>(fn, {
    wait: () => ms,
    leading: options.leading ?? false,
    trailing: options.trailing ?? true,
    onExecute: () => {
      pending = false;
    },
  });
  const paced = (...args: A) => {
    if (ms <= 0) return fn(...args);
    pending = options.trailing !== false;
    debouncer.maybeExecute(...args);
  };
  return withPending(paced, () => pending, {
    cancel: () => {
      pending = false;
      debouncer.cancel();
    },
    flush: () => debouncer.flush(),
    setWait: (next: number) => {
      ms = next;
    },
  });
}

/** Calls `fn` at most once every `wait` ms (the first call at once, the last arguments after the pause). */
export function throttle<A extends unknown[]>(fn: (...args: A) => void, wait: number, options: TimingOptions = {}): Paced<A> {
  let ms = wait;
  let pending = false;
  const throttler = new Throttler<(...args: A) => void>(fn, {
    wait: () => ms,
    leading: options.leading ?? true,
    trailing: options.trailing ?? true,
    onExecute: () => {
      pending = false;
    },
  });
  const paced = (...args: A) => {
    if (ms <= 0) return fn(...args);
    pending = options.trailing !== false;
    throttler.maybeExecute(...args);
  };
  return withPending(paced, () => pending, {
    cancel: () => {
      pending = false;
      throttler.cancel();
    },
    flush: () => throttler.flush(),
    setWait: (next: number) => {
      ms = next;
    },
  });
}
