import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { axeViolations } from "../test/axe";
import { columnsFor, VirtualGrid, type VirtualHandle, VirtualList } from "./index";

const items = Array.from({ length: 50_000 }, (_, i) => ({ id: `m${i}`, text: `Message ${i + 1}` }));
const listItems = () => screen.getAllByRole("listitem");

function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

describe("VirtualList", () => {
  it("renders the items in view out of 50,000, each placed in the whole, in a named region — no axe violation", async () => {
    const { container } = render(<VirtualList items={items} getKey={(m) => m.id} estimateSize={40} height={400} label="Messages" renderItem={(m) => <p>{m.text}</p>} />);
    const region = screen.getByRole("region", { name: "Messages" });
    expect(region.tabIndex).toBe(0);
    expect(listItems().length).toBeGreaterThan(5);
    expect(listItems().length).toBeLessThan(30);
    expect(listItems()[0]?.getAttribute("aria-setsize")).toBe("50000");
    expect(listItems()[0]?.getAttribute("aria-posinset")).toBe("1");
    expect(screen.getByRole("list").style.height).toBe(`${50_000 * 40}px`);
    expect(await axeViolations(container)).toEqual([]);
  });

  it("renders what the scroll brings into view", async () => {
    render(<VirtualList items={items} estimateSize={40} height={400} label="Messages" renderItem={(m) => <p>{m.text}</p>} />);
    const region = screen.getByRole("region", { name: "Messages" });
    await act(async () => {
      region.scrollTop = 40 * 20_000;
      fireEvent.scroll(region);
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(screen.getByText("Message 20001")).toBeTruthy();
    expect(screen.queryByText("Message 1")).toBeNull();
  });

  it("asks for more once per length when the end comes near", () => {
    const onEndReached = vi.fn();
    const short = items.slice(0, 8);
    const { rerender } = render(<VirtualList items={short} estimateSize={40} height={400} label="Feed" onEndReached={onEndReached} renderItem={(m) => m.text} />);
    expect(onEndReached).toHaveBeenCalledTimes(1);
    rerender(<VirtualList items={short} estimateSize={40} height={400} label="Feed" onEndReached={onEndReached} renderItem={(m) => m.text} />);
    expect(onEndReached).toHaveBeenCalledTimes(1);
    rerender(<VirtualList items={items.slice(0, 9)} estimateSize={40} height={400} label="Feed" onEndReached={onEndReached} renderItem={(m) => m.text} />);
    expect(onEndReached).toHaveBeenCalledTimes(2);
  });

  it("scrolls to an item smoothly, or at once when the person asked for less motion", () => {
    const calls: ScrollToOptions[] = [];
    const original = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number) {
      if (typeof options === "object") calls.push(options);
    } as typeof HTMLElement.prototype.scrollTo;
    for (const reduce of [false, true]) {
      setReducedMotion(reduce);
      const ref = React.createRef<VirtualHandle>();
      const { unmount } = render(<VirtualList ref={ref} items={items} estimateSize={40} height={400} label="Messages" renderItem={(m) => m.text} />);
      act(() => ref.current?.scrollToIndex(1000, "start"));
      expect(calls.at(-1)?.behavior).toBe(reduce ? "auto" : "smooth");
      unmount();
    }
    setReducedMotion(false);
    HTMLElement.prototype.scrollTo = original;
    expect(calls.length).toBeGreaterThanOrEqual(2);
  });

  it("says when there is nothing, and follows the page in window mode", () => {
    const { rerender } = render(<VirtualList items={[]} estimateSize={40} label="Messages" empty="No message yet" renderItem={() => null} />);
    expect(screen.getByText("No message yet")).toBeTruthy();
    rerender(<VirtualList items={items} scroll="window" estimateSize={120} label="Feed" renderItem={(m) => m.text} />);
    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.getByRole("list", { name: "Feed" })).toBeTruthy();
    expect(listItems().length).toBeLessThan(30);
  });
});

describe("VirtualGrid", () => {
  it("renders the rows in view as a gallery, each cell placed in the whole", async () => {
    const { container } = render(
      <VirtualGrid items={items} columns={4} estimateRowHeight={200} height={480} label="Videos" renderItem={(m) => <div>{m.text}</div>} />,
    );
    expect(screen.getByRole("region", { name: "Videos" })).toBeTruthy();
    const cells = listItems();
    expect(cells.length % 4).toBe(0);
    expect(cells.length).toBeLessThan(40);
    expect(cells[5]?.getAttribute("aria-posinset")).toBe("6");
    expect(container.querySelector("[data-index]")?.getAttribute("style")).toContain("repeat(4, minmax(0, 1fr))");
    expect(await axeViolations(container)).toEqual([]);
  });

  it("fits as many columns as the width allows", () => {
    expect(columnsFor(1000, 220, 16)).toBe(4);
    expect(columnsFor(300, 220, 16)).toBe(1);
    expect(columnsFor(0, 220, 16)).toBe(1);
  });
});
