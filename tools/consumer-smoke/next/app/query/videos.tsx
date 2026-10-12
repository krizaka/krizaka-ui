"use client";

import { defineKeys, queryOptions, useQuery } from "@krizaka/query";

const videoKeys = defineKeys("videos", { list: () => [] });

export const videosQuery = queryOptions({
  queryKey: videoKeys.list(),
  queryFn: async () => ["First video", "Second video"],
  meta: { list: true },
});

export function Videos() {
  const videos = useQuery(videosQuery);
  return <ul>{videos.data?.map((title) => <li key={title}>{title}</li>)}</ul>;
}
