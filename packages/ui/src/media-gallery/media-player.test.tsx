import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { MediaPlayer } from "./player-index";

// The loop plays only while on screen: a viewport that always sees it.
class SeenObserver {
  constructor(private readonly notify: (entries: { isIntersecting: boolean }[]) => void) {}
  observe() {
    this.notify([{ isIntersecting: true }]);
  }
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", SeenObserver);

afterEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
});

describe("MediaPlayer", () => {
  it("is the player itself inline, 16:9 or vertical", () => {
    const { rerender } = render(<MediaPlayer src="/f.mp4" title="Film" />);
    expect(screen.getByRole("region", { name: "Film" })).toBeTruthy();
    rerender(<MediaPlayer src="/f.mp4" title="Film" vertical />);
    expect((screen.getByRole("region", { name: "Film" }) as HTMLElement).style.aspectRatio).toBe("9 / 16");
  });

  it("is one named poster button in a lightbox: nothing is fetched until the press, then the dialog plays with sound", async () => {
    const user = userEvent.setup();
    const play = vi.fn(() => Promise.resolve());
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    const { container } = render(<MediaPlayer mode="lightbox" src="/f.mp4" poster="/p.jpg" title="Film" playLabel="Play the film" caption="Fig. 1" closeLabel="Close the film" />);
    expect(document.querySelector("video")).toBeNull();
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole("button", { name: /Play the film/ }));
    expect(await screen.findByRole("dialog", { name: "Film" })).toBeTruthy();
    expect(play).toHaveBeenCalled();
    expect((document.querySelector("video") as HTMLVideoElement).muted).toBe(false);
    await user.click(screen.getByRole("button", { name: "Close the film" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  const calm = (matches: boolean) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
  };

  it("opens paused on its poster with a clear play button under reduced motion", async () => {
    const user = userEvent.setup();
    const play = vi.fn(() => Promise.resolve());
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    calm(true);
    render(<MediaPlayer mode="lightbox" src="/f.mp4" poster="/p.jpg" title="Film" playLabel="Play the film" />);
    await user.click(screen.getByRole("button", { name: "Play the film" }));
    const dialog = await screen.findByRole("dialog", { name: "Film" });
    expect(play).not.toHaveBeenCalled();
    expect(within(dialog).getAllByRole("button", { name: "Play" }).length).toBeGreaterThan(0);
  });

  it("opens from a custom trigger of the page, and returns on close", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
    render(<MediaPlayer mode="lightbox" src="/f.mp4" title="Film" playLabel="Play" trigger={(open) => <button onClick={open}>Watch the film</button>} />);
    expect(screen.queryByRole("button", { name: "Play" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Watch the film" }));
    expect(await screen.findByRole("dialog", { name: "Film" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is driven from outside by open and onOpenChange, with no opener of its own", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
    const changed = vi.fn();
    const { rerender } = render(<MediaPlayer mode="lightbox" src="/f.mp4" title="Film" trigger={null} open={false} onOpenChange={changed} />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<MediaPlayer mode="lightbox" src="/f.mp4" title="Film" trigger={null} open onOpenChange={changed} />);
    await screen.findByRole("dialog", { name: "Film" });
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(changed).toHaveBeenCalledWith(false);
  });

  it("takes a free ratio, and the vertical default is unchanged", () => {
    const { rerender } = render(<MediaPlayer src="/f.mp4" title="Film" ratio="19 / 16" />);
    expect((screen.getByRole("region", { name: "Film" }) as HTMLElement).style.aspectRatio).toBe("19 / 16");
    rerender(<MediaPlayer mode="lightbox" src="/f.mp4" title="Film" playLabel="Play" ratio="19 / 16" />);
    expect((screen.getByRole("button", { name: "Play" }).parentElement as HTMLElement).style.aspectRatio).toBe("19 / 16");
  });

  it("has a pausable preview loop on its poster, nothing nested in the button", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
    const { container } = render(<MediaPlayer mode="lightbox" src="/f.mp4" poster="/p.jpg" preview={{ mp4: "/l.mp4" }} title="Film" playLabel="Play the film" previewLabels={{ pause: "Pause l’aperçu", play: "Lancer l’aperçu" }} />);
    expect(container.querySelector("button video, button button")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Pause l’aperçu" }));
    expect(screen.getByRole("button", { name: "Lancer l’aperçu" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });
});
