import { defineKeys } from "../src/keys";

describe("defineKeys", () => {
  const videoKeys = defineKeys("videos", {
    list: (filters: { q?: string }) => [filters],
    detail: (id: string) => [id],
    mine: () => [],
  });

  it("builds scoped, frozen keys", () => {
    expect(videoKeys.all).toEqual(["videos"]);
    expect(videoKeys.list({ q: "cat" })).toEqual(["videos", "list", { q: "cat" }]);
    expect(videoKeys.detail("v1")).toEqual(["videos", "detail", "v1"]);
    expect(videoKeys.mine()).toEqual(["videos", "mine"]);
    expect(Object.isFrozen(videoKeys.detail("v1"))).toBe(true);
    // the types follow: a tuple, not unknown[]
    const key: readonly ["videos", "detail", string] = videoKeys.detail("v2");
    expect(key[2]).toBe("v2");
  });

  it("reserves `all`", () => {
    expect(() => defineKeys("x", { all: () => [] })).toThrow(/reserved/);
  });
});
