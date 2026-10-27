// The native layouts that choose their columns from the room (Grid, Columns), and the templates built on them.
import { describe, expect, test } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";

import { Columns, columnsFit, Grid, gridColumns, itemWidth, sizeClassOf } from "./grid";
import { ThemeProvider } from "./theme";

const layout = (width: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width, height: 300 } } });
const cells = (n: number) => Array.from({ length: n }, (_, i) => <Text key={i}>{`Item ${i + 1}`}</Text>);
const widthOf = (text: string) => {
  let node = screen.getByText(text).parent;
  while (node && StyleSheet.flatten(node.props.style)?.width === undefined) node = node.parent;
  return StyleSheet.flatten(node?.props.style).width as number;
};

describe("size classes", () => {
  test("are a property of the room: compact below 600, regular below 840, expanded from there", () => {
    expect([0, 360, 599, 600, 839, 840, 1280].map(sizeClassOf)).toEqual(["compact", "compact", "compact", "regular", "regular", "expanded", "expanded"]);
  });
});

describe("gridColumns", () => {
  const base = { gap: 12, minItemWidth: 160, maxColumns: 6, fontScale: 1 };
  test("one column in a compact room, two in a regular one, three in an expanded one — by default", () => {
    expect([360, 700, 1000].map((width) => gridColumns({ ...base, width }))).toEqual([1, 2, 3]);
  });

  test("the columns asked for are a ceiling: they drop until every item is minItemWidth wide", () => {
    expect(gridColumns({ ...base, width: 700, columns: 6 })).toBe(4);
    expect(gridColumns({ ...base, width: 700, minItemWidth: 400 })).toBe(1);
    expect(gridColumns({ ...base, width: 360, columns: 4, minItemWidth: 100 })).toBe(3);
    expect(gridColumns({ ...base, width: 1400, columns: 12, minItemWidth: 100, maxColumns: 4 })).toBe(4);
  });

  test("a size class left out takes the one before it", () => {
    expect([360, 700, 1000].map((width) => gridColumns({ ...base, width, columns: { compact: 2, expanded: 4 }, minItemWidth: 100 }))).toEqual([2, 2, 4]);
    expect(gridColumns({ ...base, width: 1000, columns: { regular: 2 } })).toBe(2);
    expect(gridColumns({ ...base, width: 360, columns: { regular: 2 } })).toBe(1);
  });

  test("larger text asks for more room: at 200 % a phone holds one column of what held two", () => {
    expect(gridColumns({ ...base, width: 360, columns: 2, minItemWidth: 120 })).toBe(2);
    expect(gridColumns({ ...base, width: 360, columns: 2, minItemWidth: 120, fontScale: 2 })).toBe(1);
  });

  test("never overflows: the cells and the gaps always add up to at most the room, from 200 to 1600 pt", () => {
    for (let width = 200; width <= 1600; width += 7) {
      for (const gap of [0, 8, 12, 24]) {
        for (const fontScale of [1, 1.5, 2]) {
          const n = gridColumns({ width, gap, minItemWidth: 140, columns: { compact: 2, regular: 3, expanded: 5 }, maxColumns: 6, fontScale });
          expect(n).toBeGreaterThanOrEqual(1);
          expect(itemWidth(width, n, gap) * n + gap * (n - 1)).toBeLessThanOrEqual(width);
          if (n > 1) expect(itemWidth(width, n, gap)).toBeGreaterThanOrEqual(140 * Math.max(1, fontScale));
        }
      }
    }
  });
});

describe("Grid", () => {
  const renderGrid = (props: Partial<React.ComponentProps<typeof Grid>> = {}) =>
    render(
      <ThemeProvider>
        <Grid testID="grid" fontScale={1} {...props}>
          {cells(5)}
        </Grid>
      </ThemeProvider>,
    );

  test("is one column until it has measured its room, then follows the room it is given", async () => {
    await renderGrid();
    expect(screen.getByTestId("grid").props["data-columns"]).toBe(1);
    await act(async () => fireEvent(screen.getByTestId("grid"), "layout", layout(700)));
    expect(screen.getByTestId("grid").props["data-columns"]).toBe(2);
    expect(widthOf("Item 1")).toBe(344);
    await act(async () => fireEvent(screen.getByTestId("grid"), "layout", layout(1000)));
    expect(screen.getByTestId("grid").props["data-columns"]).toBe(3);
    await act(async () => fireEvent(screen.getByTestId("grid"), "layout", layout(360)));
    expect(screen.getByTestId("grid").props["data-columns"]).toBe(1);
  });

  test("lays out for 200 % text when asked: fewer columns, never a cramped cell", async () => {
    await renderGrid({ columns: 2, minItemWidth: 140, fontScale: 2 });
    await act(async () => fireEvent(screen.getByTestId("grid"), "layout", layout(560)));
    expect(screen.getByTestId("grid").props["data-columns"]).toBe(1);
  });

  test("a named grid is a list of its items", async () => {
    await renderGrid({ "aria-label": "Photos" });
    expect(screen.getByTestId("grid").props.role).toBe("list");
    expect(screen.getByTestId("grid").props["aria-label"]).toBe("Photos");
    const items = screen.getAllByTestId("grid-cell");
    expect(items).toHaveLength(5);
    expect(items.every((item) => item.props.role === "listitem")).toBe(true);
  });

  test("an unnamed grid is not announced as a list", async () => {
    await renderGrid();
    expect(screen.getByTestId("grid").props.role).toBeUndefined();
  });

  test("equal heights: the cells stretch and the items fill them; otherwise they sit at the top", async () => {
    await renderGrid();
    expect(StyleSheet.flatten(screen.getByTestId("grid").props.style).alignItems).toBe("stretch");
    expect(StyleSheet.flatten(screen.getByText("Item 1").props.style).flexGrow).toBe(1);
  });

  test("with equalHeight off the cells sit at the top and the items are left as they are", async () => {
    await renderGrid({ equalHeight: false });
    expect(StyleSheet.flatten(screen.getByTestId("grid").props.style).alignItems).toBe("flex-start");
    expect(screen.getByText("Item 1").props.style).toBeUndefined();
  });

  test("uses no physical edge: nothing to mirror in right-to-left", async () => {
    await renderGrid();
    const style = JSON.stringify(screen.getByTestId("grid").props.style);
    expect(style).not.toMatch(/left|right|marginLeft|marginRight|paddingLeft|paddingRight/i);
  });
});

describe("Columns", () => {
  test("side by side when the room holds them, stacked when it does not", async () => {
    await render(
      <ThemeProvider>
        <Columns testID="cols" weights={[1, 2]} fontScale={1}>
          <Text>Master</Text>
          <Text>Detail</Text>
        </Columns>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("cols").props["data-layout"]).toBe("stacked");
    await act(async () => fireEvent(screen.getByTestId("cols"), "layout", layout(700)));
    expect(screen.getByTestId("cols").props["data-layout"]).toBe("side");
    await act(async () => fireEvent(screen.getByTestId("cols"), "layout", layout(500)));
    expect(screen.getByTestId("cols").props["data-layout"]).toBe("stacked");
  });

  test("the room needed grows with the text", () => {
    expect(columnsFit(600, 2, 280, 16)).toBe(true);
    expect(columnsFit(600, 2, 280, 16, 2)).toBe(false);
    expect(columnsFit(500, 2, 280, 16)).toBe(false);
  });
});
