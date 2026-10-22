import { describe, expect, it, vi } from "vitest";

import { createSessionStore } from "../src/session";
import { type BrowserArea, browserStorage, discoveryStorage, type KeyValueStorage, secureStorage } from "../src/storage";

function memory(): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => void data.set(key, value),
    remove: async (key) => void data.delete(key),
  };
}

describe("secureStorage", () => {
  it("maps the port onto the three SecureStore calls", async () => {
    const store = { getItemAsync: vi.fn(async () => "v"), setItemAsync: vi.fn(async () => {}), deleteItemAsync: vi.fn(async () => {}) };
    const storage = secureStorage(store);
    expect(await storage.get("k")).toBe("v");
    await storage.set("k", "x");
    await storage.remove("k");
    expect(store.setItemAsync).toHaveBeenCalledWith("k", "x");
    expect(store.deleteItemAsync).toHaveBeenCalledWith("k");
  });
});

describe("browserStorage", () => {
  it("reads and writes the area", async () => {
    const map = new Map<string, string>();
    const area: BrowserArea = { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) };
    const storage = browserStorage(() => area);
    await storage.set("k", "v");
    expect(await storage.get("k")).toBe("v");
    await storage.remove("k");
    expect(await storage.get("k")).toBeNull();
  });

  it("reads as empty and never throws when the browser refuses storage", async () => {
    const storage = browserStorage(() => {
      throw new Error("denied");
    });
    expect(await storage.get("k")).toBeNull();
    await expect(storage.set("k", "v")).resolves.toBeUndefined();
    await expect(storage.remove("k")).resolves.toBeUndefined();
  });
});

describe("discoveryStorage", () => {
  it("stores a long document in pieces and reads it back whole", async () => {
    const backing = memory();
    const storage = discoveryStorage(backing);
    const document = "x".repeat(4000);
    await storage.setItem("manifest", document);
    expect(backing.data.size).toBeGreaterThan(1);
    expect(await storage.getItem("manifest")).toBe(document);
    await storage.removeItem("manifest");
    expect(backing.data.size).toBe(0);
  });
});

describe("createSessionStore", () => {
  it("reads the stored token once", async () => {
    const backing = memory();
    backing.data.set("s", "t1");
    const get = vi.spyOn(backing, "get");
    const session = createSessionStore({ storage: backing, key: "s" });
    expect(await session.readToken()).toBe("t1");
    expect(await session.readToken()).toBe("t1");
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("tells subscribers when a session starts and ends, not when its token is refreshed", async () => {
    const session = createSessionStore({ storage: memory(), key: "s" });
    const listener = vi.fn();
    const stop = session.onChange(listener);
    await session.saveToken("a");
    expect(listener).toHaveBeenCalledTimes(1);
    await session.saveToken("b");
    expect(listener).toHaveBeenCalledTimes(1);
    await session.clearToken();
    expect(listener).toHaveBeenCalledTimes(2);
    await session.clearToken();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(await session.readToken()).toBeNull();
    stop();
    await session.saveToken("c");
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
