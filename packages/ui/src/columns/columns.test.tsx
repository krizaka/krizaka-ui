import { render, screen } from "@testing-library/react";

import ColumnsExample from "../../registry/examples/columns/columns";
import PhotosExample from "../../registry/examples/columns/photos";
import StatsExample from "../../registry/examples/columns/stats";
import { axeViolations } from "../test/axe";
import { Columns, columnsFor, columnsNeed, DEFAULT_COLUMNS, Grid, GRID_GAPS } from "./index";

// The layout itself (container widths 320 · 600 · 840 · 1200, text at 200 %, rtl) is measured in a real browser by the
// `play` functions of Columns.stories.tsx; jsdom has no layout, so here the props become the CSS that decides it.
const track = (container: HTMLElement) => container.querySelector<HTMLElement>("[style*='--kz-grid-compact']")!;
const vars = (el: HTMLElement) => ({
  compact: el.style.getPropertyValue("--kz-grid-compact"),
  regular: el.style.getPropertyValue("--kz-grid-regular"),
  expanded: el.style.getPropertyValue("--kz-grid-expanded"),
  min: el.style.getPropertyValue("--kz-grid-min"),
});

describe("columnsFor", () => {
  it("defaults to 1 · 2 · 3 and takes the size class before when one is left out", () => {
    expect(columnsFor(undefined, "compact")).toBe(DEFAULT_COLUMNS.compact);
    expect(columnsFor(undefined, "expanded")).toBe(3);
    expect(columnsFor({ compact: 2, expanded: 4 }, "regular")).toBe(2);
    expect(columnsFor({ compact: 2, expanded: 4 }, "expanded")).toBe(4);
    expect(columnsFor({ regular: 3 }, "compact")).toBe(1);
  });
  it("takes one number for every size class, whole and at least 1", () => {
    expect(columnsFor(3.7, "compact")).toBe(3);
    expect(columnsFor(0, "expanded")).toBe(1);
  });
});

describe("Grid", () => {
  it("sets the columns of the three size classes and switches them at 600 and 840 px of its container", () => {
    const { container } = render(<Grid columns={{ compact: 2, regular: 3, expanded: 4 }}><i /><i /></Grid>);
    expect(vars(track(container))).toMatchObject({ compact: "2", regular: "3", expanded: "4" });
    expect(container.firstElementChild!.className).toContain("@container");
    expect(track(container).className).toContain("@min-[600px]:[--kz-grid-cols:var(--kz-grid-regular)]");
    expect(track(container).className).toContain("@min-[840px]:[--kz-grid-cols:var(--kz-grid-expanded)]");
  });
  it("caps the columns at maxColumns and reads the minimum in rem, multiplied by the text scale", () => {
    const { container, rerender } = render(<Grid columns={8} maxColumns={5} minItemWidth={160}><i /></Grid>);
    expect(vars(track(container))).toMatchObject({ compact: "5", expanded: "5", min: "10rem" });
    rerender(<Grid minItemWidth={160} fontScale={2}><i /></Grid>);
    expect(vars(track(container)).min).toBe("20rem");
    rerender(<Grid minItemWidth={160} fontScale={0.5}><i /></Grid>);
    expect(vars(track(container)).min, "a smaller scale never shrinks below the asked width").toBe("10rem");
  });
  it("uses the gap tokens: the spacing scale, the same pixels as native", () => {
    const { container, rerender } = render(<Grid><i /></Grid>);
    expect(track(container).className).toContain("gap-3");
    for (const [gap, cls] of [["none", "gap-0"], ["xs", "gap-1"], ["sm", "gap-2"], ["lg", "gap-4"], ["xl", "gap-6"]] as const) {
      rerender(<Grid gap={gap}><i /></Grid>);
      expect(track(container).className).toContain(cls);
      expect(track(container).style.getPropertyValue("--kz-grid-gap")).toBe(`${GRID_GAPS[gap] / 16}rem`);
    }
  });
  it("stretches the cells to one height, or lets each keep its own", () => {
    const { container, rerender } = render(<Grid><i /></Grid>);
    expect(track(container).className).toContain("items-stretch");
    rerender(<Grid equalHeight={false}><i /></Grid>);
    expect(track(container).className).toContain("items-start");
  });
  it("is a list of list items with an aria-label, and plain otherwise; the order of the children is kept", () => {
    const { rerender } = render(<Grid aria-label="Photos"><b>a</b><b>b</b></Grid>);
    expect(screen.getByRole("list", { name: "Photos" })).toBeTruthy();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["a", "b"]);
    rerender(<Grid><b>a</b></Grid>);
    expect(screen.queryByRole("list")).toBeNull();
  });
  it("uses no physical edge, so right-to-left mirrors it", () => {
    const { container } = render(<Grid><i /></Grid>);
    expect(container.innerHTML).not.toMatch(/\b(ml|mr|pl|pr|left|right)-/);
  });
  it("passes className, style and other attributes to its root", () => {
    const { container } = render(<Grid className="mine" data-testid="g" style={{ marginTop: 3 }}><i /></Grid>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("mine");
    expect(root.getAttribute("data-testid")).toBe("g");
    expect(root.style.marginTop).toBe("3px");
  });
});

describe("columnsNeed", () => {
  it("is the columns plus the gaps between them, grown by the text scale", () => {
    expect(columnsNeed(2, 280, 16)).toBe(576);
    expect(columnsNeed(3, 220, 24, 2)).toBe(3 * 440 + 48);
    expect(columnsNeed(2, 280, 16, 0.5)).toBe(576);
  });
});

describe("Columns", () => {
  it("keeps the order, gives each column its weight and a basis that stacks below the width they need", () => {
    const { container } = render(<Columns weights={[1, 2]} minColumnWidth={220}><b>a</b><b>b</b></Columns>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--kz-columns-need")).toBe(`${(2 * 220 + 16) / 16}rem`);
    const cols = [...root.children] as HTMLElement[];
    expect(cols.map((c) => c.textContent)).toEqual(["a", "b"]);
    expect(cols.map((c) => c.style.flexGrow)).toEqual(["1", "2"]);
    expect(cols[0]!.style.flexBasis).toBe("calc((var(--kz-columns-need) - 100%) * 999)");
    expect(root.className).toContain("flex-wrap");
    expect(root.className).toContain("gap-4");
  });
  it("defaults to equal columns of 280 px, and a text scale of 2 doubles the width they need", () => {
    const { container, rerender } = render(<Columns><i /><i /><i /></Columns>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--kz-columns-need")).toBe(`${(3 * 280 + 32) / 16}rem`);
    expect((root.children[2] as HTMLElement).style.flexGrow).toBe("1");
    rerender(<Columns fontScale={2}><i /><i /><i /></Columns>);
    expect(root.style.getPropertyValue("--kz-columns-need")).toBe(`${(3 * 560 + 32) / 16}rem`);
  });
  it("gives a lone column the full width", () => {
    const { container } = render(<Columns><i /></Columns>);
    expect(((container.firstElementChild as HTMLElement).firstElementChild as HTMLElement).style.flexBasis).toBe("100%");
  });
  it("uses no physical edge, so right-to-left mirrors it", () => {
    const { container } = render(<Columns><i /><i /></Columns>);
    expect(container.innerHTML).not.toMatch(/\b(ml|mr|pl|pr|left|right)-/);
  });
});

describe("registry examples", () => {
  it.each([["photos", PhotosExample], ["stats", StatsExample], ["columns", ColumnsExample]] as const)("%s has no axe violation", async (_name, Example) => {
    const { container } = render(<Example />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
