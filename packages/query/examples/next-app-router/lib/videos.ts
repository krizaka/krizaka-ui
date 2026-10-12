import { defineKeys, krizakaFetch, queryOptions } from "@krizaka/query";
import { z } from "zod";

export const Video = z.object({ id: z.string(), title: z.string(), likes: z.number().int(), liked: z.boolean() });
export type Video = z.infer<typeof Video>;

export const videoKeys = defineKeys("videos", {
  list: (filters: { q?: string }) => [filters],
  detail: (id: string) => [id],
});

/** One definition, used by the Server Component (prefetch) and the client component (useQuery). */
export const videosQuery = (filters: { q?: string } = {}) =>
  queryOptions({
    queryKey: videoKeys.list(filters),
    queryFn: ({ signal }) => krizakaFetch("/api/videos", { schema: z.array(Video), query: filters, signal }),
    meta: { list: true }, // an error renders in the list, not in the error boundary
  });

export const likeVideo = (id: string) => krizakaFetch(`/api/videos/${id}/like`, { method: "POST", schema: Video });

/** What the server's events change in the cache. */
export const videoLiveRules = {
  "video.created": [videoKeys.all],
  "video.deleted": [videoKeys.all],
};
