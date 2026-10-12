/**
 * The client half (built with a "use client" banner): the provider an App Router layout renders, and the live bridge
 * hook. Both receive their client through React context, never a module singleton (one client per request on a server).
 */
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { createLiveInvalidator, createQueryClient, type KrizakaQueryClientOptions, type LiveOptions, type LiveRules, type LiveSource } from "./core.js";

export interface KrizakaQueryProviderProps extends KrizakaQueryClientOptions {
  children?: ReactNode;
  /** A client made elsewhere (tests, a persisted client on a device). Default: one `createQueryClient(options)` per mount. */
  client?: ReturnType<typeof createQueryClient>;
}

/** The app's query client, created once per mount (never shared between two requests of a server). */
export function KrizakaQueryProvider({ children, client, ...options }: KrizakaQueryProviderProps) {
  const [own] = useState(() => client ?? createQueryClient(options));
  return <QueryClientProvider client={client ?? own}>{children}</QueryClientProvider>;
}

/**
 * Applies a source's live events to the cache while the component is mounted:
 *
 * ```tsx
 * useLiveInvalidation(live, {
 *   "notification.created": [notificationKeys.all],
 *   "video.updated": (event: { video: Video }, qc) => qc.setQueryData(videoKeys.detail(event.video.id), event.video),
 * });
 * ```
 *
 * The rules are read at each event (no re-subscription when they change); the source and the channel are not.
 */
export function useLiveInvalidation(source: LiveSource | null | undefined, rules: LiveRules, options: LiveOptions & { enabled?: boolean } = {}): void {
  const client = useQueryClient();
  const rulesRef = useRef(rules);
  const optionsRef = useRef(options);
  useEffect(() => {
    rulesRef.current = rules;
    optionsRef.current = options;
  });
  const { enabled = true, channel, resyncOnReconnect } = options;
  useEffect(() => {
    if (!source || !enabled) return;
    const invalidator = createLiveInvalidator(client, () => rulesRef.current, {
      ...optionsRef.current,
      channel,
      resyncOnReconnect,
    });
    return invalidator.connect(source);
  }, [client, source, enabled, channel, resyncOnReconnect]);
}
