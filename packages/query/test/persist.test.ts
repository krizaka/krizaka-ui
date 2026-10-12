import { persistQueryClientRestore, persistQueryClientSave } from "@tanstack/react-query-persist-client";

import { createQueryClient } from "../src/client";
import { createPersister, mmkvStorage, PERSIST_MAX_AGE, persistOptions } from "../src/persist";

const memory = () => {
  const map = new Map<string, string>();
  return { map, getItem: (k: string) => map.get(k), setItem: (k: string, v: string) => void map.set(k, v), removeItem: (k: string) => void map.delete(k) };
};

describe("createPersister", () => {
  it("round-trips the cache through a storage (save, restore in a new client)", async () => {
    const storage = memory();
    const persister = createPersister({ storage, throttleTime: 0 });
    const options = persistOptions({ persister, buster: "1" });
    const before = createQueryClient({ gcTime: PERSIST_MAX_AGE });
    before.setQueryData(["stories"], [{ id: "s1" }]);
    before.setQueryData(["secret"], "x");
    before.getQueryCache().find({ queryKey: ["secret"] })!.options.meta = { persist: false };
    await persistQueryClientSave({ queryClient: before, ...options });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect([...storage.map.keys()]).toEqual(["krizaka-query"]);

    const after = createQueryClient({ gcTime: PERSIST_MAX_AGE });
    await persistQueryClientRestore({ queryClient: after, ...options });
    expect(after.getQueryData(["stories"])).toEqual([{ id: "s1" }]);
    expect(after.getQueryData(["secret"])).toBeUndefined();

    // another buster drops the saved cache
    const busted = createQueryClient();
    await persistQueryClientRestore({ queryClient: busted, ...persistOptions({ persister, buster: "2", maxAge: 1000 }) });
    expect(busted.getQueryData(["stories"])).toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(storage.map.size).toBe(0);
  });

  it("does nothing without a storage (a server render) and accepts a custom filter", async () => {
    const persister = createPersister({ storage: null });
    await expect(persister.restoreClient()).resolves.toBeUndefined();
    const options = persistOptions({ persister, shouldPersist: () => false });
    expect(options.maxAge).toBe(PERSIST_MAX_AGE);
    expect(options.dehydrateOptions!.shouldDehydrateQuery!({ state: { status: "success" } } as never)).toBe(false);
  });
});

describe("mmkvStorage", () => {
  it("adapts MMKV v3 (delete) and v4 (remove)", () => {
    const values = new Map<string, string>();
    const v3 = { getString: (k: string) => values.get(k), set: (k: string, v: string) => void values.set(k, v), delete: (k: string) => void values.delete(k) };
    const storage = mmkvStorage(v3);
    storage.setItem("a", "1");
    expect(storage.getItem("a")).toBe("1");
    storage.removeItem("a");
    expect(storage.getItem("a")).toBeNull();
    const remove = vi.fn();
    mmkvStorage({ getString: () => undefined, set: () => undefined, remove }).removeItem("b");
    expect(remove).toHaveBeenCalledWith("b");
  });
});
