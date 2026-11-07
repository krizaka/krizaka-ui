import { fireEvent, render, screen } from "@testing-library/react";

import { VideoResult, type VideoResultProps } from "../VideoResult";

const base: VideoResultProps = {
  title: "Tea pouring in a tent",
  sources: { mp4: "https://cdn.test/a.mp4", webm: "https://cdn.test/a.webm", poster: "https://cdn.test/a.webp" },
  prompt: "A stream of amber tea pours into a glass.",
  facts: [
    { label: "Seed", value: "20261011" },
    { label: "Run", value: "25948442-7c68-4e66-94d6-39cd8b96438d" },
  ],
  reproduce: 'orazaka video "x" --seed 20261011',
  reproduceLead: "The same prompt and seed make the same shot again.",
  downloadHref: "https://cdn.test/a.mp4",
  labels: {
    badge: "Video · 5 s",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Sound on",
    enlarge: "Open larger",
    close: "Close",
    prompt: "Prompt",
    facts: "The run",
    reproduce: "Reproduce it",
    copy: "Copy command",
    copied: "Copied",
    download: "Download",
  },
};

describe("VideoResult", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
      observe() {}
      disconnect() {}
    };
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });
  });

  it("is a named, muted, looping, lazy player with its poster, webm first then mp4, and a badge that says it is a video", () => {
    const { container } = render(<VideoResult {...base} />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("aria-label", "Tea pouring in a tent");
    expect(video).toHaveAttribute("poster", "https://cdn.test/a.webp");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(Array.from(video.querySelectorAll("source")).map((s: Element) => s.getAttribute("type"))).toEqual([
      "video/webm",
      "video/mp4",
    ]);
    expect(container.querySelector("[data-clip-badge]")).toHaveTextContent("Video · 5 s");
  });

  it("says the prompt as the model received it and every fact of the run", () => {
    render(<VideoResult {...base} />);
    expect(screen.getByText(base.prompt)).toHaveAttribute("lang", "en");
    for (const fact of base.facts) {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
    }
  });

  it("lets the app draw the prompt itself, under the same heading", () => {
    render(<VideoResult {...base} promptNode={<p>typed prompt</p>} />);
    expect(screen.getByText("typed prompt")).toBeInTheDocument();
    expect(screen.queryByText(base.prompt)).toBeNull();
    expect(screen.getByRole("heading", { name: "Prompt" })).toBeInTheDocument();
  });

  it("shows the command as a highlighted code block with its lead and copy button, and a download link", () => {
    const { container } = render(<VideoResult {...base} />);
    expect(container.querySelector("pre code")!.textContent).toBe(base.reproduce);
    expect(screen.getByText(base.reproduceLead!)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute("href", "https://cdn.test/a.mp4");
  });

  it("leaves out what it was not given: no webm, no command, no download", () => {
    const { container } = render(
      <VideoResult
        {...base}
        sources={{ mp4: "m.mp4", poster: "p.webp" }}
        reproduce={undefined}
        downloadHref={undefined}
      />,
    );
    expect(container.querySelectorAll("video source")).toHaveLength(1);
    expect(screen.queryByText("Reproduce it")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("draws a portrait clip as tall as a phone allows, a landscape one 16:9", () => {
    const portrait = render(<VideoResult {...base} orientation="portrait" />);
    expect(portrait.container.querySelector("video")!.className).toContain("aspect-[9/16]");
    portrait.unmount();
    expect(render(<VideoResult {...base} />).container.querySelector("video")!.className).toContain("aspect-[26/15]");
  });

  it("opens the clip larger with the native controls, and closes", () => {
    render(<VideoResult {...base} />);
    fireEvent.click(screen.getByRole("button", { name: "Open larger" }));
    expect(screen.getByRole("dialog").querySelector("video")).toHaveAttribute("controls");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
