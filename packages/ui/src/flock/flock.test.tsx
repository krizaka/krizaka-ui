import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { Flock, type FlockBird } from "./index";

const birds: FlockBird[] = [
  { bird: "owl", x: 25, y: 95, size: 20 },
  { bird: "duck", x: 50, y: 95, size: 20 },
  { bird: "pigeon", x: 75, y: 95, size: 20 },
];

let visible: (on: boolean) => void;
let reduced = false;
const animations: { cancel: ReturnType<typeof vi.fn>; keyframes: Keyframe[] }[] = [];

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  animations.length = 0;
  vi.stubGlobal(
    "matchMedia",
    (query: string) => ({ matches: reduced && query.includes("reduce"), media: query, addEventListener: () => {}, removeEventListener: () => {} }),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
        visible = (on) => cb([{ isIntersecting: on }]);
      }
      observe() {}
      disconnect() {}
    },
  );
  HTMLElement.prototype.animate = function (keyframes: Keyframe[]) {
    const cancel = vi.fn();
    animations.push({ cancel, keyframes });
    return { cancel, finished: Promise.resolve() } as unknown as Animation;
  };
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const looks = (c: HTMLElement) => [...c.querySelectorAll("svg")].map((s) => s.getAttribute("data-look"));
const mount = (props = {}) => {
  const view = render(<Flock birds={birds} random={() => 0} {...props} />);
  act(() => visible(true));
  return view;
};

describe("Flock", () => {
  it("is decorative, puts every bird at ease in character, with no axe violation", async () => {
    vi.useRealTimers(); // axe awaits real timers
    const { container } = mount();
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
    const svgs = [...container.querySelectorAll("svg")];
    expect(svgs.map((s) => s.getAttribute("data-bird"))).toEqual(["owl", "duck", "pigeon"]);
    for (const svg of svgs) expect(svg.hasAttribute("data-life")).toBe(true);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("makes two neighbours glance at each other, then look away", () => {
    const { container } = mount({ courier: false });
    expect(looks(container)).toEqual([null, null, null]);
    act(() => void vi.advanceTimersByTime(4300)); // the first glance (random = 0: the first pair, the shortest wait)
    expect(looks(container)).toEqual(["right", "left", null]);
    act(() => void vi.advanceTimersByTime(1600));
    expect(looks(container)).toEqual([null, null, null]);
  });

  it("sends the pigeon across with its parcel, flapping, then it hops at the other side and comes back", async () => {
    const { container } = mount({ glance: false });
    const pigeon = container.querySelector("svg[data-bird=pigeon]")!;
    await act(async () => void vi.advanceTimersByTime(9100));
    expect(animations).toHaveLength(1);
    const [from, , to] = animations[0]!.keyframes as { transform: string }[];
    expect(from!.transform).toBe("translate(0px, 0)");
    expect(to!.transform).toMatch(/^translate\(-?\d+(\.\d+)?px, 0\)$/);
    // It has landed beside the farthest bird (the owl), which looks at it, and hops on the doorstep.
    expect(pigeon.hasAttribute("data-poked")).toBe(true);
    expect(looks(container)[0]).toBe("right");
    await act(async () => void vi.advanceTimersByTime(1400));
    expect(pigeon.hasAttribute("data-poked")).toBe(false);
    expect(animations).toHaveLength(2); // and back
    expect((animations[1]!.keyframes as { transform: string }[])[0]!.transform).toBe(from!.transform.replace("0px", (to!.transform.match(/translate\((-?[\d.]+)px/) as RegExpMatchArray)[1] + "px"));
  });

  it("looks up when a pointer comes near, and jumps when tapped", () => {
    const { container } = mount({ glance: false, courier: false });
    const owl = container.querySelector("[data-flock-bird=owl]")!;
    fireEvent.pointerEnter(owl, { pointerType: "mouse" });
    expect(looks(container)[0]).toBe("up");
    fireEvent.pointerLeave(owl);
    expect(looks(container)[0]).toBeNull();
    fireEvent.pointerDown(owl);
    expect(container.querySelector("svg[data-bird=owl]")!.hasAttribute("data-poked")).toBe(true);
    act(() => void vi.advanceTimersByTime(1700));
    expect(container.querySelector("svg[data-bird=owl]")!.hasAttribute("data-poked")).toBe(false);
  });

  it("does nothing off screen and nothing under reduced motion", () => {
    const off = render(<Flock birds={birds} random={() => 0} />);
    act(() => void vi.advanceTimersByTime(60000));
    expect(looks(off.container)).toEqual([null, null, null]);
    expect(animations).toHaveLength(0);
    off.unmount();
    reduced = true;
    const still = mount();
    act(() => void vi.advanceTimersByTime(60000));
    expect(looks(still.container)).toEqual([null, null, null]);
    expect(animations).toHaveLength(0);
    fireEvent.pointerEnter(still.container.querySelector("[data-flock-bird=owl]")!, { pointerType: "mouse" });
    expect(looks(still.container)[0]).toBeNull();
  });

  it("stops its moments when it leaves the screen and cancels a flight in progress", async () => {
    const { container, unmount } = mount({ glance: false });
    await act(async () => void vi.advanceTimersByTime(9100));
    act(() => visible(false));
    expect(animations[0]!.cancel).toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(60000));
    expect(animations).toHaveLength(1);
    expect(container.querySelector("svg[data-bird=pigeon]")!.hasAttribute("data-flying")).toBe(false);
    unmount();
  });
});
