import { act, renderHook } from "@testing-library/react";

import { createQueue } from "../src";
import { useDebouncedCallback, useDebouncedValue, useQueue, useQueueSnapshot, useThrottledCallback } from "../src/react";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebouncedValue", () => {
  it("follows the value once it stops changing", () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 200), { initialProps: { v: "a" } });
    expect(result.current).toBe("a");
    rerender({ v: "ab" });
    rerender({ v: "abc" });
    expect(result.current).toBe("a");
    act(() => void vi.advanceTimersByTime(200));
    expect(result.current).toBe("abc");
  });

  it("returns the value itself for a wait of 0", () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 0), { initialProps: { v: 1 } });
    rerender({ v: 2 });
    expect(result.current).toBe(2);
  });

  it("drops the pending value when the component leaves", () => {
    const { result, rerender, unmount } = renderHook(({ v }) => useDebouncedValue(v, 100), { initialProps: { v: 1 } });
    rerender({ v: 2 });
    unmount();
    act(() => void vi.advanceTimersByTime(200));
    expect(result.current).toBe(1);
  });
});

describe("useDebouncedCallback", () => {
  it("is stable, calls the latest callback, and cancels on unmount", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender, unmount } = renderHook(({ cb }) => useDebouncedCallback(cb, 100), { initialProps: { cb: first } });
    const handle = result.current;
    result.current("x");
    rerender({ cb: second });
    expect(result.current).toBe(handle);
    act(() => void vi.advanceTimersByTime(100));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("x");
    result.current("y");
    unmount();
    act(() => void vi.advanceTimersByTime(100));
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("follows a new wait", () => {
    const cb = vi.fn();
    const { result, rerender } = renderHook(({ wait }) => useDebouncedCallback(cb, wait), { initialProps: { wait: 100 } });
    rerender({ wait: 0 });
    result.current("now");
    expect(cb).toHaveBeenCalledWith("now");
  });
});

describe("useThrottledCallback", () => {
  it("calls at most once per wait", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(cb, 100));
    result.current(1);
    result.current(2);
    expect(cb.mock.calls).toEqual([[1]]);
    act(() => void vi.advanceTimersByTime(100));
    expect(cb.mock.calls).toEqual([[1], [2]]);
  });
});

describe("useQueue", () => {
  it("makes a queue, hands it the options of every render, and re-renders on a change", () => {
    const run = () => new Promise<void>(() => {});
    const { result, rerender } = renderHook(({ concurrency }) => {
      const queue = useQueue<string>({ concurrency });
      return { queue, jobs: useQueueSnapshot(queue) };
    }, { initialProps: { concurrency: 1 } });
    act(() => {
      result.current.queue.add(run, { id: "a", meta: "A" });
      result.current.queue.add(run, { id: "b", meta: "B" });
    });
    expect(result.current.jobs.map((j) => j.status)).toEqual(["running", "queued"]);
    rerender({ concurrency: 2 });
    expect(result.current.jobs.map((j) => j.status)).toEqual(["running", "running"]);
  });

  it("aborts its jobs when the component leaves", () => {
    let signal: AbortSignal | undefined;
    const { result, unmount } = renderHook(() => useQueue());
    act(() => void result.current.add((c) => ((signal = c.signal), new Promise<void>(() => {})), { meta: undefined }));
    unmount();
    expect(signal?.aborted).toBe(true);
  });

  it("reads a queue made elsewhere", () => {
    const queue = createQueue<number>();
    const { result } = renderHook(() => useQueueSnapshot(queue));
    act(() => void queue.add(() => new Promise<void>(() => {}), { id: "z", meta: 1 }));
    expect(result.current[0].id).toBe("z");
  });
});
