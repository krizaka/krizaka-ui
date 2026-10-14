// The hooks: the same cadence for a web component and a React Native screen. Client.
import * as React from "react";

import { createQueue, debounce, type Paced, type Queue, type QueueOptions, throttle, type TimingOptions } from "./index.js";

/** `value`, once it has stopped changing for `wait` ms. The first render shows `value` itself. */
export function useDebouncedValue<T>(value: T, wait: number, options?: Pick<TimingOptions, "leading">): T {
  const [debounced, setDebounced] = React.useState(value);
  const [paced] = React.useState(() => debounce(setDebounced, wait, options));
  React.useEffect(() => paced.setWait(wait), [paced, wait]);
  React.useEffect(() => {
    paced(value);
  }, [paced, value]);
  React.useEffect(() => () => paced.cancel(), [paced]);
  return wait <= 0 ? value : debounced;
}

function usePaced<A extends unknown[]>(make: typeof debounce, callback: (...args: A) => void, wait: number, options?: TimingOptions): Paced<A> {
  // The paced function is made once and calls whatever `callback` is now: it stays the same function for the life of the component.
  const latest = React.useRef(callback);
  React.useLayoutEffect(() => {
    latest.current = callback;
  });
  // eslint-disable-next-line react-hooks/refs -- the ref is read when the paced function is called, never during render
  const [paced] = React.useState(() => make((...args: A) => latest.current(...args), wait, options));
  React.useEffect(() => paced.setWait(wait), [paced, wait]);
  React.useEffect(() => () => paced.cancel(), [paced]);
  return paced;
}

/** A stable function that calls `callback` once `wait` ms have passed without a new call; `cancel()` and `flush()` come with it. */
export function useDebouncedCallback<A extends unknown[]>(callback: (...args: A) => void, wait: number, options?: TimingOptions): Paced<A> {
  return usePaced(debounce, callback, wait, options);
}

/** A stable function that calls `callback` at most once every `wait` ms. */
export function useThrottledCallback<A extends unknown[]>(callback: (...args: A) => void, wait: number, options?: TimingOptions): Paced<A> {
  return usePaced(throttle, callback, wait, options);
}

/**
 * A queue that lives as long as the component and is aborted when it leaves; `options` reach it on every render. Read
 * it with `useQueueSnapshot(queue)`.
 */
export function useQueue<M = undefined>(options: QueueOptions = {}): Queue<M> {
  const [queue] = React.useState(() => createQueue<M>(options));
  React.useLayoutEffect(() => queue.configure(options));
  React.useEffect(() => () => queue.dispose(), [queue]);
  return queue;
}

/** The jobs of a queue, re-rendered when one changes. */
export function useQueueSnapshot<M>(queue: Queue<M>) {
  return React.useSyncExternalStore(queue.subscribe, queue.snapshot, queue.snapshot);
}
