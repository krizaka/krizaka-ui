import { act, fireEvent, render, screen } from "@testing-library/react";

import { ClipPlayer } from "../ClipPlayer";

const sources = { mp4: "https://cdn.test/a.mp4", webm: "https://cdn.test/a.webm", poster: "https://cdn.test/a.webp" };
const labels = {
  badge: "Video · 5 s",
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Sound on",
  enlarge: "Open larger",
  close: "Close",
};
let observed: ((entries: { isIntersecting: boolean }[]) => void) | null = null;

function setup(reduce: boolean) {
  observed = null;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
      observed = cb;
    }
    observe() {}
    disconnect() {}
  };
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: pause });
  return { play, pause };
}

describe("ClipPlayer", () => {
  it("plays when it comes into view and pauses when it leaves", () => {
    const { play, pause } = setup(false);
    render(<ClipPlayer sources={sources} title="x" labels={labels} />);
    act(() => observed!([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => observed!([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();
  });

  it("has play/pause and sound buttons, and a pause by hand is not undone by scrolling back", () => {
    const { play } = setup(false);
    const { container } = render(<ClipPlayer sources={sources} title="x" labels={labels} />);
    const video = container.querySelector("video")!;
    act(() => observed!([{ isIntersecting: true }]));
    Object.defineProperty(video, "paused", { configurable: true, value: false });
    fireEvent.play(video);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    Object.defineProperty(video, "paused", { configurable: true, value: true });
    fireEvent.pause(video);
    act(() => observed!([{ isIntersecting: false }]));
    act(() => observed!([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    const sound = screen.getByRole("button", { name: "Sound on" });
    expect(sound).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(sound);
    expect(video.muted).toBe(false);
    expect(screen.getByRole("button", { name: "Mute" })).toHaveAttribute("aria-pressed", "true");
  });

  it("never plays by itself under reduced motion: the poster and a play button", () => {
    const { play } = setup(true);
    const { container } = render(<ClipPlayer sources={sources} title="x" labels={labels} />);
    expect(observed).toBeNull();
    expect(play).not.toHaveBeenCalled();
    expect(container.querySelector("video")).toHaveAttribute("data-reduced-motion", "true");
    fireEvent.click(screen.getAllByRole("button", { name: "Play" })[0]);
    expect(play).toHaveBeenCalledTimes(1);
  });
});
