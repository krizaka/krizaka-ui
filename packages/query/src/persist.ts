/**
 * The offline cache: the query client saved to a key-value storage (MMKV or AsyncStorage on a device, localStorage on
 * the web) and restored at start-up, so a screen opens with what it showed last time — then refreshes.
 *
 * ```tsx
 * const persister = createPersister({ storage: mmkvStorage(new MMKV()) });
 * <PersistQueryClientProvider client={client} persistOptions={persistOptions({ persister })}>…
 * ```
 * The client's `gcTime` must be at least `maxAge` (`createQueryClient({ gcTime: PERSIST_MAX_AGE })`).
 */
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Persister, PersistQueryClientOptions } from "@tanstack/react-query-persist-client";

export {
  type PersistedClient,
  type Persister,
  PersistQueryClientProvider,
  type PersistQueryClientProviderProps,
} from "@tanstack/react-query-persist-client";

import { PERSIST_MAX_AGE } from "./constants";

export { PERSIST_MAX_AGE };

/** A string key-value storage, synchronous (MMKV, localStorage) or not (AsyncStorage). */
export interface KeyValueStorage {
  getItem(key: string): string | null | undefined | Promise<string | null | undefined>;
  setItem(key: string, value: string): unknown;
  removeItem(key: string): unknown;
}

export interface CreatePersisterOptions {
  storage: KeyValueStorage | null | undefined;
  /** The storage key. Default `krizaka-query`. */
  key?: string;
  /** Saves at most once per this many ms. Default 1 s. */
  throttleTime?: number;
}

/** A persister on any key-value storage (none, as on a server: it does nothing). */
export function createPersister({ storage, key = "krizaka-query", throttleTime = 1000 }: CreatePersisterOptions): Persister {
  return createAsyncStoragePersister({
    storage: storage
      ? {
          getItem: async (name) => (await storage.getItem(name)) ?? null,
          setItem: async (name, value) => {
            await storage.setItem(name, value);
          },
          removeItem: async (name) => {
            await storage.removeItem(name);
          },
        }
      : undefined,
    key,
    throttleTime,
  });
}

/** The parts of react-native-mmkv's `MMKV` used here. */
export interface MmkvLike {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete?(key: string): void;
  remove?(key: string): unknown;
}

/** MMKV as a `KeyValueStorage` (v3 `delete`, v4 `remove`). */
export function mmkvStorage(mmkv: MmkvLike): KeyValueStorage {
  return {
    getItem: (key) => mmkv.getString(key) ?? null,
    setItem: (key, value) => mmkv.set(key, value),
    removeItem: (key) => (mmkv.remove ? mmkv.remove(key) : mmkv.delete?.(key)),
  };
}

export interface KrizakaPersistOptions {
  persister: Persister;
  /** Older saved caches are dropped. Default one day. */
  maxAge?: number;
  /** Change it (the app version, the user id) to drop every saved cache. */
  buster?: string;
  /** Which queries are saved. Default: successful ones whose `meta.persist` is not `false`. */
  shouldPersist?: (query: { state: { status: string }; meta?: Record<string, unknown> }) => boolean;
}

/** The `persistOptions` of `PersistQueryClientProvider`, with the Krizaka defaults. */
export function persistOptions({ persister, maxAge = PERSIST_MAX_AGE, buster = "", shouldPersist }: KrizakaPersistOptions): Omit<PersistQueryClientOptions, "queryClient"> {
  return {
    persister,
    maxAge,
    buster,
    dehydrateOptions: {
      shouldDehydrateQuery: shouldPersist ?? ((query) => query.state.status === "success" && query.meta?.persist !== false),
    },
  };
}
