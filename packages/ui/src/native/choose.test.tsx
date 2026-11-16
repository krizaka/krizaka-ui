import { describe, expect, it } from "@jest/globals";

import { choose } from "./choose";
import { keyed } from "./keyed";

describe("choose", () => {
  it("returns the first case that holds, else the fallback", () => {
    expect(choose("none", [false, "a"], [true, "b"], [true, "c"])).toBe("b");
    expect(choose("none", [false, "a"], [0, "b"])).toBe("none");
    expect(choose("only")).toBe("only");
  });
});

describe("keyed", () => {
  it("ranks the items of the same kind, never across kinds", () => {
    const rows = keyed(["a", "b", "a", "a"], (x) => x);
    expect(rows.map((r) => r.key)).toEqual(["a#0", "b#0", "a#1", "a#2"]);
    expect(rows.map((r) => r.index)).toEqual([0, 1, 2, 3]);
    expect(rows.map((r) => r.item)).toEqual(["a", "b", "a", "a"]);
  });
});
