// The native list (@krizaka/ui/native/list) on the real FlashList v2 (its Jest setup gives the views a size) and the
// real @krizaka/query: a paginated API behind a fake fetch, the next page asked for at the end, pull to refresh.
import { describe, expect, jest, test } from "@jest/globals";
import { configureKrizakaFetch, createQueryClient, krizakaFetch, KrizakaQueryProvider } from "@krizaka/query";
import { act, render, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";

import { List, useInfiniteList } from "./list";
import { ThemeProvider } from "./theme";

type Note = { id: string; title: string };
const notes: Note[] = Array.from({ length: 5 }, (_, i) => ({ id: `n${i}`, title: `Note ${i + 1}` }));
const draw = (note: Note) => <Text>{note.title}</Text>;

function themed(node: React.ReactNode) {
  return <ThemeProvider mode="dark">{node}</ThemeProvider>;
}

describe("List (FlashList v2)", () => {
  test("renders the items, named, with separators", async () => {
    await render(themed(<List label="Notes" data={notes} keyExtractor={(n) => n.id} renderItem={draw} />));
    expect(screen.getByText("Note 1")).toBeTruthy();
    expect(screen.getByLabelText("Notes")).toBeTruthy();
  });

  test("shows skeleton rows while loading, then the empty state or the error in place of the items", async () => {
    const { rerender } = await render(themed(<List label="Notes" data={[]} keyExtractor={(n: Note) => n.id} renderItem={draw} loading loadingRows={3} />));
    expect(screen.getByLabelText("Notes").props["aria-busy"]).toBe(true);
    await rerender(themed(<List label="Notes" data={[]} keyExtractor={(n: Note) => n.id} renderItem={draw} empty={{ title: "No note yet", description: "Write your first one." }} />));
    expect(screen.getByText("No note yet")).toBeTruthy();
    await rerender(themed(<List label="Notes" data={notes} keyExtractor={(n) => n.id} renderItem={draw} error={<Text>Could not load</Text>} />));
    expect(screen.getByText("Could not load")).toBeTruthy();
    expect(screen.queryByText("Note 1")).toBeNull();
  });

  test("shows a named spinner under the last item while the next page loads", async () => {
    await render(themed(<List label="Notes" data={notes} keyExtractor={(n) => n.id} renderItem={draw} loadingMore loadingMoreLabel="Loading more notes" />));
    expect(screen.getByLabelText("Loading more notes")).toBeTruthy();
  });
});

describe("useInfiniteList (@krizaka/query)", () => {
  const page = (cursor: number) => ({ items: notes.slice(cursor, cursor + 2), next: cursor + 2 < notes.length ? cursor + 2 : null });

  let latest: ReturnType<typeof useInfiniteList<ReturnType<typeof page>, Note, number>>["listProps"] | undefined;
  function Notes() {
    const { listProps, error } = useInfiniteList({
      queryKey: ["notes", "list"],
      queryFn: ({ pageParam, signal }) => krizakaFetch("/api/notes", { query: { cursor: pageParam }, signal }) as Promise<ReturnType<typeof page>>,
      initialPageParam: 0,
      getNextPageParam: (last) => last.next,
      getItems: (p) => p.items,
    });
    latest = listProps;
    return <List label="Notes" {...listProps} error={error ? <Text>{error.message}</Text> : undefined} keyExtractor={(n) => n.id} renderItem={draw} />;
  }

  test("loads the first page, asks for the next one near the end (once at a time, never past the last), and refreshes on a pull", async () => {
    const calls: string[] = [];
    let gate: Promise<void> | null = null;
    let open = () => undefined as void;
    const fake = jest.fn(async (url: string) => {
      calls.push(url);
      if (gate) await gate;
      const cursor = Number(new URL(url, "https://app.test").searchParams.get("cursor"));
      return new Response(JSON.stringify(page(cursor)), { headers: { "content-type": "application/json" } });
    });
    const restore = configureKrizakaFetch({ fetch: fake as unknown as typeof fetch });
    const client = createQueryClient({ maxRetries: 0, gcTime: Number.POSITIVE_INFINITY });
    await render(
      themed(
        <KrizakaQueryProvider client={client}>
          <Notes />
        </KrizakaQueryProvider>,
      ),
    );
    await waitFor(() => expect(screen.getByText("Note 2")).toBeTruthy());
    await act(async () => {
      latest?.onEndReached?.();
      latest?.onEndReached?.();
    });
    // The two calls above asked once; FlashList then asked for the last page itself (the content is shorter than the
    // screen) — never a page twice, never past the last one.
    await waitFor(() => expect(screen.getByText("Note 5")).toBeTruthy());
    expect(calls).toEqual(["/api/notes?cursor=0", "/api/notes?cursor=2", "/api/notes?cursor=4"]);

    gate = new Promise<void>((resolve) => (open = resolve));
    await act(async () => latest?.onRefresh?.());
    expect(latest?.refreshing).toBe(true);
    await act(async () => open());
    await waitFor(() => expect(latest?.refreshing).toBe(false));
    expect(calls.slice(3)).toEqual(["/api/notes?cursor=0", "/api/notes?cursor=2", "/api/notes?cursor=4"]);
    restore();
    client.clear();
  });
});
