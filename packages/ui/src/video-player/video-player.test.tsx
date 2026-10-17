import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { type HlsModule, VideoPlayer } from "./index";

const video = () => document.querySelector("video") as HTMLVideoElement;

function stubMedia() {
  const play = vi.fn(function (this: HTMLVideoElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  const pause = vi.fn(function (this: HTMLVideoElement) {
    this.dispatchEvent(new Event("pause"));
  });
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: pause });
  return { play, pause };
}

describe("VideoPlayer", () => {
  it("is a named region with named controls, with no axe violation", async () => {
    stubMedia();
    const { container } = render(<VideoPlayer title="Video: sunset" src="/clip.mp4" poster="/clip.jpg" tracks={[{ src: "/fr.vtt", srcLang: "fr", label: "Français" }]} />);
    expect(screen.getByRole("region", { name: "Video: sunset" }).tabIndex).toBe(0);
    expect(screen.getAllByRole("button", { name: "Play" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Mute" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Speed 1×" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Subtitles: off" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("slider", { name: "Seek" })).toBeTruthy();
    expect(video().getAttribute("src")).toBe("/clip.mp4");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("plays, pauses and mutes from the keyboard; the buttons follow", async () => {
    const { play } = stubMedia();
    const user = userEvent.setup();
    render(<VideoPlayer title="Video" src="/clip.mp4" />);
    screen.getByRole("region").focus();
    await user.keyboard("k");
    expect(play).toHaveBeenCalled();
    expect(await screen.findByRole("button", { name: "Pause" })).toBeTruthy();
    await user.keyboard("m");
    expect(screen.getByRole("button", { name: "Unmute" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Speed 1×" }));
    expect(screen.getByRole("button", { name: "Speed 1.25×" })).toBeTruthy();
    expect(video().playbackRate).toBe(1.25);
  });

  it("resolves a signed source on the first play, not before", async () => {
    stubMedia();
    const user = userEvent.setup();
    const src = vi.fn(async () => "/signed.mp4?token=1");
    render(<VideoPlayer title="Video" src={src} preload="none" />);
    expect(src).not.toHaveBeenCalled();
    await user.click(screen.getAllByRole("button", { name: "Play" })[0]!);
    await waitFor(() => expect(video().getAttribute("src")).toBe("/signed.mp4?token=1"));
  });

  it("loads hls.js only when the browser cannot play HLS itself", async () => {
    stubMedia();
    const attach = vi.fn();
    class Hls {
      static isSupported = () => true;
      static Events = { ERROR: "hlsError" };
      static ErrorTypes = { NETWORK_ERROR: "net", MEDIA_ERROR: "media" };
      loadSource = vi.fn();
      attachMedia = attach;
      destroy = vi.fn();
      startLoad = vi.fn();
      recoverMediaError = vi.fn();
      on = vi.fn();
    }
    const loadHls = vi.fn(async () => ({ default: Hls }) as unknown as HlsModule);
    render(<VideoPlayer title="Video" src="/master.m3u8" loadHls={loadHls} />);
    await waitFor(() => expect(attach).toHaveBeenCalledWith(video()));
    render(<VideoPlayer title="Video 2" src="/clip.mp4" loadHls={loadHls} />);
    expect(loadHls).toHaveBeenCalledTimes(1);
  });

  it("announces a failure with a retry, and hides the controls under a gate", async () => {
    stubMedia();
    const { rerender } = render(<VideoPlayer title="Video" src="/clip.mp4" />);
    fireEvent.error(video());
    expect(screen.getByRole("alert").textContent).toContain("This video cannot be played.");
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    rerender(<VideoPlayer title="Video" src="/clip.mp4" overlay={<p>Sign in to watch</p>} />);
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.getByText("Sign in to watch")).toBeTruthy();
  });

  it("autoplays only while on screen, and again when it comes back (a page of loops plays the ones in view)", () => {
    const { play } = stubMedia();
    const observers: IntersectionObserverCallback[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          observers.push(cb);
        }
        observe() {}
        disconnect() {}
      },
    );
    const see = (visible: boolean) => act(() => observers.forEach((cb) => cb([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver)));
    render(<VideoPlayer title="Loop" src="/loop.mp4" autoPlay loop controls={false} preload="none" />);
    expect(play).not.toHaveBeenCalled();
    see(true);
    expect(play).toHaveBeenCalledTimes(1);
    see(false);
    see(true);
    expect(play).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("does not autoplay under reduced motion", () => {
    const { play } = stubMedia();
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
    render(<VideoPlayer title="Video" src="/clip.mp4" autoPlay />);
    expect(play).not.toHaveBeenCalled();
    window.matchMedia = matchMedia;
  });
});
