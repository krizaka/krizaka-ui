import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axeViolations } from "../test/axe";
import { ShortFeed, VerticalVideo } from "./index";

let play: ReturnType<typeof vi.fn>;
let pause: ReturnType<typeof vi.fn>;
beforeEach(() => {
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play as never);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause as never);
});

const clip = (props: Partial<React.ComponentProps<typeof VerticalVideo>> = {}) => (
  <VerticalVideo title="Video: Night shoot" src="/clip.mp4" creator={{ name: "Camille", verifiedLabel: "Verified" }} caption="The rooftop, the rain." tags={["night"]} likes={12400} comments={328} onLike={() => undefined} onFollow={() => undefined} {...props} />
);

describe("VerticalVideo", () => {
  it("is an article named by its title, with the counts compact in the locale, and no axe violation", async () => {
    const { container } = render(clip({ locale: "en" }));
    expect(screen.getByRole("article", { name: "Video: Night shoot" })).toBeTruthy();
    expect(screen.getByText("12.4K")).toBeTruthy();
    expect(screen.getByText("328")).toBeTruthy();
    expect(screen.getByText(/#night/)).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("frames itself 9:16 by default; with fit=\"fill\" it fills the box it is given (no aspect of its own, the clip covers it)", () => {
    const { rerender } = render(clip());
    expect(screen.getByRole("article").className).toContain("aspect-[9/16]");
    rerender(clip({ fit: "fill" }));
    const article = screen.getByRole("article");
    expect(article.className).not.toContain("aspect-[9/16]");
    expect(article.className).toMatch(/\bh-full\b/);
    expect(article.className).toMatch(/\bw-full\b/);
    expect(article.dataset.fit).toBe("fill");
    expect(document.querySelector("video")!.className).toContain("object-cover");
  });

  it("keeps the caption clear of the rail: the name line wraps, the disclosure never runs under the counts", () => {
    render(clip({ disclosure: "AI-generated", shares: 95 }));
    const name = screen.getByText("AI-generated").parentElement!;
    expect(name.className).toContain("flex-wrap");
    const block = name.parentElement!;
    // The rail is 44 px wide at right-2 (8 px): the caption block stops at least 64 px from the right edge.
    expect(block.className).toMatch(/\bright-(16|20)\b/);
    expect(block.className).toContain("min-w-0");
  });

  it("plays when active and pauses when it leaves the screen", () => {
    const { rerender } = render(clip({ active: true }));
    expect(play).toHaveBeenCalled();
    rerender(clip({ active: false }));
    expect(pause).toHaveBeenCalled();
  });

  it("a tap pauses it, Space and K too; the viewer's pause holds", async () => {
    const user = userEvent.setup();
    render(clip());
    const video = document.querySelector("video")!;
    Object.defineProperty(video, "paused", { configurable: true, get: () => false });
    pause.mockClear();
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(pause).toHaveBeenCalled();
    pause.mockClear();
    screen.getByRole("article").focus();
    await user.keyboard(" ");
    expect(pause).toHaveBeenCalled();
  });

  it("likes by the button, by L on the focused video and by a double tap — and says it (aria-pressed)", async () => {
    const onLike = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(clip({ onLike, liked: false }));
    await user.click(screen.getByRole("button", { name: "Like" }));
    expect(onLike).toHaveBeenLastCalledWith(true);
    screen.getByRole("article").focus();
    await user.keyboard("l");
    expect(onLike).toHaveBeenCalledTimes(2);
    fireEvent.doubleClick(screen.getAllByRole("button")[0]!);
    expect(onLike).toHaveBeenCalledTimes(3);
    rerender(clip({ onLike, liked: true }));
    expect(screen.getByRole("button", { name: "Like" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("follows by the plus on the avatar, named with the creator", async () => {
    const onFollow = vi.fn();
    const user = userEvent.setup();
    render(clip({ onFollow }));
    await user.click(screen.getByRole("button", { name: "Follow Camille" }));
    expect(onFollow).toHaveBeenCalledWith(true);
  });

  it("says when the clip is AI-generated, in the caption block", () => {
    render(clip({ disclosure: "AI-GENERATED" }));
    expect(screen.getByText("AI-GENERATED")).toBeTruthy();
  });

  it("expands a long caption", async () => {
    const user = userEvent.setup();
    render(clip({ caption: "x".repeat(120) }));
    const more = screen.getByRole("button", { name: "More" });
    expect(more.getAttribute("aria-expanded")).toBe("false");
    await user.click(more);
    expect(screen.getByRole("button", { name: "Less" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("takes the product's own actions in slots", () => {
    render(clip({ tipSlot: <button type="button">Tip</button>, topStart: <span>2 h left</span> }));
    expect(screen.getByRole("button", { name: "Tip" })).toBeTruthy();
    expect(screen.getByText("2 h left")).toBeTruthy();
  });
});

describe("ShortFeed", () => {
  const items = ["a", "b", "c", "d", "e"].map((id) => ({ id }));
  const feed = () => (
    <ShortFeed label="Videos" items={items} getId={(i) => i.id} renderItem={(i, { active, preload }) => <article tabIndex={0} aria-label={i.id} data-active={active} data-preload={preload} />} />
  );

  it("is a named carousel of one slide per item, only the slides near the first mounted, the first active and the next preloaded", () => {
    const { container } = render(feed());
    expect(screen.getByRole("region", { name: "Videos" })).toBeTruthy();
    expect(container.querySelectorAll("[aria-roledescription=slide]")).toHaveLength(5);
    expect(screen.getAllByRole("article").map((a) => a.getAttribute("aria-label"))).toEqual(["a", "b"]);
    expect(screen.getByRole("article", { name: "a" }).dataset.active).toBe("true");
    expect(screen.getByRole("article", { name: "b" }).dataset.preload).toBe("auto");
  });

  it("sizes its slides to the feed, not to the screen: a feed in a 34 rem box shows one slide at a time", () => {
    const { container } = render(
      <ShortFeed label="Videos" className="h-[34rem]" items={items} getId={(i) => i.id} renderItem={(i) => <article tabIndex={0} aria-label={i.id} />} />,
    );
    for (const slide of container.querySelectorAll("[aria-roledescription=slide]")) {
      expect(slide.className).toContain("h-full");
      expect(slide.className).not.toContain("h-dvh");
    }
  });

  it("goes to the next and previous slide with the arrows, the focus following", async () => {
    const scrolled: string[] = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      scrolled.push(this.getAttribute("aria-label") ?? "");
    };
    const user = userEvent.setup();
    render(feed());
    await act(async () => screen.getByRole("article", { name: "a" }).focus());
    await user.keyboard("{ArrowDown}");
    expect(scrolled).toEqual(["2 / 5"]);
    expect(document.activeElement).toBe(screen.getByRole("article", { name: "b" }));
  });
});
