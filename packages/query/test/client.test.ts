import { QueryObserver } from "@tanstack/react-query";

import { createQueryClient, retryDelay, shouldRetry, throwUnlessList } from "../src/client";
import { KrizakaApiError } from "../src/errors";

const NOW = 1_000_000;
const err = (status: number, extra: Partial<ConstructorParameters<typeof KrizakaApiError>[0]> = {}) => new KrizakaApiError({ status, ...extra });

describe("shouldRetry", () => {
  it("retries network errors, 5xx and unknown errors up to the maximum", () => {
    expect(shouldRetry(0, err(0))).toBe(true);
    expect(shouldRetry(2, err(503))).toBe(true);
    expect(shouldRetry(3, err(503))).toBe(false);
    expect(shouldRetry(0, new Error("x"))).toBe(true);
    expect(shouldRetry(1, err(500), { maxRetries: 1 })).toBe(false);
  });

  it("never insists on a 4xx or a bad body", () => {
    for (const status of [400, 401, 403, 404, 409, 422]) expect(shouldRetry(0, err(status))).toBe(false);
    expect(shouldRetry(0, err(200, { code: "invalid-response" }))).toBe(false);
  });

  it("retries a 429 only when retryAt is close enough", () => {
    expect(shouldRetry(0, err(429, { retryAt: NOW + 5_000 }), { now: NOW })).toBe(true);
    expect(shouldRetry(0, err(429, { retryAt: NOW + 120_000 }), { now: NOW })).toBe(false);
    expect(shouldRetry(0, err(429), { now: NOW })).toBe(true);
    expect(shouldRetry(0, err(429, { retryAt: NOW + 120_000 }), { now: NOW, maxWait: 200_000 })).toBe(true);
  });
});

describe("retryDelay", () => {
  it("waits what a 429 asked, otherwise backs off", () => {
    expect(retryDelay(0, err(429, { retryAt: NOW + 2_500 }), NOW)).toBe(2_500);
    expect(retryDelay(0, err(503))).toBe(1000);
    expect(retryDelay(2, new Error("x"))).toBe(4000);
    expect(retryDelay(10, err(0))).toBe(30_000);
  });
});

describe("createQueryClient", () => {
  it("applies the Krizaka defaults and lets the app override them", () => {
    const client = createQueryClient({ gcTime: 1234, defaultOptions: { queries: { refetchOnWindowFocus: false } } });
    const queries = client.getDefaultOptions().queries!;
    expect(queries).toMatchObject({ staleTime: 30_000, gcTime: 1234, refetchOnWindowFocus: false, throwOnError: throwUnlessList });
    expect(createQueryClient().getDefaultOptions().queries!.gcTime).toBeUndefined();
  });

  it("reports a 401 once to onUnauthorized and every error to onError", async () => {
    const onUnauthorized = vi.fn();
    const onError = vi.fn();
    const client = createQueryClient({ onUnauthorized, onError });
    await client.prefetchQuery({ queryKey: ["me"], queryFn: () => Promise.reject(err(401)) });
    await client.prefetchQuery({ queryKey: ["boom"], queryFn: () => Promise.reject(err(404)) });
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(onUnauthorized.mock.calls[0]![0]).toMatchObject({ status: 401 });
    expect(onError).toHaveBeenCalledTimes(2);
    await expect(client.getMutationCache().build(client, { mutationFn: () => Promise.reject(err(401)) }).execute(undefined)).rejects.toMatchObject({ status: 401 });
    expect(onUnauthorized).toHaveBeenCalledTimes(2);
    // without callbacks nothing breaks
    await createQueryClient().prefetchQuery({ queryKey: ["x"], queryFn: () => Promise.reject(err(401)) });
  });

  it("retries a 429 after its retryAt, and a mutation only on a 429", async () => {
    vi.useFakeTimers();
    try {
      const client = createQueryClient();
      let calls = 0;
      const query = client.fetchQuery({
        queryKey: ["limited"],
        queryFn: () => (++calls === 1 ? Promise.reject(err(429, { retryAt: Date.now() + 2000 })) : Promise.resolve("ok")),
      });
      await vi.advanceTimersByTimeAsync(1999);
      expect(calls).toBe(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(query).resolves.toBe("ok");

      let mutations = 0;
      const failing = client.getMutationCache().build(client, { mutationFn: () => (++mutations, Promise.reject(err(500))) }).execute(undefined);
      await expect(failing).rejects.toMatchObject({ status: 500 });
      expect(mutations).toBe(1);

      let limited = 0;
      const retried = client
        .getMutationCache()
        .build(client, { mutationFn: () => (++limited === 1 ? Promise.reject(err(429, { retryAt: Date.now() + 10 })) : Promise.resolve("done")) })
        .execute(undefined);
      await vi.advanceTimersByTimeAsync(10);
      await expect(retried).resolves.toBe("done");
      const plain = client.getMutationCache().build(client, { mutationFn: () => Promise.reject(new Error("x")) }).execute(undefined);
      await expect(plain).rejects.toThrow("x");
    } finally {
      vi.useRealTimers();
    }
  });

  it("throws a first load to the error boundary, never a list nor a refetch", () => {
    const client = createQueryClient();
    const build = (key: string, meta?: Record<string, unknown>, data?: unknown) => {
      const query = client.getQueryCache().build(client, { queryKey: [key], meta });
      if (data !== undefined) query.setData(data);
      return query;
    };
    expect(throwUnlessList(new Error("x"), build("a"))).toBe(true);
    expect(throwUnlessList(new Error("x"), build("b", { list: true }))).toBe(false);
    expect(throwUnlessList(new Error("x"), build("c", undefined, [1]))).toBe(false);
    const observer = new QueryObserver(createQueryClient({ throwOnError: false }), { queryKey: ["d"] });
    expect(observer.options.throwOnError).toBe(false);
  });
});
