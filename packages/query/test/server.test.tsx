import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";

import { createQueryClient } from "../src/client";
import { KrizakaQueryProvider } from "../src/react";
import { createServerQueryClient, KrizakaHydration, prefetch } from "../src/server";

const videosQuery = (calls: { n: number }) => ({ queryKey: ["videos"], queryFn: async () => (calls.n++, ["v1", "v2"]) });

function Videos({ calls }: { calls: { n: number } }) {
  const { data } = useQuery(videosQuery(calls));
  return <p>{data ? data.join(",") : "loading"}</p>;
}

describe("prefetch", () => {
  it("dehydrates what succeeded and leaves out what failed (the client retries it)", async () => {
    const state = await prefetch([
      { queryKey: ["ok"], queryFn: async () => 1 },
      { queryKey: ["ko"], queryFn: async () => Promise.reject(new Error("down")) },
    ]);
    expect(state.queries.map((q) => [q.queryKey, q.state.status])).toEqual([[["ok"], "success"]]);
  });

  it("does not retry on the server", () => {
    expect(createServerQueryClient().getDefaultOptions().queries!.retry).toBeTypeOf("function");
    const retry = createServerQueryClient().getDefaultOptions().queries!.retry as (n: number, e: unknown) => boolean;
    expect(retry(0, new Error("x"))).toBe(false);
  });
});

describe("KrizakaHydration", () => {
  it("renders the first screen from the server's data: the client does not refetch", async () => {
    const serverCalls = { n: 0 };
    const clientCalls = { n: 0 };
    // the Server Component (async) runs on the server…
    const element = (await KrizakaHydration({ queries: [videosQuery(serverCalls)], children: <Videos calls={clientCalls} /> })) as ReactElement;
    expect(serverCalls.n).toBe(1);
    // …and its output hydrates the client
    render(<KrizakaQueryProvider>{element}</KrizakaQueryProvider>);
    expect(screen.getByText("v1,v2")).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(clientCalls.n).toBe(0);
  });

  it("shares a request's client between boundaries", async () => {
    const client = createQueryClient();
    await KrizakaHydration({ queries: [{ queryKey: ["a"], queryFn: async () => "A" }], client });
    expect(client.getQueryData(["a"])).toBe("A");
  });
});
