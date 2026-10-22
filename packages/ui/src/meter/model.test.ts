import { describe, expect, it } from "vitest";

import { meterModel } from "./model";

describe("meterModel: what the web and the native Meter both read", () => {
  it("clamps the ratio to the range and says the percentage by default", () => {
    expect(meterModel({ value: 18, max: 50 })).toMatchObject({ ratio: 0.36, words: "36 %" });
    expect(meterModel({ value: 80, min: 20, max: 60 }).ratio).toBe(1);
    expect(meterModel({ value: -5 }).ratio).toBe(0);
  });

  it("keeps the caller's words", () => {
    expect(meterModel({ value: 18, max: 50, valueText: "18 GB of 50 GB" }).words).toBe("18 GB of 50 GB");
  });

  it.each([
    [10, "low", "success"],
    [80, "low", "warning"],
    [95, "low", "danger"],
    [10, "high", "danger"],
    [80, "high", "warning"],
    [95, "high", "success"],
  ] as const)("tones %i with the %s end good: %s", (value, optimum, level) => {
    expect(meterModel({ value, optimum, thresholds: { low: 0.5, high: 0.9 } }).level).toBe(level);
  });

  it("is the accent without thresholds", () => {
    expect(meterModel({ value: 95 }).level).toBe("ok");
  });

  it("measures each part against the whole range, in words", () => {
    const { shares, arcs } = meterModel({
      value: 0,
      parts: [
        { label: "Creator", value: 90 },
        { label: "Platform", value: 10, valueText: "$1" },
      ],
    });
    expect(shares).toEqual([
      { label: "Creator", value: 90, i: 0, ratio: 0.9, words: "90 %" },
      { label: "Platform", value: 10, valueText: "$1", i: 1, ratio: 0.1, words: "$1" },
    ]);
    expect(arcs).toEqual([
      { part: 0, len: 0.9, start: 0 },
      { part: 1, len: 0.1, start: 0.9 },
    ]);
  });

  it("draws one arc of the whole value without parts", () => {
    expect(meterModel({ value: 25 }).arcs).toEqual([{ part: undefined, len: 0.25, start: 0 }]);
  });
});
