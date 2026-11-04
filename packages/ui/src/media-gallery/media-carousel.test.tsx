import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { MediaCarousel } from "./carousel-index";

const slides = [
  { id: "a", src: "/a.jpg", alt: "The film", caption: "Fig. 1a", film: { src: "/f.mp4", title: "Film: Krizaka", playLabel: "Play the film" } },
  { id: "b", src: "/b.jpg", alt: "A lease", caption: "Fig. 1b", video: { webm: "/b.webm" } },
  { id: "c", src: "/c.jpg", alt: "A return", caption: "Fig. 1c" },
];

beforeEach(() => {
  Element.prototype.scrollTo = vi.fn();
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

  it("starts no loop under reduced motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }) as never;
    render(<MediaCarousel label="Realisations" slides={slides.slice(1)} />);
    expect(document.querySelector("video")).toBeNull();
  });
});
