import { RateLimiter, retryAtOf } from "../src";

const NOW = 1_000_000;

describe("retryAtOf", () => {
  it("reads a Problem Details body", () => {
    expect(retryAtOf({ retryAt: 5_000 }, NOW)).toBe(5_000);
    expect(retryAtOf({ retryAt: "2026-10-14T12:00:00Z" }, NOW)).toBe(Date.parse("2026-10-14T12:00:00Z"));
    expect(retryAtOf({ retryAfterSeconds: 3 }, NOW)).toBe(NOW + 3_000);
    expect(retryAtOf({ retryAfter: 2 }, NOW)).toBe(NOW + 2_000);
  });

  it("reads a Retry-After header: seconds or an HTTP date, on Headers, a Response or a body's headers", () => {
    expect(retryAtOf(new Headers({ "retry-after": "7" }), NOW)).toBe(NOW + 7_000);
    expect(retryAtOf(new Response(null, { status: 429, headers: { "retry-after": "Wed, 14 Oct 2026 12:00:00 GMT" } }), NOW)).toBe(Date.parse("Wed, 14 Oct 2026 12:00:00 GMT"));
    expect(retryAtOf({ headers: new Headers({ "retry-after": "1" }) }, NOW)).toBe(NOW + 1_000);
    expect(retryAtOf({ retryAfter: "4" }, NOW)).toBe(NOW + 4_000);
  });

  it("says nothing when there is nothing to read", () => {
    expect(retryAtOf({}, NOW)).toBeUndefined();
    expect(retryAtOf({ retryAt: "not a date" }, NOW)).toBeUndefined();
    expect(retryAtOf(new Headers({ "retry-after": "soon" }), NOW)).toBeUndefined();
    expect(retryAtOf(new Headers(), NOW)).toBeUndefined();
  });

  it("uses the clock when none is given", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    expect(retryAtOf({ retryAfterSeconds: 1 })).toBe(NOW + 1_000);
    vi.useRealTimers();
  });
});

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it("lets `limit` calls through per window, then asks to wait", () => {
    const limiter = new RateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.remaining).toBe(2);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(false);
    expect(limiter.remaining).toBe(0);
    expect(limiter.msUntilAvailable()).toBeGreaterThan(0);
    vi.advanceTimersByTime(1001);
    expect(limiter.msUntilAvailable()).toBe(0);
    expect(limiter.tryAcquire()).toBe(true);
  });

  it("is held by what the server said, and a later hold wins", () => {
    const limiter = RateLimiter.fromProblemDetails({ retryAfterSeconds: 5 }, { limit: 10, now: NOW });
    expect(limiter.tryAcquire()).toBe(false);
    expect(limiter.remaining).toBe(0);
    expect(limiter.msUntilAvailable()).toBe(5_000);
    limiter.blockUntil(NOW + 1_000);
    expect(limiter.msUntilAvailable()).toBe(5_000);
    vi.advanceTimersByTime(5_000);
    expect(limiter.tryAcquire()).toBe(true);
  });

  it("is not held by a hint that says nothing", () => {
    const limiter = RateLimiter.fromProblemDetails({}, { limit: 1 });
    expect(limiter.tryAcquire()).toBe(true);
  });

  it("waits for its turn, then takes it", async () => {
    const limiter = RateLimiter.fromProblemDetails({ retryAfterSeconds: 2 }, { now: NOW });
    let done = false;
    const waiting = limiter.wait().then(() => (done = true));
    await vi.advanceTimersByTimeAsync(1_999);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(2);
    await waiting;
    expect(done).toBe(true);
    expect(limiter.remaining).toBe(0);
  });

  it("waits for the window when it is full, and returns at once when it may go", async () => {
    const limiter = new RateLimiter({ limit: 1, windowMs: 500 });
    await limiter.wait();
    const second = limiter.wait();
    await vi.advanceTimersByTimeAsync(600);
    await second;
  });

  it("stops waiting when the signal is aborted", async () => {
    const limiter = RateLimiter.fromProblemDetails({ retryAfterSeconds: 60 }, { now: NOW });
    const controller = new AbortController();
    const waiting = limiter.wait(controller.signal);
    const rejected = expect(waiting).rejects.toThrow("stop");
    controller.abort(new Error("stop"));
    await rejected;
    await expect(limiter.wait(controller.signal)).rejects.toThrow("stop");
  });

  it("resets the window and the hold", () => {
    const limiter = RateLimiter.fromProblemDetails({ retryAfterSeconds: 60 }, { now: NOW });
    limiter.reset();
    expect(limiter.tryAcquire()).toBe(true);
  });
});
