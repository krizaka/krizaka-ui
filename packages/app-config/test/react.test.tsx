// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createAppConfigClient } from "../src/client";
import { buildPayload, defaultRecord } from "../src/index";
import { appStateResume, useAppConfig, visibilityResume } from "../src/react";

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe("useAppConfig", () => {
  it("checks at launch, exposes the decision and dismisses the soft prompt", async () => {
    const soft = { ...buildPayload(defaultRecord("ios"), null), updateMode: "soft" as const, latestVersion: "1.4.0" };
    const fetchMock = vi.fn(async () => json(soft));
    const client = createAppConfigClient({ baseUrl: "https://x", platform: "ios", version: "1.0.0", fetch: fetchMock as unknown as typeof fetch });
    const { result } = renderHook(() => useAppConfig(client));
    expect(result.current.status === "idle" || result.current.status === "loading").toBe(true);
    await vi.waitFor(() => expect(result.current.decision.kind).toBe("soft"));
    act(() => result.current.dismissSoft());
    await vi.waitFor(() => expect(result.current.decision.kind).toBe("ok"));
    act(() => result.current.refresh());
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("re-checks on resume and detaches on unmount", async () => {
    const fetchMock = vi.fn(async () => json(buildPayload(defaultRecord("ios"), null)));
    const client = createAppConfigClient({ baseUrl: "https://x", platform: "ios", version: "1.0.0", fetch: fetchMock as unknown as typeof fetch, minIntervalMs: 0 });
    let fire = () => {};
    const stop = vi.fn();
    const resume = (callback: () => void) => {
      fire = callback;
      return stop;
    };
    const { unmount } = renderHook(() => useAppConfig(client, resume));
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fire();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    unmount();
    expect(stop).toHaveBeenCalled();
  });
});

describe("resume sources", () => {
  it("fires when React Native's AppState becomes active, not otherwise", () => {
    let listener: (state: string) => void = () => {};
    const remove = vi.fn();
    const appState = { addEventListener: (_: "change", l: (state: string) => void) => ((listener = l), { remove }) };
    const callback = vi.fn();
    const off = appStateResume(appState)(callback);
    listener("background");
    expect(callback).not.toHaveBeenCalled();
    listener("active");
    expect(callback).toHaveBeenCalledOnce();
    off();
    expect(remove).toHaveBeenCalled();
  });

  it("fires when a document becomes visible", () => {
    const target = Object.assign(new EventTarget(), { visibilityState: "hidden" });
    const callback = vi.fn();
    const off = visibilityResume(target as unknown as Parameters<typeof visibilityResume>[0])(callback);
    target.dispatchEvent(new Event("visibilitychange"));
    expect(callback).not.toHaveBeenCalled();
    target.visibilityState = "visible";
    target.dispatchEvent(new Event("visibilitychange"));
    expect(callback).toHaveBeenCalledOnce();
    off();
    target.dispatchEvent(new Event("visibilitychange"));
    expect(callback).toHaveBeenCalledOnce();
  });
});
