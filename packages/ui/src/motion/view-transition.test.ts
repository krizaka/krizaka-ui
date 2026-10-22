import { describe, expect, it } from "vitest";

import {
  canViewTransition,
  crossFallback,
  runViewTransition,
  sharedElementStyle,
  transitionPage,
} from "./view-transition";

const done = () => ({ finished: Promise.resolve() });

describe("view transitions", () => {
  it("runs the update at once without the API", async () => {
    let ran = 0;
    await runViewTransition(() => ran++, { doc: {} });
    expect(ran).toBe(1);
    expect(canViewTransition({})).toBe(false);
  });

  it("never starts a transition under reduced motion", async () => {
    let started = 0;
    const doc = { startViewTransition: () => (started++, done()) };
    let ran = 0;
    await runViewTransition(() => ran++, { doc, reduced: true });
    expect(ran).toBe(1);
    expect(started).toBe(0);
  });

  it("waits for finished when the API exists, and survives a skipped transition", async () => {
    const doc = {
      startViewTransition: (update: () => void) => {
        update();
        return { finished: Promise.reject(new Error("skipped")) };
      },
    };
    let ran = 0;
    await expect(runViewTransition(() => ran++, { doc })).resolves.toBeUndefined();
    expect(ran).toBe(1);
  });

  it("cross-fades the root when there is no API and motion is allowed", () => {
    const calls: unknown[] = [];
    const doc = { documentElement: { animate: (f: unknown, o: unknown) => (calls.push([f, o]), "a") } };
    expect(crossFallback(() => undefined, { doc }, { duration: 300 })).toBe("a");
    expect(calls[0]).toEqual([[{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" }]);
  });

  it("starts no fade under reduced motion", () => {
    const doc = { documentElement: { animate: () => { throw new Error("no fade"); } } };
    expect(crossFallback(() => undefined, { doc, reduced: true })).toBeNull();
  });

  it("transitionPage uses the native transition when present", async () => {
    let started = 0;
    const doc = { startViewTransition: (u: () => void) => (started++, u(), done()) };
    await transitionPage(() => undefined, { doc });
    expect(started).toBe(1);
  });

  it("sharedElementStyle accepts one identifier only", () => {
    expect(sharedElementStyle("booking-card")).toEqual({ viewTransitionName: "booking-card" });
    expect(() => sharedElementStyle("two words")).toThrow(RangeError);
  });
});
