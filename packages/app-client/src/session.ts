import type { KeyValueStorage } from "./storage";

export interface SessionStore {
  readToken(): Promise<string | null>;
  saveToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
  /** Called when a session starts or ends, not when its token is refreshed. Returns the unsubscribe function. */
  onChange(listener: () => void): () => void;
}

/**
 * The bearer session of an app: the same signed token the web keeps in an httpOnly cookie, kept here in the device's
 * secure storage and sent as `Authorization: Bearer`. Screens subscribe to `onChange` to forget what they loaded for
 * the previous account.
 */
export function createSessionStore(options: { storage: KeyValueStorage; key: string }): SessionStore {
  const { storage, key } = options;
  let cached: string | null | undefined;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  return {
    async readToken() {
      if (cached === undefined) cached = await storage.get(key);
      return cached;
    },
    async saveToken(token) {
      const started = !cached;
      cached = token;
      await storage.set(key, token);
      if (started) notify();
    },
    async clearToken() {
      const ended = cached !== null;
      cached = null;
      await storage.remove(key);
      if (ended) notify();
    },
    onChange(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}
