import { act, renderHook } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { ReactNode } from "react";

import { parseAsInteger, parseAsString, URL_DEFAULTS, useQueryState, withUrlDefaults } from "../src/url";
import { NuqsAdapter } from "../src/url-next";
import * as server from "../src/url-server";

const wrap =
  (searchParams: string, onUrlUpdate?: (e: { queryString: string; options: { history?: string } }) => void) =>
  ({ children }: { children: ReactNode }) => (
    <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
      {children}
    </NuqsTestingAdapter>
  );

describe("@krizaka/query/url", () => {
  it("reads a filter from the address, with the default when absent", () => {
    const { result } = renderHook(() => useQueryState("tab", withUrlDefaults(parseAsString).withDefault("all")), {
      wrapper: wrap("?tab=sold"),
    });
    expect(result.current[0]).toBe("sold");
    const absent = renderHook(() => useQueryState("tab", withUrlDefaults(parseAsString).withDefault("all")), {
      wrapper: wrap(""),
    });
    expect(absent.result.current[0]).toBe("all");
  });

  it("writes with replace history, and clears the default from the address", async () => {
    const updates: { queryString: string; options: { history?: string } }[] = [];
    const { result } = renderHook(() => useQueryState("page", withUrlDefaults(parseAsInteger).withDefault(1)), {
      wrapper: wrap("", (e) => updates.push(e)),
    });
    await act(() => result.current[1](3));
    expect(updates.at(-1)?.queryString).toBe("?page=3");
    expect(updates.at(-1)?.options.history).toBe("replace");
    await act(() => result.current[1](1));
    expect(updates.at(-1)?.queryString).toBe("");
  });

  it("states the Krizaka options once", () => {
    expect(URL_DEFAULTS).toEqual({ history: "replace", shallow: true, clearOnDefault: true });
  });

  it("gives the server the same parsers, to read the address in a Server Component", () => {
    const load = server.createLoader({ q: server.parseAsString.withDefault("") });
    expect(load("?q=lease")).toEqual({ q: "lease" });
    expect(load("")).toEqual({ q: "" });
  });

  it("exports the Next.js App Router adapter", () => {
    expect(NuqsAdapter).toBeTypeOf("function");
  });
});
