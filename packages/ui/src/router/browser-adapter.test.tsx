import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs } from "../tabs";
import { browserAdapter } from "./route-state";

// Next.js App Router stamps its own mark on every history entry it writes. An entry that carries the mark is Next's:
// it never syncs its router (`useSearchParams`) to it. Only an entry written with a null state is taken and synced.
const NEXT_MARK = { __NA: true, tree: ["", {}] };

/** What Next does on `pushState`/`replaceState`: a null state is adopted (the router re-reads the address), a marked one is ignored. */
function installNextLikeRouter() {
  const seen: string[] = [];
  const original = { push: window.history.pushState.bind(window.history), replace: window.history.replaceState.bind(window.history) };
  const sync = (state: unknown, url: string | URL | null | undefined) => {
    if (state === null || state === undefined) seen.push(String(url));
  };
  window.history.pushState = (state, unused, url) => {
    sync(state, url);
    original.push(state === null || state === undefined ? NEXT_MARK : state, unused, url);
  };
  window.history.replaceState = (state, unused, url) => {
    sync(state, url);
    original.replace(state === null || state === undefined ? NEXT_MARK : state, unused, url);
  };
  return {
    seen,
    restore: () => {
      window.history.pushState = original.push;
      window.history.replaceState = original.replace;
    },
  };
}

let router: ReturnType<typeof installNextLikeRouter>;
beforeEach(() => {
  window.history.replaceState(NEXT_MARK, "", "/app/verify");
  router = installNextLikeRouter();
});
afterEach(() => router.restore());

describe("browserAdapter under a Next-like history", () => {
  it("writes a null state, so the router sees a routed change", () => {
    browserAdapter.navigate("?tab=b", { replace: false });
    expect(router.seen).toEqual(["/app/verify?tab=b"]);
  });

  it("writes nothing for the address already shown", () => {
    window.history.replaceState(NEXT_MARK, "", "/app/verify?tab=b");
    const length = window.history.length;
    router.seen.length = 0;
    browserAdapter.navigate("?tab=b", { replace: false });
    browserAdapter.navigate("?tab=b", { replace: true });
    expect(router.seen).toEqual([]);
    expect(window.history).toHaveLength(length);
  });

  it("keeps the hash and the path", () => {
    window.history.replaceState(NEXT_MARK, "", "/app/verify#top");
    browserAdapter.navigate("?tab=b", { replace: false });
    expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe("/app/verify?tab=b#top");
  });
});

describe("a routed Tabs under a Next-like history", () => {
  const tabs = (
    <Tabs.Root routeKey="tab" routeValues={["a", "b"]}>
      <Tabs.List aria-label="Kind">
        <Tabs.Trigger value="a">A</Tabs.Trigger>
        <Tabs.Trigger value="b">B</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">panel a</Tabs.Content>
      <Tabs.Content value="b">panel b</Tabs.Content>
    </Tabs.Root>
  );

  it("one click is one history entry, seen by the router", async () => {
    render(tabs);
    const length = window.history.length;
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(window.location.search).toBe("?tab=b");
    expect(window.history).toHaveLength(length + 1);
    expect(router.seen).toEqual(["/app/verify?tab=b"]);
  });

  it("back and forward reach the tabs", async () => {
    render(tabs);
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
    act(() => {
      window.history.replaceState(NEXT_MARK, "", "/app/verify");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
    act(() => {
      window.history.replaceState(NEXT_MARK, "", "/app/verify?tab=b");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
  });
});
