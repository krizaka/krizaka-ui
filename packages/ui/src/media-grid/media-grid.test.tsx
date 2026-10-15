import { fireEvent, render, screen, within } from "@testing-library/react";

import { axeViolations } from "../test/axe";
import { MediaGrid, ShortsShelf, VideoCard } from "./index";

const CLIPS = [
  { id: "a", title: "Tea", portrait: false },
  { id: "b", title: "Backstage", portrait: true },
  { id: "c", title: "Snow", portrait: false },
  { id: "d", title: "Unlock", portrait: true },
  { id: "e", title: "Market", portrait: false },
];
const shelf = { label: "Shorts", previousLabel: "Previous", nextLabel: "Next", seeAll: { href: "/shorts", label: "See all" } };
const grid = (props: Partial<React.ComponentProps<typeof MediaGrid<(typeof CLIPS)[number]>>> = {}) => (
  <MediaGrid
    items={CLIPS}
    getId={(c) => c.id}
    orientationOf={(c) => (c.portrait ? "portrait" : "landscape")}
    shelf={shelf}
    renderItem={(c, { aspect, layout, mismatch }) => <VideoCard href={`/watch/${c.id}`} title={c.title} aspect={aspect} layout={layout} fit={mismatch ? "contain" : "cover"} poster={`/${c.id}.jpg`} creator={{ name: "Camille" }} meta="1K views" />}
    {...props}
  />
);

describe("MediaGrid split", () => {
  it("routes the 9:16 clips to the shelf and keeps only 16:9 cards in the grid", async () => {
    const { container } = render(grid());
    const section = container.querySelector("[data-shorts-shelf]") as HTMLElement;
    expect(within(section).getAllByRole("article").map((a) => a.getAttribute("data-aspect"))).toEqual(["portrait", "portrait"]);
    const list = container.querySelector("[data-grid-frame]") as HTMLElement;
    expect(list.getAttribute("data-grid-frame")).toBe("landscape");
    const frames = [...list.querySelectorAll("article")].map((a) => a.getAttribute("data-aspect"));
    expect(frames).toEqual(["landscape", "landscape", "landscape"]);
    // every card of the grid stretches to its row: no card floats above an empty area
    for (const li of list.querySelectorAll("li")) expect(li.firstElementChild?.className).toContain("h-full");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders no shelf when there is no vertical clip, and no grid when there are only verticals", () => {
    const { container, rerender } = render(grid({ items: CLIPS.filter((c) => !c.portrait) }));
    expect(container.querySelector("[data-shorts-shelf]")).toBeNull();
    rerender(grid({ items: CLIPS.filter((c) => c.portrait) }));
    expect(container.querySelector("[data-grid-frame]")).toBeNull();
    expect(container.querySelectorAll("[data-shorts-shelf] article")).toHaveLength(2);
  });
});

describe("MediaGrid uniform", () => {
  it("draws every card in one frame and asks the odd ones to contain", () => {
    const seen: boolean[] = [];
    const { container } = render(grid({ mode: "uniform", renderItem: (c, s) => (seen.push(s.mismatch), <VideoCard href="/" title={c.title} aspect={s.aspect} poster="/x.jpg" fit={s.mismatch ? "contain" : "cover"} />) }));
    expect(container.querySelector("[data-shorts-shelf]")).toBeNull();
    expect([...container.querySelectorAll("article")].every((a) => a.getAttribute("data-aspect") === "landscape")).toBe(true);
    expect(seen).toEqual([false, true, false, true, false]);
    // a mismatched picture is drawn whole over a blurred copy of itself
    expect(container.querySelectorAll("img[aria-hidden]")).toHaveLength(2);
  });

  it("list layout is one column of rows", () => {
    const { container } = render(grid({ layout: "list", mode: "uniform" }));
    expect(container.querySelector("[data-grid-frame]")?.className).toContain("grid-cols-1");
    expect(container.querySelector("article")?.getAttribute("data-layout")).toBe("row");
  });
});

describe("VideoCard", () => {
  it("has one link (the title, stretched) and gives every card the same title room", async () => {
    const { container } = render(<VideoCard href="/watch/1" title="A very long title that wraps on two lines and goes on" poster="/p.jpg" creator={{ name: "Noor", href: "/@noor" }} duration="0:12" badges={<span>Free</span>} />);
    expect(screen.getByRole("link", { name: /A very long title/ }).getAttribute("href")).toBe("/watch/1");
    expect(container.querySelector("h3")?.className).toContain("min-h-[2.5em]");
    expect(container.querySelector("a > a")).toBeNull();
    expect(screen.getByText("0:12")).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("a 9:16 card puts the count and the action on a second line, a 16:9 card keeps one", () => {
    const card = (aspect: "portrait" | "landscape") => render(<VideoCard href="/" title="Clip" aspect={aspect} creator={{ name: "Noor" }} meta="1K views" action={<button type="button">Tip</button>} />).container;
    expect(card("portrait").querySelector(".flex-col.gap-1")).not.toBeNull();
    expect(card("landscape").querySelector(".flex-col.gap-1")).toBeNull();
  });

  it("swaps the picture for its animated preview while hovered, back after", () => {
    const { container } = render(<VideoCard href="/" title="Clip" poster="/still.jpg" previewSrc="/preview.webp" />);
    const article = container.querySelector("article") as HTMLElement;
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/still.jpg");
    fireEvent.mouseEnter(article);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/preview.webp");
    fireEvent.mouseLeave(article);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/still.jpg");
  });

  it("blurs a sensitive picture and keeps the reveal control above the link", () => {
    const { container } = render(<VideoCard href="/" title="Clip" poster="/s.jpg" blurred overlay={<button type="button">Reveal</button>} />);
    expect(container.querySelector("img")?.className).toContain("blur-xl");
    expect(screen.getByRole("button", { name: "Reveal" }).parentElement?.className).toContain("z-20");
  });

  it("uses the app's router link when given", () => {
    const Link = ({ href, ...p }: { href: string; className?: string; children?: React.ReactNode }) => <a data-router href={href} {...p} />;
    const { container } = render(<VideoCard href="/watch/9" title="Clip" linkAs={Link} />);
    expect(container.querySelector("[data-router]")).not.toBeNull();
  });
});

describe("ShortsShelf", () => {
  it("is a named section with a list, a See all link and named arrows", async () => {
    const { container } = render(<ShortsShelf {...shelf} items={CLIPS} getId={(c) => c.id} renderItem={(c) => <VideoCard href="/" title={c.title} aspect="portrait" />} />);
    expect(screen.getByRole("heading", { name: "Shorts" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "See all" }).getAttribute("href")).toBe("/shorts");
    expect(screen.getByRole("list", { name: "Shorts" }).querySelectorAll(":scope > li")).toHaveLength(5);
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders nothing without items", () => {
    const { container } = render(<ShortsShelf {...shelf} items={[]} getId={() => ""} renderItem={() => null} />);
    expect(container.firstChild).toBeNull();
  });
});
