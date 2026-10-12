/**
 * The live bridge: realtime events become cache updates. A `LiveSource` is anything with the `subscribe` of
 * `@krizaka/realtime`'s `RealtimeBus` — the bus itself on a server or in a test, `eventSourceLive` (the browser's
 * Server-Sent Events, or react-native-sse) in an app. An event invalidates the keys its rule names (the server stays
 * the truth); a rule may write the cache itself (`setQueryData`) when the event carries the whole data. Events are
 * de-duplicated by id, so a replay after a reconnection (`Last-Event-ID`) never applies one twice.
 */
import type { RealtimeBus } from "@krizaka/realtime";
import type { QueryClient, QueryKey } from "@tanstack/react-query";

/** Where live events come from: the `subscribe` of a `RealtimeBus`. */
export type LiveSource = Pick<RealtimeBus, "subscribe">;

/** A live event as the rules see it: a `type` to dispatch on, an `id` to de-duplicate by, the payload. */
export type LiveEvent = { type?: string; id?: string | number; [key: string]: unknown };

/** Keys to invalidate, or a function that updates the cache itself (and may return keys to invalidate as well). */
export type LiveRule<E = LiveEvent> = readonly QueryKey[] | ((event: E, client: QueryClient) => readonly QueryKey[] | void);

/** One rule per event type. */
export type LiveRules = Record<string, LiveRule<never>>;

export interface LiveOptions {
  /** The channel (an SSE event name, a bus channel). Default `message`. */
  channel?: string;
  /** The event's type. Default: its `type` field. */
  typeOf?: (event: LiveEvent) => string | undefined;
  /** The event's id, to de-duplicate. Default: its `id` field. */
  idOf?: (event: LiveEvent) => string | number | undefined;
  /** How many recent ids are remembered. Default 500. */
  remember?: number;
  /**
   * After a reconnection (`{ type: "open", reconnect: true }` on the `open` channel, which `eventSourceLive` sends),
   * invalidate every key the static rules name: what changed while the stream was down is fetched again. Default true.
   */
  resyncOnReconnect?: boolean;
}

/** The channel `eventSourceLive` announces (re)connections on. */
export const OPEN_CHANNEL = "open";

/** Applies live events to a client — the engine of `useLiveInvalidation`, usable without React. */
export function createLiveInvalidator(client: QueryClient, rules: () => LiveRules, options: LiveOptions = {}) {
  const { typeOf = (event) => event.type, idOf = (event) => event.id, remember = 500 } = options;
  const seen = new Set<string | number>();

  const apply = (raw: unknown) => {
    if (!raw || typeof raw !== "object") return;
    const event = raw as LiveEvent;
    const id = idOf(event);
    if (id !== undefined) {
      if (seen.has(id)) return;
      seen.add(id);
      if (seen.size > remember) seen.delete(seen.values().next().value as string | number);
    }
    const type = typeOf(event);
    const rule = type === undefined ? undefined : (rules()[type] as LiveRule<LiveEvent> | undefined);
    if (!rule) return;
    const keys = typeof rule === "function" ? rule(event, client) : rule;
    for (const queryKey of keys ?? []) void client.invalidateQueries({ queryKey });
  };

  const resync = (raw: unknown) => {
    if (!(raw as { reconnect?: boolean } | null)?.reconnect) return;
    for (const rule of Object.values(rules())) {
      if (typeof rule !== "function") for (const queryKey of rule) void client.invalidateQueries({ queryKey });
    }
  };

  /** Subscribes to a source; returns the unsubscribe function. */
  const connect = (source: LiveSource) => {
    const off = source.subscribe(options.channel ?? "message", apply);
    const offOpen = options.resyncOnReconnect === false ? undefined : source.subscribe(OPEN_CHANNEL, resync);
    return () => {
      off();
      offOpen?.();
    };
  };

  return { apply, resync, connect };
}

export type LiveStatus = "idle" | "connecting" | "open" | "reconnecting";

/** The parts of `EventSource` used here (the browser's, or react-native-sse's). */
export interface EventSourceLike {
  readonly readyState: number;
  addEventListener(type: string, listener: (event: { data?: unknown; lastEventId?: string }) => void): void;
  removeEventListener(type: string, listener: (event: { data?: unknown; lastEventId?: string }) => void): void;
  close(): void;
}
export type EventSourceFactory = new (url: string, init?: { withCredentials?: boolean }) => EventSourceLike;

export interface EventSourceLiveOptions {
  /** Send the cookies of a cross-origin stream. */
  withCredentials?: boolean;
  /** The implementation: the global `EventSource` by default; react-native-sse's on a device. */
  EventSource?: EventSourceFactory;
  /** Reopening after the stream closed for good (an HTTP error): first delay, doubled up to `maxRetryDelay`. */
  retryDelay?: number;
  maxRetryDelay?: number;
  /** The stream's state, for a discreet "reconnecting…" line. */
  onStatus?: (status: LiveStatus) => void;
}

/**
 * One Server-Sent Events stream shared by every subscriber: opened with the first, closed with the last. The browser
 * reconnects by itself and sends `Last-Event-ID` (the server replays); when the stream closes for good, it is reopened
 * with a growing delay. Each JSON payload without an `id` receives the SSE `lastEventId`; each (re)connection is
 * announced on the `open` channel (`{ type: "open", reconnect }`).
 */
export function eventSourceLive(url: string | (() => string), options: EventSourceLiveOptions = {}): LiveSource & { readonly status: LiveStatus } {
  const { retryDelay = 1000, maxRetryDelay = 30_000 } = options;
  const handlers = new Map<string, Set<(event: unknown) => void>>();
  const bound = new Map<string, (event: { data?: unknown; lastEventId?: string }) => void>();
  let source: EventSourceLike | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let delay = retryDelay;
  let opened = false;
  let status: LiveStatus = "idle";

  const setStatus = (next: LiveStatus) => {
    if (status === next) return;
    status = next;
    options.onStatus?.(next);
  };
  const emit = (channel: string, event: unknown) => {
    for (const handler of handlers.get(channel) ?? []) {
      try {
        handler(event);
      } catch (error) {
        console.error("[live] handler failed", error);
      }
    }
  };
  const listen = (channel: string) => {
    if (!source || channel === OPEN_CHANNEL || bound.has(channel)) return;
    const listener = (message: { data?: unknown; lastEventId?: string }) => {
      let payload: unknown = message.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          /* not JSON: delivered as text */
        }
      }
      if (payload && typeof payload === "object" && !Array.isArray(payload) && !("id" in payload) && message.lastEventId) {
        payload = { ...payload, id: message.lastEventId };
      }
      emit(channel, payload);
    };
    bound.set(channel, listener);
    source.addEventListener(channel, listener);
  };

  const open = () => {
    const Impl = options.EventSource ?? (globalThis as unknown as { EventSource?: EventSourceFactory }).EventSource;
    if (!Impl) throw new Error("eventSourceLive needs an EventSource (pass react-native-sse's on a device)");
    const current = new Impl(typeof url === "function" ? url() : url, { withCredentials: options.withCredentials });
    source = current;
    setStatus(opened ? "reconnecting" : "connecting");
    current.addEventListener("open", () => {
      delay = retryDelay;
      setStatus("open");
      emit(OPEN_CHANNEL, { type: "open", reconnect: opened });
      opened = true;
    });
    current.addEventListener("error", () => {
      if (current.readyState !== 2) return setStatus("reconnecting"); // CONNECTING: the browser retries by itself
      // CLOSED for good: reopen later (the server replays from Last-Event-ID or its own cursor)
      current.close();
      source = null;
      bound.clear();
      setStatus("reconnecting");
      timer = setTimeout(() => {
        timer = null;
        if (handlers.size > 0) {
          open();
          for (const channel of handlers.keys()) listen(channel);
        }
      }, delay);
      delay = Math.min(delay * 2, maxRetryDelay);
    });
  };

  const shutdown = () => {
    source?.close();
    source = null;
    bound.clear();
    if (timer) clearTimeout(timer);
    timer = null;
    opened = false;
    delay = retryDelay;
    setStatus("idle");
  };

  return {
    get status() {
      return status;
    },
    subscribe(channel, handler) {
      let set = handlers.get(channel);
      if (!set) handlers.set(channel, (set = new Set()));
      set.add(handler);
      if (!source && !timer) open();
      listen(channel);
      return () => {
        set.delete(handler);
        if (set.size === 0) {
          handlers.delete(channel);
          const listener = bound.get(channel);
          if (listener && source) source.removeEventListener(channel, listener);
          bound.delete(channel);
        }
        if (handlers.size === 0) shutdown();
      };
    },
  };
}
