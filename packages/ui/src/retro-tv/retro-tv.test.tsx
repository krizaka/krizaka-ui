import { act, fireEvent, render, screen } from "@testing-library/react";

import { EmbedFacade } from "../embed-facade";
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
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toMatch(/\.kz-rtv-noise\{[^}]*filter:contrast\(1\.3\) brightness\(\.85\)/);
    expect(css).not.toContain(".kz-rtv-noise rect{filter:");
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByText("Story: evening at the shop", { selector: ".sr-only" })).toBeTruthy();
  });

  it("wraps all controls at the 288px example width when captions are available", () => {
    const { container } = render(
      <div style={{ width: 288 }}>
        {clip({ tracks: [{ src: "/fr.vtt", srcLang: "fr", label: "Français" }] })}
      </div>,
    );
    const controls = container.querySelector(".kz-rtv-player .flex.items-center.gap-1");

    expect(controls?.classList.contains("flex-wrap")).toBe(true);
    expect(controls?.querySelectorAll("button")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Subtitles: off" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Full screen" })).toBeTruthy();
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

describe("RetroTv with a platform's reel (krizaka-ui#605)", () => {
  it("shows an EmbedFacade on its screen instead of the player, and loads nothing from the platform before the click", async () => {
    const { container } = render(
      <RetroTv title="Latest reel" channel="CH 3">
        <EmbedFacade platform="youtube-shorts" url="https://www.youtube.com/shorts/abcDEF_-123" title="Latest reel" playLabel="Load YouTube and play" />
      </RetroTv>,
    );
    expect(container.querySelector(".kz-rtv-screen .kz-embed")).toBeTruthy();
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("button", { name: "Load YouTube and play" })).toBeTruthy();
    expect(container.querySelector("style")?.textContent).toContain(".kz-rtv-screen .kz-embed{height:100%");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("is no longer deprecated: Akinaza's shop pages use it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<RetroTv title="Story" src="/story.mp4" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});


describe("RetroTv playlist (akinaza#469)", () => {
  const list = [
    { id: "a", title: "Alpha", src: "/a.mp4", poster: "/a.jpg" },
    { id: "b", title: "Beta", src: "/b.mp4", poster: "/b.jpg", tracks: [{ src: "/b.vtt", srcLang: "en", label: "English" }] },
    { id: "c", title: "Gamma", src: "/c.mp4", poster: "/c.jpg" },
  ];
  const tv = (props: Partial<React.ComponentProps<typeof RetroTv>> = {}) => <RetroTv title="Shorts" playlist={list} {...props} />;
  const now = () => screen.getByText(/^Now playing:/).textContent;
  const reduce = () => {
    window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
  };
  const original = window.matchMedia;
  afterEach(() => { window.matchMedia = original; });

  it("plays in order and loops back to the first", () => {
    const { container } = render(tv());
    expect(now()).toContain("Alpha (1/3)");
    for (const title of ["Beta (2/3)", "Gamma (3/3)", "Alpha (1/3)"]) {
      fireEvent.ended(container.querySelector(".kz-rtv-layer[data-role=in] video")!);
      expect(now()).toContain(title);
    }
  });

  it("goes back from the first to the last", () => {
    render(tv());
    fireEvent.click(screen.getByRole("button", { name: "Previous video" }));
    expect(now()).toContain("Gamma (3/3)");
  });

  it.each(["channel", "crossfade", "slide"] as const)("transition %s keeps the outgoing layer, then drops it", (transition) => {
    vi.useFakeTimers();
    const { container } = render(tv({ transition }));
    fireEvent.click(screen.getByRole("button", { name: "Next video" }));
    expect(container.querySelector(".kz-rtv-layer[data-role=out]")?.getAttribute("data-tr")).toBe(transition);
    expect(container.querySelector(".kz-rtv-static") !== null).toBe(transition === "channel");
    act(() => { vi.advanceTimersByTime(700); });
    expect(container.querySelector(".kz-rtv-layer[data-role=out]")).toBeNull();
    vi.useRealTimers();
  });

  it("cuts under reduced motion", () => {
    reduce();
    const { container } = render(tv());
    fireEvent.click(screen.getByRole("button", { name: "Next video" }));
    expect(container.querySelector(".kz-rtv-layer[data-role=out]")).toBeNull();
    expect(container.querySelector(".kz-rtv-static")).toBeNull();
    expect(now()).toContain("Beta");
  });

  it("is muted by default and reports the visitor's choice", () => {
    const onMutedChange = vi.fn();
    const { container } = render(tv({ onMutedChange }));
    expect((container.querySelector("video") as HTMLVideoElement).muted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Sound off: turn on" }));
    expect(onMutedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button", { name: "Sound on: turn off" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("is driven from the keyboard", () => {
    render(tv());
    const region = screen.getByRole("region", { name: "Shorts" });
    fireEvent.keyDown(region, { key: "n" });
    expect(now()).toContain("Beta");
    fireEvent.keyDown(region, { key: "p" });
    expect(now()).toContain("Alpha");
    fireEvent.keyDown(region, { key: "m" });
    expect(screen.getByRole("button", { name: "Sound on: turn off" })).toBeTruthy();
  });

  it("offers captions only when the programme has tracks", () => {
    render(tv());
    expect(screen.queryByRole("button", { name: "Captions" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Next video" }));
    fireEvent.click(screen.getByRole("button", { name: "Captions" }));
    expect(screen.getByRole("button", { name: "Captions" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("lets the host fill an embed slot and loads no third-party script itself", () => {
    const { container } = render(tv({ playlist: [{ id: "e", title: "Reel" }], renderEmbed: (s) => <span data-testid="embed">{s.title}</span> }));
    expect(screen.getByTestId("embed").textContent).toBe("Reel");
    expect(container.querySelector("iframe, script")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(tv());
    expect(await axeViolations(container)).toEqual([]);
  });
});
