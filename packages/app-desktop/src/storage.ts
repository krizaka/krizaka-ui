import type { KeyValueStorage } from "@krizaka/app-client";

import { call, type TauriBridge } from "./bridge";

/**
 * The macOS Keychain as the `KeyValueStorage` port of `@krizaka/app-client`: a Mac app keeps its session with the same
 * `createSessionStore` and calls its API with the same `createApiClient` as the mobile apps. A key is lowercase letters,
 * digits, `.`, `-`, `_` (`yomizaka.session`); the native side refuses anything else.
 */
export function keychainStorage(bridge: Pick<TauriBridge, "invoke">): KeyValueStorage {
  return {
    get: (key) => call<string | null>(bridge, "secret_get", { key }),
    set: (key, value) => call<void>(bridge, "secret_set", { key, value }),
    remove: (key) => call<void>(bridge, "secret_remove", { key }),
  };
}
