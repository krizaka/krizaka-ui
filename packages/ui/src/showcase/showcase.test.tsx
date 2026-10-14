import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axeViolations } from "../test/axe";
import { Showcase, useTypedText } from "./index";

const items = [
  { id: "a", title: "Golden hour" },
  { id: "b", title: "Market" },
  { id: "c", title: "Backstage" },
];
const show = (props: Partial<React.ComponentProps<typeof Showcase<(typeof items)[number]>>> = {}) => (
  <Showcase label="Prompt to image" items={items} getId={(i) => i.id} getTitle={(i) => i.title} renderItem={(i) => <p>{i.title} slide</p>} {...props} />
);
const fill = (container: HTMLElement) => container.querySelector("[data-segment-fill]") as HTMLElement | null;
const counter = () => screen.getByText(/Slide \d of 3/).textContent;

afterEach(() => vi.restoreAllMocks());

describe("Showcase", () => {
  it("is a carousel whose slides are groups named n of N, with no axe violation", async () => {
    const { container } = render(<main>{show()}</main>);
    const region = screen.getByRole("region", { name: "Prompt to image" });
    expect(region.getAttribute("aria-roledescription")).toBe("carousel");
    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides).toHaveLength(3);
    expect(slides[0]?.getAttribute("aria-label")).toBe("1 of 3");
    expect(slides[1]?.getAttribute("aria-hidden")).toBe("true");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("carries the rules of its fill animation: no stylesheet to import", () => {
    render(show());
    const css = [...document.querySelectorAll("style")].map((el) => el.textContent).join("");
    expect(css).toContain("@keyframes kz-showcase-fill");
    expect(css).toContain(".kz-showcase-fill");
  });

  it("shows the counter with the slide's title and one segment per slide", () => {
    render(show());
    expect(screen.getByText("Golden hour", { selector: "span" })).toBeTruthy();
    expect(counter()).toContain("Slide 1 of 3");
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(3);
  });

  it("fills the current segment over the interval and advances when it ends", () => {
    const { container } = render(show({ interval: 4000 }));
    expect(fill(container)?.style.animationDuration).toBe("4000ms");
    expect(fill(container)?.style.animationPlayState).toBe("running");
    fireEvent.animationEnd(fill(container) as HTMLElement);
    expect(counter()).toContain("Slide 2 of 3");
    expect(fill(container)).not.toBeNull();
  });

  it("does not announce an automatic change, but announces the visitor's", async () => {
    const user = userEvent.setup();
    const { container } = render(show());
    const live = container.querySelector("[aria-live]") as HTMLElement;
    expect(live.getAttribute("aria-live")).toBe("off");
    fireEvent.animationEnd(fill(container) as HTMLElement);
    expect(live.getAttribute("aria-live")).toBe("off");
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(live.getAttribute("aria-live")).toBe("polite");
  });

  it("has a visible pause button that holds the bar and plays it again", () => {
    const { container } = render(show());
    fireEvent.click(screen.getByRole("button", { name: "Pause the slideshow" }));
    expect(fill(container)?.style.animationPlayState).toBe("paused");
    fireEvent.click(screen.getByRole("button", { name: "Play the slideshow" }));
    expect(fill(container)?.style.animationPlayState).toBe("running");
  });

  it("holds while the pointer is over it and while a keyboard focus is inside", () => {
    const { container } = render(show());
    const region = screen.getByRole("region");
    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    expect(fill(container)?.style.animationPlayState).toBe("paused");
    fireEvent.pointerLeave(region);
    expect(fill(container)?.style.animationPlayState).toBe("running");
    const next = screen.getByRole("button", { name: "Next slide" });
    // A pointer click focuses without :focus-visible: it does not hold the show.
    fireEvent.focus(next);
    expect(fill(container)?.style.animationPlayState).toBe("running");
    const matches = vi.spyOn(Element.prototype, "matches").mockReturnValue(true);
    fireEvent.focus(next);
    matches.mockRestore();
    expect(fill(container)?.style.animationPlayState).toBe("paused");
    fireEvent.blur(screen.getByRole("button", { name: "Next slide" }), { relatedTarget: document.body });
    expect(fill(container)?.style.animationPlayState).toBe("running");
  });

  it("holds while the tab is hidden", () => {
    const { container } = render(show());
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    act(() => void document.dispatchEvent(new Event("visibilitychange")));
    expect(fill(container)?.style.animationPlayState).toBe("paused");
  });

  it("navigates with ←/→, Home/End and the segments, looping", async () => {
    const user = userEvent.setup();
    render(show());
    const region = screen.getByRole("region");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(counter()).toContain("Slide 2 of 3");
    fireEvent.keyDown(region, { key: "End" });
    expect(counter()).toContain("Slide 3 of 3");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(counter()).toContain("Slide 1 of 3");
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(counter()).toContain("Slide 3 of 3");
    await user.click(screen.getByRole("button", { name: "Go to slide 2" }));
    expect(counter()).toContain("Slide 2 of 3");
    expect(screen.getByRole("button", { name: "Go to slide 2" }).getAttribute("aria-current")).toBe("true");
  });

  it("stops at the last slide without loop", async () => {
    const user = userEvent.setup();
    const { container } = render(show({ loop: false }));
    expect((screen.getByRole("button", { name: "Previous slide" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Go to slide 3" }));
    expect((screen.getByRole("button", { name: "Next slide" }) as HTMLButtonElement).disabled).toBe(true);
    expect(fill(container)).toBeNull();
  });

  it("never advances by itself under reduced motion: no pause button, no fill", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(((query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia);
    const { container } = render(show());
    expect(fill(container)).toBeNull();
    expect(screen.queryByRole("button", { name: "Pause the slideshow" })).toBeNull();
    expect(counter()).toContain("Slide 1 of 3");
  });

  it("does not play when autoplay is off, and reports who moved it", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    const { container } = render(show({ autoplay: false, onIndexChange }));
    expect(fill(container)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onIndexChange).toHaveBeenCalledWith(1, true);
  });
});

describe("useTypedText", () => {
  function Typed({ text, active = true }: { text: string; active?: boolean }) {
    return <p>{useTypedText(text, { active, speed: 1000 }).text}</p>;
  }
  it("types the text out, and is whole when not active", async () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<Typed text="abc" />);
    expect(container.textContent).toBe("");
    await act(async () => void vi.advanceTimersByTime(50));
    expect(container.textContent).toBe("abc");
    rerender(<Typed text="xyz" active={false} />);
    expect(container.textContent).toBe("xyz");
    vi.useRealTimers();
  });
});
