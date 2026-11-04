import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { MediaCarousel, type MediaCarouselProps } from "./carousel-index";
import { PausableLoop } from "./loop-index";

const slides = [
  { id: "a", src: "/a.jpg", alt: "The film", caption: "Fig. 1a", film: { src: "/f.mp4", title: "Film: Krizaka", playLabel: "Play the film" } },
  { id: "b", src: "/b.jpg", alt: "A lease", caption: "Fig. 1b", video: { webm: "/b.webm" } },
  { id: "c", src: "/c.jpg", alt: "A return", caption: "Fig. 1c" },
];

const renderLoop: MediaCarouselProps["renderLoop"] = (video, { poster, inView }) => <PausableLoop sources={video} poster={poster} active={inView} />;

const calm = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
};

// The loop plays only while on screen: a viewport that always sees it.
class SeenObserver {
  constructor(private readonly notify: (entries: { isIntersecting: boolean }[]) => void) {}
  observe() {
    this.notify([{ isIntersecting: true }]);
  }
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", SeenObserver);

beforeEach(() => {
  Element.prototype.scrollTo = vi.fn();
  calm(false);
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });
});

describe("MediaCarousel", () => {
  it("is a named carousel of numbered slides, one exposed at a time, with no axe violation", async () => {
    const { container } = render(<MediaCarousel label="Realisations" slides={slides} />);
    expect(screen.getByRole("region", { name: "Realisations" }).getAttribute("aria-roledescription")).toBe("carousel");
    const items = container.querySelectorAll("li");
    expect(items[0]!.getAttribute("aria-label")).toBe("1 of 3");
    expect(items[0]!.hasAttribute("inert")).toBe(false);
    expect(items[1]!.hasAttribute("inert")).toBe(true);
    expect(screen.getByText("1 / 3")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("moves with the buttons and the arrow keys on them, keeps the focus at both ends, and stops there", async () => {
    const user = userEvent.setup();
    render(<MediaCarousel label="Realisations" slides={slides} />);
    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement;
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement;
    expect(screen.getByRole("toolbar").contains(next)).toBe(true);
    expect(screen.getByRole("region", { name: "Realisations" }).hasAttribute("tabindex")).toBe(false);
    expect(previous.disabled).toBe(true);
    await user.click(next);
    expect(screen.getByText("2 / 3")).toBeTruthy();
    expect(document.activeElement).toBe(next);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("3 / 3")).toBeTruthy();
    expect(next.disabled).toBe(true);
    expect(document.activeElement).toBe(previous);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("3 / 3")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("2 / 3")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("1 / 3")).toBeTruthy();
    expect(previous.disabled).toBe(true);
    expect(document.activeElement).toBe(next);
  });

  it("turns one slide on a horizontal swipe of the track, and none on a short one", () => {
    const { container } = render(<MediaCarousel label="Realisations" slides={slides} />);
    const track = container.querySelector("ul")!;
    fireEvent.pointerDown(track, { clientX: 300 });
    fireEvent.pointerUp(track, { clientX: 290 });
    expect(screen.getByText("1 / 3")).toBeTruthy();
    fireEvent.pointerDown(track, { clientX: 300 });
    fireEvent.pointerUp(track, { clientX: 200 });
    expect(screen.getByText("2 / 3")).toBeTruthy();
    fireEvent.pointerDown(track, { clientX: 200 });
    fireEvent.pointerUp(track, { clientX: 300 });
    expect(screen.getByText("1 / 3")).toBeTruthy();
  });

  it("opens the film of a slide in a lightbox, started by the press", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
    render(<MediaCarousel label="Realisations" slides={slides} />);
    await user.click(screen.getByRole("button", { name: /Play the film/ }));
    expect(await screen.findByRole("dialog", { name: "Film: Krizaka" })).toBeTruthy();
    expect(document.querySelector("video")).toBeTruthy();
  });

  it("leaves a slide with a video as a still when no renderLoop is given, so the loop stays out of this entry", () => {
    render(<MediaCarousel label="Realisations" slides={slides.slice(1, 2)} />);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button", { name: /animation/ })).toBeNull();
  });

  it("starts no loop under reduced motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
    render(<MediaCarousel label="Realisations" slides={slides.slice(1)} renderLoop={renderLoop} />);
    expect(document.querySelector("video")).toBeNull();
  });

  it("draws no chrome for a single slide: no arrows, no count", () => {
    render(<MediaCarousel label="Realisations" slides={slides.slice(0, 1)} />);
    expect(screen.queryByRole("toolbar")).toBeNull();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
    expect(screen.queryByText("1 / 1")).toBeNull();
    expect(screen.getByRole("button", { name: /Play the film/ })).toBeTruthy();
  });

  it("loops a still with a visible pause that stops the video and resumes it", async () => {
    const user = userEvent.setup();
    render(<MediaCarousel label="Realisations" slides={slides.slice(1, 2)} renderLoop={renderLoop} />);
    const video = document.querySelector("video") as HTMLVideoElement;
    expect(video).toBeTruthy();
    expect(video.muted).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Pause the animation" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play the animation" })).toBeTruthy();
  });

  it("previews a film slide with its loop, pausable, and still opens the film in the lightbox", async () => {
    const user = userEvent.setup();
    const film = [{ ...slides[0]!, video: { webm: "/loop.webm" } }];
    render(<MediaCarousel label="Realisations" slides={film} renderLoop={renderLoop} />);
    expect(document.querySelector("video source")?.getAttribute("src")).toBe("/loop.webm");
    expect(screen.getByRole("button", { name: "Pause the animation" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Play the film/ }));
    expect(await screen.findByRole("dialog", { name: "Film: Krizaka" })).toBeTruthy();
  });

  it("fetches no loop before the page has loaded", () => {
    const state = vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    render(<MediaCarousel label="Realisations" slides={slides.slice(1, 2)} renderLoop={renderLoop} />);
    expect(document.querySelector("video")).toBeNull();
    state.mockRestore();
  });

  it("keeps the poster alone, with no pause to press, under reduced motion", () => {
    calm(true);
    render(<MediaCarousel label="Realisations" slides={[{ ...slides[0]!, video: { webm: "/loop.webm" } }]} renderLoop={renderLoop} />);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button", { name: /animation/ })).toBeNull();
  });

  it("speaks the translated words in the carousel, the loop control and the lightbox player", async () => {
    const user = userEvent.setup();
    render(
      <MediaCarousel
        label="Réalisations"
        slides={[{ ...slides[0]!, video: { webm: "/loop.webm" } }, slides[1]!]}
        labels={{ previous: "Précédent", next: "Suivant", close: "Fermer" }}
        renderLoop={(video, { poster, inView }) => <PausableLoop sources={video} poster={poster} active={inView} labels={{ pause: "Mettre l’animation en pause", play: "Lancer l’animation" }} />}
        playerLabels={{ play: "Lire", pause: "Pause", seek: "Position" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Suivant" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Mettre l’animation en pause" }));
    expect(screen.getByRole("button", { name: "Lancer l’animation" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Play the film/ }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Position" })).toBeTruthy();
  });

  it("pauses the loop when it leaves the screen", () => {
    class UnseenObserver {
      constructor(private readonly notify: (entries: { isIntersecting: boolean }[]) => void) {}
      observe() {
        this.notify([{ isIntersecting: false }]);
      }
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", UnseenObserver);
    render(<MediaCarousel label="Realisations" slides={slides.slice(1, 2)} renderLoop={renderLoop} />);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    vi.stubGlobal("IntersectionObserver", SeenObserver);
  });
});
