import type { TauriBridge } from "../src";

/** A bridge that records the calls and lets a test send events, as the native side would. */
export function fakeBridge(answers: Record<string, unknown> = {}) {
  const calls: { command: string; args?: Record<string, unknown> }[] = [];
  const listeners = new Map<string, Set<(event: { payload: unknown }) => void>>();
  const bridge: TauriBridge = {
    async invoke<T>(command: string, args?: Record<string, unknown>) {
      calls.push(args === undefined ? { command } : { command, args });
      return answers[command] as T;
    },
    async listen<T>(event: string, handler: (event: { payload: T }) => void) {
      const set = listeners.get(event) ?? new Set();
      const wrapped = handler as (event: { payload: unknown }) => void;
      set.add(wrapped);
      listeners.set(event, set);
      return () => void set.delete(wrapped);
    },
  };
  const send = (event: string, payload: unknown) => listeners.get(event)?.forEach((handler) => handler({ payload }));
  return { bridge, calls, send, listening: (event: string) => listeners.get(event)?.size ?? 0 };
}
