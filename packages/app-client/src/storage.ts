import { chunkedStorage, type DiscoveryStorage } from "@krizaka/discovery";

/** Small private values on the device. Each platform brings its own adapter; the shell only knows this port. */
export interface KeyValueStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/** The three calls of `expo-secure-store` the shell uses, so the package imports no native module. */
export interface SecureStoreModule {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

/** The Keychain on iOS, Keystore-backed storage on Android: `secureStorage(SecureStore)`. */
export function secureStorage(store: SecureStoreModule): KeyValueStorage {
  return {
    get: (key) => store.getItemAsync(key),
    set: (key, value) => store.setItemAsync(key, value),
    remove: (key) => store.deleteItemAsync(key),
  };
}

/** The part of `window.localStorage` the web preview uses. */
export interface BrowserArea {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * The web target of an app (a preview in a browser) has no secure enclave: `localStorage` stands in. A browser that
 * refuses it (private mode) must not break the app, so every failure reads as « nothing stored ».
 */
export function browserStorage(area: () => BrowserArea): KeyValueStorage {
  const attempt = <T>(run: (a: BrowserArea) => T, fallback: T): T => {
    try {
      return run(area());
    } catch {
      return fallback;
    }
  };
  return {
    get: async (key) => attempt((a) => a.getItem(key), null),
    set: async (key, value) => attempt((a) => a.setItem(key, value), undefined),
    remove: async (key) => attempt((a) => a.removeItem(key), undefined),
  };
}

/** The signed manifest is longer than a Keychain value allows: it is stored in pieces. */
export function discoveryStorage(storage: KeyValueStorage): DiscoveryStorage {
  return chunkedStorage({
    getItem: (key) => storage.get(key),
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.remove(key),
  });
}
