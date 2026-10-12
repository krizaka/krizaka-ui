"use client";

import { eventSourceLive, isKrizakaApiError, useLiveInvalidation, useMutation, useQuery, useQueryClient } from "@krizaka/query";

import { likeVideo, type Video, videoKeys, videoLiveRules, videosQuery } from "../../lib/videos";

// One stream per tab, opened by the first subscriber; the browser replays with Last-Event-ID.
const live = typeof window === "undefined" ? null : eventSourceLive("/api/videos/stream");

export function VideoList() {
  const client = useQueryClient();
  const videos = useQuery(videosQuery()); // hydrated by the page: no request on the first render
  useLiveInvalidation(live, {
    ...videoLiveRules,
    // an event that carries the whole video writes the cache instead of refetching
    "video.updated": (event: { video: Video }, qc) => {
      qc.setQueryData(videoKeys.detail(event.video.id), event.video);
      return [videoKeys.list({})];
    },
  });

  const like = useMutation({
    mutationFn: likeVideo,
    // optimistic: the heart fills at once, and comes back if the server refuses
    onMutate: async (id: string) => {
      const key = videosQuery().queryKey;
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData(key);
      client.setQueryData(key, (list) => list?.map((v) => (v.id === id ? { ...v, liked: true, likes: v.likes + 1 } : v)));
      return { previous };
    },
    onError: (_error, _id, context) => client.setQueryData(videosQuery().queryKey, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: videoKeys.all }),
  });

  if (videos.isError) {
    // the words come from the app's catalogue: t(error.messageKey())
    return <p role="alert">{isKrizakaApiError(videos.error) ? videos.error.messageKey() : "apiErrors.server"}</p>;
  }
  return (
    <ul>
      {videos.data?.map((video) => (
        <li key={video.id}>
          {video.title}
          <button type="button" aria-pressed={video.liked} onClick={() => like.mutate(video.id)}>
            {video.likes}
          </button>
        </li>
      ))}
    </ul>
  );
}
