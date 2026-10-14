import { debounce, throttle } from "../src";

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls once, with the last arguments, after the pause", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d("a");
    d("b");
    expect(d.pending).toBe(true);
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
    expect(d.pending).toBe(false);
  });

  it("cancels and flushes the pending call", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d(1);
    d.cancel();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    d(2);
    d.flush();
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("can run on the leading edge only", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100, { leading: true, trailing: false });
    d("first");
    d("second");
    vi.advanceTimersByTime(200);
    expect(fn.mock.calls).toEqual([["first"]]);
  });

  it("calls through at once for a wait of 0, and follows setWait", () => {
    const fn = vi.fn();
    const d = debounce(fn, 0);
    d("now");
    expect(fn).toHaveBeenCalledWith("now");
    d.setWait(50);
    d("later");
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledWith("later");
  });
});

describe("throttle", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("runs the first call at once and the last one after the pause", () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t(1);
    t(2);
    t(3);
    expect(fn.mock.calls).toEqual([[1]]);
    expect(t.pending).toBe(true);
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([[1], [3]]);
  });

  it("cancels, flushes, and calls through for a wait of 0", () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t("a");
    t("b");
    t.cancel();
    vi.advanceTimersByTime(200);
    expect(fn.mock.calls).toEqual([["a"]]);
    vi.advanceTimersByTime(200);
    t("c");
    t("d");
    t.flush();
    expect(fn).toHaveBeenLastCalledWith("d");
    t.setWait(0);
    t("e");
    expect(fn).toHaveBeenLastCalledWith("e");
  });
});
