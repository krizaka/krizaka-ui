// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createDiscovery } from "../src/index";
import { DiscoveryGate, DiscoveryProvider, useDiscovery, useGate, useService } from "../src/react";
import { body, json, memory, PUBLIC_KEYS, signed,SUFFIXES } from "./fixtures";

afterEach(cleanup);

const URL_ = "https://www.krizaka.com/.well-known/krizaka/services.json";
function setup(initial = signed()) {
  let current = json(initial);
  const fetchImpl = (async () => ({ ok: true, status: 200, text: async () => current })) as unknown as typeof fetch;
  const d = createDiscovery({
    environment: "dev",
    appVersion: "1.1.0",
    manifestUrls: [URL_],
    publicKeys: PUBLIC_KEYS,
    allowedHostSuffixes: SUFFIXES,
    defaults: { yomizaka: { apiBase: "https://default.yomizaka.com", webBase: "https://default.yomizaka.com" } },
    storage: memory(),
    fetch: fetchImpl,
  });
  return { d, set: (m: ReturnType<typeof signed>) => (current = json(m)) };
}

const Show = () => <p>{useService("yomizaka").apiBase}</p>;

describe("react bindings", () => {
  it("shows the loading node, then the app with the discovered address", async () => {
    const { d } = setup();
    render(
      <DiscoveryProvider discovery={d} loading={<p>loading</p>}>
        <Show />
      </DiscoveryProvider>,
    );
    expect(screen.getByText("loading")).toBeTruthy();
    expect(await screen.findByText("https://dev.yomizaka.com")).toBeTruthy();
  });

  it("re-renders when the manifest moves an address", async () => {
    const { d, set } = setup();
    render(
      <DiscoveryProvider discovery={d} refreshEveryMs={0}>
        <Show />
      </DiscoveryProvider>,
    );
    await screen.findByText("https://dev.yomizaka.com");
    set(signed(body({ issuedAt: "2026-10-21T13:00:00Z" }, { apiBase: "https://www.yomizaka.com" })));
    await act(async () => void (await d.refresh()));
    expect(screen.getByText("https://www.yomizaka.com")).toBeTruthy();
  });

  it("refreshes when the app returns to the foreground, and unsubscribes on unmount", async () => {
    const { d } = setup();
    const refresh = vi.spyOn(d, "refresh");
    let fire: () => void = () => undefined;
    const unsubscribe = vi.fn();
    const subscribeForeground = (cb: () => void) => {
      fire = cb;
      return unsubscribe;
    };
    const view = render(
      <DiscoveryProvider discovery={d} subscribeForeground={subscribeForeground}>
        <Show />
      </DiscoveryProvider>,
    );
    await screen.findByText("https://dev.yomizaka.com");
    refresh.mockClear();
    fire();
    expect(refresh).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("starts the background refresh with the given period", async () => {
    const { d } = setup();
    const start = vi.spyOn(d, "startBackgroundRefresh");
    render(
      <DiscoveryProvider discovery={d} refreshEveryMs={5000}>
        <Show />
      </DiscoveryProvider>,
    );
    await screen.findByText("https://dev.yomizaka.com");
    expect(start).toHaveBeenCalledWith(5000);
  });

  it("renders the update screen, the maintenance screen, or the app", async () => {
    const screens = {
      update: (g: { minAppVersion: string }) => <p>update {g.minAppVersion}</p>,
      maintenance: (g: { message?: { en: string } }) => <p>maintenance {g.message?.en}</p>,
    };
    const old = setup(signed(body({}, { minAppVersion: "2.0.0" })));
    const a = render(
      <DiscoveryProvider discovery={old.d} refreshEveryMs={0}>
        <DiscoveryGate product="yomizaka" {...screens}>
          <p>app</p>
        </DiscoveryGate>
      </DiscoveryProvider>,
    );
    expect(await screen.findByText("update 2.0.0")).toBeTruthy();
    a.unmount();
    const down = setup(signed(body({}, { status: "maintenance", message: { en: "soon", fr: "bientôt" } })));
    const b = render(
      <DiscoveryProvider discovery={down.d} refreshEveryMs={0}>
        <DiscoveryGate product="yomizaka" {...screens}>
          <p>app</p>
        </DiscoveryGate>
      </DiscoveryProvider>,
    );
    expect(await screen.findByText("maintenance soon")).toBeTruthy();
    b.unmount();
    const fine = setup();
    render(
      <DiscoveryProvider discovery={fine.d} refreshEveryMs={0}>
        <DiscoveryGate product="yomizaka" {...screens}>
          <p>app</p>
        </DiscoveryGate>
      </DiscoveryProvider>,
    );
    expect(await screen.findByText("app")).toBeTruthy();
  });

  it("useGate reads the gate, and the hooks refuse to run outside the provider", async () => {
    const { d } = setup();
    const Gate = () => <p>{useGate("yomizaka").state}</p>;
    render(
      <DiscoveryProvider discovery={d} refreshEveryMs={0}>
        <Gate />
      </DiscoveryProvider>,
    );
    expect(await screen.findByText("ok")).toBeTruthy();
    cleanup();
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const Bare = () => <p>{String(useDiscovery())}</p>;
    expect(() => render(<Bare />)).toThrow(/DiscoveryProvider/);
    spy.mockRestore();
  });

  it("does not set state after unmount", async () => {
    const { d } = setup();
    const view = render(
      <DiscoveryProvider discovery={d} refreshEveryMs={0}>
        <Show />
      </DiscoveryProvider>,
    );
    view.unmount();
    await expect(d.start()).resolves.toBeUndefined();
  });
});
