/**
 * @krizaka/realtime — the realtime layer behind one interface (`RealtimeBus`: publish / subscribe by channel, and
 * presence), three adapters chosen by configuration, and Server-Sent Events. It knows no product: the app wires it
 * once (its own `lib/realtime.ts`). The root entry needs no driver: the PostgreSQL adapter takes its connection by
 * injection (`@krizaka/realtime/pg` builds one on `pg`), the Redis adapter lives in `@krizaka/realtime/redis` (`ioredis`).
 */
export { memoryBus } from "./memory";
export { DEFAULT_CHANNEL, NOTIFY_LIMIT, postgresBus, type PostgresBusOptions, type PostgresChannel } from "./postgres";
export { type PresenceReplica, ReplicatedPresence, type ReplicatedPresenceOptions } from "./presence";
export { eventStream, type EventStreamControls, type EventStreamOptions, type SseFrame, sseFrame } from "./sse";
export * from "./types";

import { memoryBus } from "./memory";
import { postgresBus, type PostgresChannel } from "./postgres";
import type { RedisBusOptions } from "./redis";
import type { BusKind, PresenceOptions, RealtimeBus } from "./types";

export interface BusConfig extends Partial<PresenceOptions> {
  kind: BusKind;
  /** Required by `postgres`: the NOTIFY / LISTEN primitives (`pgChannel` from `@krizaka/realtime/pg`, or the app's own). */
  postgres?: PostgresChannel;
  /** The PostgreSQL NOTIFY channel (`postgres`; default `DEFAULT_CHANNEL`). */
  channel?: string;
  /** Required by `redis`: the `redisBus` of `@krizaka/realtime/redis` — passed in, so `ioredis` loads only when used. */
  redisBus?: (options: RedisBusOptions) => RealtimeBus;
  /** Required by `redis`. */
  redisUrl?: string;
  /** Prefix of every Redis key and channel (`redis`; default `DEFAULT_PREFIX`). */
  prefix?: string;
}

/** The bus a deployment asked for — refuses a configuration that cannot work rather than falling back silently. */
export function createBus(config: BusConfig): RealtimeBus {
  if (config.kind === "memory") return memoryBus(config);
  if (config.kind === "postgres") {
    if (!config.postgres) throw new Error("the postgres realtime bus needs a PostgreSQL channel");
    return postgresBus({ ...config, db: config.postgres });
  }
  if (config.kind === "redis") {
    if (!config.redisUrl) throw new Error("REALTIME_BUS=redis needs REALTIME_REDIS_URL");
    if (!config.redisBus) throw new Error("REALTIME_BUS=redis needs redisBus from @krizaka/realtime/redis");
    return config.redisBus({ ...config, url: config.redisUrl });
  }
  throw new Error(`unknown realtime bus "${String(config.kind)}" (memory, postgres or redis)`);
}

/** Reads `REALTIME_BUS` (default `postgres`). */
export function busKind(value: string | undefined): BusKind {
  const kind = (value?.trim().toLowerCase() || "postgres") as BusKind;
  if (kind !== "memory" && kind !== "postgres" && kind !== "redis") throw new Error(`REALTIME_BUS must be memory, postgres or redis, not "${value}"`);
  return kind;
}
