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
  }, 30_000);

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

  it("greets once as it first comes into view: each bird jumps in turn, left to right", () => {
    const { container } = mount({ glance: false, courier: false, greet: true });
    const poked = () => [...container.querySelectorAll("svg")].map((v) => v.hasAttribute("data-poked"));
    act(() => void vi.advanceTimersByTime(10));
    expect(poked()).toEqual([true, false, false]);
    act(() => void vi.advanceTimersByTime(120));
    expect(poked()).toEqual([true, true, false]);
    act(() => void vi.advanceTimersByTime(2000));
    expect(poked()).toEqual([false, false, false]);
    act(() => visible(false));
    act(() => visible(true));
    expect(poked()).toEqual([false, false, false]); // once
  });

  it("makes the bird the page points at look up and jump, and lets it go", () => {
    const { container, rerender } = mount({ glance: false, courier: false });
    rerender(<Flock birds={birds} random={() => 0} glance={false} courier={false} active="duck" />);
    act(() => void vi.advanceTimersByTime(10));
    expect(looks(container)).toEqual([null, "up", null]);
    expect(container.querySelector("svg[data-bird=duck]")!.hasAttribute("data-poked")).toBe(true);
    rerender(<Flock birds={birds} random={() => 0} glance={false} courier={false} active={null} />);
    expect(looks(container)).toEqual([null, null, null]);
  });

  it("is livelier with a higher tempo: a glance comes twice as soon", () => {
    const { container } = mount({ courier: false, tempo: 2 });
    act(() => void vi.advanceTimersByTime(2200)); // 4200 / 2
    expect(looks(container)).toEqual(["right", "left", null]);
  });

  describe("scenes", () => {
    const cast: FlockBird[] = [
      { bird: "owl", x: 14, y: 95, size: 12 },
      { bird: "flamingo", x: 30, y: 95, size: 12 },
      { bird: "crane", x: 46, y: 95, size: 12 },
      { bird: "beaver", x: 62, y: 95, size: 12 },
      { bird: "magpie", x: 78, y: 95, size: 12 },
      { bird: "pigeon", x: 92, y: 95, size: 12 },
    ];
    const props = (c: HTMLElement) => [...c.querySelectorAll("[data-flock-prop]")].map((e) => e.getAttribute("data-flock-prop"));
    // A fixed source of chance (mulberry32) whose first draws are 0.5, 0, 0 (not a long pause, the shortest wait, the first beat).
    const seeded = (seed: number) => {
      let a = seed;
      return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const mountCast = (extra = {}, seq?: number[]) => {
      let n = 0;
      const first = seq ?? [0.5, 0, 0];
      const rest = seeded(7);
      const random = () => (n < first.length ? first[n++]! : rest());
      const view = render(<Flock birds={cast} random={random} glance={false} courier={false} scenes {...extra} />);
      act(() => visible(true));
      return view;
    };

    it("is off unless asked: no prop, no body animation", () => {
      const { container } = render(<Flock birds={cast} random={() => 0} glance={false} courier={false} />);
      act(() => visible(true));
      act(() => void vi.advanceTimersByTime(60000));
      expect(props(container)).toEqual([]);
      expect(animations).toHaveLength(0);
    });

    it("opens with the owl reading: a book, a leaf turned, then the owl looks away from it", async () => {
      const { container } = mountCast();
      await act(async () => void vi.advanceTimersByTime(2700)); // the first wait (random = 0: the shortest)
      expect(props(container)).toEqual(["book"]);
      expect(container.querySelector("svg[data-bird=owl]")!.getAttribute("data-look")).toBe("left");
      await act(async () => void vi.advanceTimersByTime(5000));
      expect(props(container)).not.toContain("book"); // it has put the book away
    });

    it("never picks the same bird twice in a row, and runs one scene at a time", async () => {
      const { container } = mountCast();
      const seen: (string | null)[] = [];
      for (let t = 0; t < 40; t++) {
        await act(async () => void vi.advanceTimersByTime(1000));
        const live = props(container);
        expect(live.length).toBeLessThanOrEqual(2);
        for (const p of live) if (!seen.includes(p)) seen.push(p);
      }
      expect(seen.length).toBeGreaterThan(2); // a book, a speech mark, a log… the birds take turns
    });

    it("lets the flamingo speak, its neighbour listen and answer", async () => {
      // random: not a long pause, the flamingo among the beats (the owl is excluded by `last` after we start with it).
      const { container } = mountCast({}, [0.9, 0.2, 0.2]);
      let said = false;
      for (let t = 0; t < 80 && !said; t++) {
        await act(async () => void vi.advanceTimersByTime(500));
        said = container.querySelector("[data-flock-prop=say]") !== null;
      }
      expect(said).toBe(true);
    });

    it("hands the parcel over: the pigeon flies back empty-handed and the receiver reacts", async () => {
      const { container } = mountCast({ courier: true, scenes: true }, [0.9]);
      const pigeon = container.querySelector("svg[data-bird=pigeon]")!;
      expect(pigeon.querySelector(".kzb-parcel")).not.toBeNull();
      await act(async () => void vi.advanceTimersByTime(9100)); // it has landed
      expect(pigeon.querySelector(".kzb-parcel")).toBeNull();
      expect(props(container)).toContain("gift");
      for (let t = 0; t < 30 && !pigeon.querySelector(".kzb-parcel"); t++) await act(async () => void vi.advanceTimersByTime(1000)); // the reaction ends, it flies back
      expect(pigeon.querySelector(".kzb-parcel")).not.toBeNull();
      expect(props(container)).not.toContain("gift");
    });

    it("stops and clears every prop when it leaves the screen, and is still under reduced motion", async () => {
      const { container } = mountCast();
      await act(async () => void vi.advanceTimersByTime(2700));
      expect(props(container).length).toBeGreaterThan(0);
      act(() => visible(false));
      expect(props(container)).toEqual([]);
      await act(async () => void vi.advanceTimersByTime(60000));
      expect(props(container)).toEqual([]);
      reduced = true;
      const still = mountCast();
      await act(async () => void vi.advanceTimersByTime(60000));
      expect(props(still.container)).toEqual([]);
    });

    it("waits for the page to settle (html[data-motion])", async () => {
      document.documentElement.setAttribute("data-motion", "settling");
      const { container } = mountCast();
      await act(async () => void vi.advanceTimersByTime(20000));
      expect(props(container)).toEqual([]);
      await act(async () => void document.documentElement.setAttribute("data-motion", "ready"));
      await act(async () => void vi.advanceTimersByTime(3000));
      expect(props(container).length).toBeGreaterThan(0);
      document.documentElement.removeAttribute("data-motion");
    });

    it("marks its stage as a motion scope, so the page pauses its loops off screen", () => {
      const { container } = mountCast();
      expect(container.firstElementChild!.hasAttribute("data-motion-scope")).toBe(true);
    });
  });
});
