import { describe, expect, it } from "vitest";

import { chunkedStorage } from "../src/index";
import { memory } from "./fixtures";

describe("chunkedStorage", () => {
  it("stores a long value as pieces under the size and reads it back whole", async () => {
    const inner = memory();
    const store = chunkedStorage(inner, 10);
    const value = "x".repeat(25) + "é";
    await store.setItem("k", value);
    expect([...inner.data.values()].every((v) => v.length <= 10)).toBe(true);
    expect(await store.getItem("k")).toBe(value);
  });
  it("replaces a longer value by a shorter one without leaving pieces behind", async () => {
    const inner = memory();
    const store = chunkedStorage(inner, 4);
    await store.setItem("k", "abcdefghijkl");
    await store.setItem("k", "ab");
    expect(await store.getItem("k")).toBe("ab");
    expect([...inner.data.keys()].sort()).toEqual(["k.0", "k.n"]);
  });
  it("answers null for nothing stored, a bad count, and a missing piece (never a truncated value)", async () => {
    const inner = memory();
    const store = chunkedStorage(inner, 4);
    expect(await store.getItem("k")).toBeNull();
    inner.data.set("k.n", "garbage");
    expect(await store.getItem("k")).toBeNull();
    await store.setItem("k", "abcdefgh");
    inner.data.delete("k.1");
    expect(await store.getItem("k")).toBeNull();
  });
  it("removes every piece", async () => {
    const inner = memory();
    const store = chunkedStorage(inner, 4);
    await store.setItem("k", "abcdefgh");
    await store.removeItem("k");
    expect(inner.data.size).toBe(0);
  });
  it("uses a default piece size under the keychain limit", async () => {
    const inner = memory();
    await chunkedStorage(inner).setItem("k", "y".repeat(4000));
    expect([...inner.data.entries()].filter(([k]) => k !== "k.n").every(([, v]) => v.length <= 1500)).toBe(true);
  });
});
