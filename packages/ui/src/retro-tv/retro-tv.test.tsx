import { act, render, screen } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { RetroTv } from "./index";

const clip = (props: Partial<React.ComponentProps<typeof RetroTv>> = {}) => (
  <RetroTv title="Story: evening at the shop" src="/story.mp4" poster="/story.jpg" channel="CH 3 · Plateau" {...props} />
);

describe("RetroTv", () => {
  it("renders the cabinet, channel, vertical player and accessible controls", async () => {
    const { container } = render(clip());

    expect(container.querySelector(".kz-rtv")?.getAttribute("data-variant")).toBe("cabinet");
    expect(screen.getByText("CH 3 · Plateau")).toBeTruthy();
    expect(screen.getByRole("region", { name: "Story: evening at the shop" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(2);
    expect(container.querySelector(".kz-rtv-player img")?.getAttribute("src")).toBe("/story.jpg");
    expect(container.querySelector("video")?.getAttribute("preload")).toBe("none");
    expect(container.querySelector(".kz-rtv-cabinet")?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("supports the portable cabinet variant", () => {
    const { container } = render(clip({ variant: "portable" }));

    expect(container.querySelector(".kz-rtv")?.getAttribute("data-variant")).toBe("portable");
    expect(container.querySelectorAll(".kz-rtv-knob")).toHaveLength(2);
  });

  it("shows SVG static when off without mounting or loading a video", () => {
    const { container } = render(clip({ off: true }));

    expect(container.querySelector("svg.kz-rtv-noise")).toBeTruthy();
    expect(container.querySelector("feTurbulence")).toBeTruthy();
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByText("Story: evening at the shop", { selector: ".sr-only" })).toBeTruthy();
  });

  it("autoplays muted only after the player enters the viewport", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    const observers: IntersectionObserverCallback[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );

    const { container } = render(clip());
    const video = container.querySelector("video")!;
    Object.defineProperty(video, "paused", { configurable: true, get: () => false });

    expect(video.muted).toBe(true);
    expect(play).not.toHaveBeenCalled();
    act(() => observers.forEach((callback) => callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)));
    expect(play).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not autoplay or power on under reduced motion, even when visible", () => {
    const previous = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
    const play = vi.fn(() => Promise.resolve());
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    const observers: IntersectionObserverCallback[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );

    const { container } = render(clip());
    act(() => observers.forEach((callback) => callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)));

    expect(container.querySelector(".kz-rtv")?.getAttribute("data-powered")).toBeNull();
    expect(container.querySelector(".kz-rtv-noise")).toBeNull();
    expect(play).not.toHaveBeenCalled();
    window.matchMedia = previous;
    vi.unstubAllGlobals();
  });
});
