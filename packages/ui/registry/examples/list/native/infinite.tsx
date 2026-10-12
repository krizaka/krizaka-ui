import { configureKrizakaFetch, krizakaFetch, KrizakaQueryProvider } from "@krizaka/query";
import { Txt } from "@krizaka/ui/native";
import { List, useInfiniteList } from "@krizaka/ui/native/list";
import { useState } from "react";

type Page = { items: { id: string; title: string }[]; next: number | null };
// The API, faked in the screen: 20 videos per page, 5 pages.
async function fakeApi(input: RequestInfo | URL) {
  const cursor = Number(new URL(String(input), "https://api.example").searchParams.get("cursor"));
  const items = Array.from({ length: 20 }, (_, i) => ({ id: `v${cursor + i}`, title: `Video ${cursor + i + 1}` }));
  return Response.json({ items, next: cursor + 20 < 100 ? cursor + 20 : null } satisfies Page);
}

function Videos() {
  const { listProps, error } = useInfiniteList({
    queryKey: ["videos", "feed"],
    queryFn: ({ pageParam, signal }) => krizakaFetch("/api/videos", { query: { cursor: pageParam }, signal }) as Promise<Page>,
    initialPageParam: 0,
    getNextPageParam: (last) => last.next,
    getItems: (page) => page.items,
  });
  return (
    <List label="Videos" {...listProps} error={error ? <Txt>Could not load the videos.</Txt> : undefined} keyExtractor={(v) => v.id} renderItem={(v) => <Txt style={{ padding: 16 }}>{v.title}</Txt>} />
  );
}

// A paginated API as a list: the next page near the end, pull to refresh, the query of @krizaka/query.
export default function NativeListInfinite() {
  useState(() => configureKrizakaFetch({ fetch: fakeApi as typeof fetch }));
  return (
    <KrizakaQueryProvider>
      <Videos />
    </KrizakaQueryProvider>
  );
}
