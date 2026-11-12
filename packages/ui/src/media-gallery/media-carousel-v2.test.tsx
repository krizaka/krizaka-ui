import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { carouselDwell, type CarouselSlide,chapterAt, MediaCarousel } from "./media-carousel";

// Carousel v2 (ADR-010): slides as data, the clock, the holds, the sound gesture, a clip that cannot play, the text version.
const slides: CarouselSlide[] = [
  { id: "a", src: "/a.jpg", alt: "A lease read", caption: "Fig. 1a", video: { webm: "/a.webm", mp4: "/a.mp4" }, duration: 8, audio: true },
  { id: "b", src: "/b.jpg", alt: "A return prepared", caption: "Fig. 1b", text: "The return, ready to file by its owner" },
  {
    id: "c",
    kind: "screen-demo",
    src: "/c.jpg",
    alt: "A journey",
    caption: "Fig. 1c",
    video: { mp4: "/c.mp4" },
    duration: 30,
    chapters: [
      { at: 0, label: "Drop the lease" },
      { at: 12, label: "Read the report" },
    ],
  },
];

const media = (reduce: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
};
let notifySeen: (visible: boolean) => void = () => undefined;
class Observer {
  constructor(private readonly notify: (entries: { isIntersecting: boolean }[]) => void) {
    notifySeen = (visible) => notify([{ isIntersecting: visible }]);
  }
  observe() {
    this.notify([{ isIntersecting: true }]);
  }
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", Observer);

const fill = () => document.querySelector(".kz-media-carousel-fill") as HTMLElement;
const count = () => screen.getByText(/\d \/ 3/).textContent;

beforeEach(() => {
  media(false);
  window.sessionStorage.clear();
  Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: true, value: vi.fn(() => Promise.resolve()) });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });
});

describe("carouselDwell and chapterAt", () => {
  it("keeps a clip for its duration within the bounds, a still for a reading time", () => {
    expect(carouselDwell({ video: { mp4: "x" }, duration: 8 })).toBe(8000);
    expect(carouselDwell({ video: { mp4: "x" }, duration: 2 })).toBe(5000);
    expect(carouselDwell({ video: { mp4: "x" }, duration: 90 })).toBe(45000);
    expect(carouselDwell({})).toBe(6500);
    expect(carouselDwell({ video: { mp4: "x" } })).toBe(6500);
    expect(carouselDwell({ video: { mp4: "x" }, duration: 8 }, { minDwell: 3, maxDwell: 3 })).toBe(3000);
  });

  it("finds the step under the playhead", () => {
    expect(chapterAt(slides[2]!.chapters, 0)).toBe(0);
    expect(chapterAt(slides[2]!.chapters, 13)).toBe(1);
    expect(chapterAt(undefined, 4)).toBe(-1);
  });
});

describe("MediaCarousel v2", () => {
  it("advances when the current tick has filled for the slide's dwell, and wraps", async () => {
    const changes: number[] = [];
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay onSlideChange={(i) => changes.push(i)} />);
    expect(container.querySelector("section")!.hasAttribute("data-advancing")).toBe(true);
    expect(fill().style.animationDuration).toBe("8000ms");
    expect(fill().style.animationPlayState).toBe("running");
    fireEvent.animationEnd(fill());
    expect(count()).toBe("2 / 3");
    expect(fill().style.animationDuration).toBe("6500ms");
    fireEvent.animationEnd(fill());
    fireEvent.animationEnd(fill());
    expect(count()).toBe("1 / 3");
    expect(changes).toEqual([1, 2, 0]);
    expect(screen.getByRole("button", { name: "Previous" }).hasAttribute("disabled")).toBe(false);
    expect(await axeViolations(container)).toEqual([]);
  });

  /** An autoplaying carousel with the mouse over it: the start of every « no hold » case. */
  const underPointer = () => {
    const user = userEvent.setup();
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay />);
    const root = container.querySelector("section")!;
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    return { user, root };
  };

  it("does not hold the clock under the pointer or on a keyboard focus by default (WCAG 2.2.2: the visible Pause is the one hold)", async () => {
    const { user, root } = underPointer();
    expect(fill().style.animationPlayState).toBe("running");
    expect(root.hasAttribute("data-advancing")).toBe(true);
    await user.tab();
    expect(fill().style.animationPlayState).toBe("running");
  });

  it("a pointer click on next, then the pointer away, keeps the clock and the clip going", async () => {
    const { user, root } = underPointer();
    await user.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.pointerLeave(root);
    expect(count()).toBe("2 / 3");
    expect(screen.getByRole("button", { name: "Pause the carousel" }).getAttribute("aria-pressed")).toBe("false");
    expect(fill().style.animationPlayState).toBe("running");
    expect(root.hasAttribute("data-advancing")).toBe(true);
  });

  it("holds the clock with the pause button (label and aria-pressed from one state) and off screen", async () => {
    const user = userEvent.setup();
    render(<MediaCarousel label="Work" slides={slides} autoplay />);
    await user.click(screen.getByRole("button", { name: "Pause the carousel" }));
    const play = screen.getByRole("button", { name: "Play the carousel" });
    expect(play.getAttribute("aria-pressed")).toBe("true");
    expect(fill().style.animationPlayState).toBe("paused");
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    await user.click(play);
    expect(fill().style.animationPlayState).toBe("running");
    act(() => notifySeen(false));
    expect(fill().style.animationPlayState).toBe("paused");
  });

  it("holds pointer-focus keeps the old holds: the pointer holds, the count is read while held", () => {
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay holds="pointer-focus" />);
    const root = container.querySelector("section")!;
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    expect(fill().style.animationPlayState).toBe("paused");
    fireEvent.animationEnd(fill());
    expect(count()).toBe("1 / 3");
    expect(screen.getByText(/1 \/ 3/).closest("p")!.getAttribute("aria-live")).toBe("polite");
    fireEvent.pointerLeave(root);
    expect(fill().style.animationPlayState).toBe("running");
    expect(screen.getByText(/1 \/ 3/).closest("p")!.getAttribute("aria-live")).toBe("off");
  });

  it("does not hold for a touch, which is a swipe or a press", () => {
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay holds="pointer-focus" />);
    fireEvent.pointerEnter(container.querySelector("section")!, { pointerType: "touch" });
    expect(fill().style.animationPlayState).toBe("running");
  });

  it("moves nothing under reduced motion: no clock, no clip, no pause, the current tick full, the buttons stay", () => {
    media(true);
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay sound />);
    expect(fill()).toBeNull();
    expect(document.querySelector("video")).toBeNull();
    expect(screen.queryByRole("button", { name: "Pause the carousel" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Sound on" })).toBeNull();
    expect(container.querySelector('[data-state="full"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
  });

  it("moves nothing under Save-Data", () => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
    render(<MediaCarousel label="Work" slides={slides} autoplay />);
    expect(fill()).toBeNull();
    expect(document.querySelector("video")).toBeNull();
    Object.defineProperty(navigator, "connection", { configurable: true, value: undefined });
  });

  it("mounts one clip, the current slide's, poster first, VP9 before H.264; a clip that cannot play leaves its poster", () => {
    render(<MediaCarousel label="Work" slides={slides} autoplay />);
    expect(document.querySelectorAll("video")).toHaveLength(1);
    const sources = [...document.querySelectorAll("video source")].map((x) => x.getAttribute("type"));
    expect(sources).toEqual(["video/webm", "video/mp4"]);
    expect(document.querySelector("video")!.getAttribute("poster")).toBe("/a.jpg");
    expect(document.querySelector("video")!.loop).toBe(true);
    fireEvent.error(document.querySelector('source[type="video/mp4"]')!);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByRole("img", { name: "A lease read" })).toBeTruthy();
  });

  it("draws only the posters seen and the next one; the first one eager", () => {
    render(<MediaCarousel label="Work" slides={slides} />);
    const imgs = [...document.querySelectorAll("img")];
    expect(imgs.map((i) => i.getAttribute("src"))).toEqual(["/a.jpg", "/b.jpg"]);
    expect(imgs[0]!.getAttribute("loading")).toBeNull();
    expect(imgs[1]!.getAttribute("loading")).toBe("lazy");
  });

  it("offers sound only when a slide has audio, and plays it only after the press, while hovered or focused", async () => {
    const user = userEvent.setup();
    const { container } = render(<MediaCarousel label="Work" slides={slides} autoplay sound />);
    const root = container.querySelector("section")!;
    const video = () => document.querySelector("video") as HTMLVideoElement;
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    expect(video().muted).toBe(true);
    const toggle = screen.getByRole("button", { name: "Sound on" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    await user.click(toggle);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    expect(video().muted).toBe(false);
    fireEvent.pointerLeave(root);
    fireEvent.blur(toggle, { relatedTarget: document.body });
    expect(video().muted).toBe(true);
    expect(window.sessionStorage.getItem("kz-media-carousel-sound")).toBe("1");
  });

  it("shows no sound toggle when no slide has audio, or without `sound`", () => {
    render(<MediaCarousel label="Work" slides={slides.map((x) => ({ ...x, audio: false }))} autoplay sound />);
    expect(screen.queryByRole("button", { name: "Sound on" })).toBeNull();
  });

  it("takes Home and End on the toolbar", async () => {
    const user = userEvent.setup();
    render(<MediaCarousel label="Work" slides={slides} autoplay />);
    screen.getByRole("button", { name: "Next" }).focus();
    await user.keyboard("{End}");
    expect(count()).toBe("3 / 3");
    await user.keyboard("{Home}");
    expect(count()).toBe("1 / 3");
    await user.keyboard("{ArrowLeft}");
    expect(count()).toBe("3 / 3");
  });

  it("puts the caption in the bar with the chapter under the playhead, marks the chapters, and lists them in the text version", () => {
    const { container } = render(
      <MediaCarousel label="Work" slides={slides} autoplay caption="bar" frame="cahier" textVersion data-hue="cobalt">
        <p>Clips made with Sovkora.</p>
      </MediaCarousel>,
    );
    const root = container.querySelector("section")!;
    expect(root.getAttribute("data-frame")).toBe("cahier");
    expect(root.getAttribute("data-hue")).toBe("cobalt");
    expect(container.querySelector("figcaption")).toBeNull();
    expect(container.querySelector("p[aria-live]")!.textContent).toBe("1 / 3 Fig. 1a");
    fireEvent.animationEnd(fill());
    fireEvent.animationEnd(fill());
    expect(container.querySelectorAll("i")).toHaveLength(2);
    Object.defineProperty(document.querySelector("video")!, "currentTime", { configurable: true, value: 13 });
    fireEvent.timeUpdate(document.querySelector("video")!);
    expect(container.querySelector("p[aria-live]")!.textContent).toBe("3 / 3 Fig. 1c · Read the report");
    const text = container.querySelector("details")!;
    expect(text.querySelector("summary")!.textContent).toBe("Text version");
    expect(text.textContent).toContain("The return, ready to file by its owner");
    expect(text.textContent).toContain("Drop the lease");
    expect(text.textContent).toContain("Clips made with Sovkora.");
  });

  it("says its roles in the page's language", () => {
    const { container } = render(<MediaCarousel label="Réalisations" slides={slides} labels={{ carousel: "carrousel", slideRole: "diapositive" }} />);
    expect(container.querySelector("section")!.getAttribute("aria-roledescription")).toBe("carrousel");
    expect(container.querySelector("li")!.getAttribute("aria-roledescription")).toBe("diapositive");
  });

  it("holds the clock while the tab is hidden", () => {
    const state = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    render(<MediaCarousel label="Work" slides={slides} autoplay />);
    expect(fill().style.animationPlayState).toBe("paused");
    state.mockRestore();
  });
});
