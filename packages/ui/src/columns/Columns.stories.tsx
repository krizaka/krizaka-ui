import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";

import ColumnsExample from "../../registry/examples/columns/columns";
import PhotosExample from "../../registry/examples/columns/photos";
import StatsExample from "../../registry/examples/columns/stats";
import { Columns, Grid } from "./columns";

/**
 * Grid and Columns decide on the width of their container. A story per example, then each in a container of 320, 600,
 * 840 and 1200 px (the viewport never changes), in right-to-left, and with 200 % text. The `play` functions measure
 * the real layout: how many columns sit on the first row, and that nothing sticks out of its container.
 */
const meta = { title: "Primitives/Columns", component: Columns, parameters: { layout: "padded" } } satisfies Meta<typeof Columns>;
export default meta;

type Story = StoryObj;

const room = (width: number, node: ReactNode, dir?: "rtl") => (
  <div data-room style={{ width, maxWidth: "100%", direction: dir ?? "ltr" }}>
    {node}
  </div>
);

/** How many items share the first row of the grid / the columns, and whether anything sticks out of the room. */
function firstRow(canvas: HTMLElement, selector: string) {
  const room = canvas.querySelector<HTMLElement>("[data-room]")!;
  const items = [...canvas.querySelectorAll<HTMLElement>(selector)];
  const top = items[0]!.getBoundingClientRect().top;
  const inRow = items.filter((el) => Math.abs(el.getBoundingClientRect().top - top) < 2);
  const box = room.getBoundingClientRect();
  const out = items.some((el) => el.getBoundingClientRect().right > box.right + 1 || el.getBoundingClientRect().left < box.left - 1);
  return { count: inRow.length, out };
}

const cells = "ul[aria-label] > li";
const photos = (width: number, count: number): Story => ({
  render: () => room(width, <PhotosExample />),
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement, cells);
    await expect(row.count).toBe(count);
    await expect(row.out).toBe(false);
  },
});
const stats = (width: number, count: number): Story => ({
  render: () => room(width, <StatsExample />),
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement, "[data-room] > div > div > div");
    await expect(row.count).toBe(count);
    await expect(row.out).toBe(false);
  },
});
const columns = (width: number, count: number): Story => ({
  render: () => room(width, <ColumnsExample />),
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement, "[data-layout='columns'] > div");
    await expect(row.count).toBe(count);
    await expect(row.out).toBe(false);
  },
});

export const Photos320: Story = photos(320, 2);
export const Photos600: Story = photos(600, 3);
export const Photos840: Story = photos(840, 4);
export const Photos1200: Story = photos(1200, 4);

export const Stats320: Story = stats(320, 2);
export const Stats600: Story = stats(600, 2);
export const Stats840: Story = stats(840, 4);
export const Stats1200: Story = stats(1200, 4);

// 2 × 220 px + the 16 px gap = 456 px: stacked below it, a third and two thirds from it.
export const Columns320: Story = columns(320, 1);
export const Columns440: Story = columns(440, 1);
export const Columns600: Story = columns(600, 2);
export const Columns1200: Story = columns(1200, 2);

/** Right-to-left: the first item is at the start edge, on the right. */
export const PhotosRtl: Story = {
  render: () => room(600, <PhotosExample />, "rtl"),
  play: async ({ canvasElement }) => {
    const items = [...canvasElement.querySelectorAll<HTMLElement>(cells)];
    await expect(items[0]!.getBoundingClientRect().left).toBeGreaterThan(items[1]!.getBoundingClientRect().left);
  },
};
export const ColumnsRtl: Story = {
  render: () => room(600, <ColumnsExample />, "rtl"),
  play: async ({ canvasElement }) => {
    const [first, second] = [...canvasElement.querySelectorAll<HTMLElement>("[data-layout='columns'] > div")];
    await expect(first!.getBoundingClientRect().left).toBeGreaterThan(second!.getBoundingClientRect().left);
  },
};

/** 200 % text: the stats ask for twice the width, so a container that held two per row stacks them into one. */
export const StatsLargeText: Story = {
  render: () =>
    room(
      360,
      <Grid columns={{ compact: 2, expanded: 4 }} minItemWidth={140} fontScale={2}>
        {["Files to decide", "Checks this month", "Credits left", "Average time"].map((label) => (
          <div key={label} className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-1 p-3.5">
            <span className="text-2xl text-fg-muted">{label}</span>
            <span className="text-4xl font-semibold text-fg">58</span>
          </div>
        ))}
      </Grid>,
    ),
  play: async ({ canvasElement }) => {
    const row = firstRow(canvasElement, "[data-room] > div > div > div");
    await expect(row.count).toBe(1);
    await expect(row.out).toBe(false);
  },
};

/** 200 % text on the columns: 2 × 220 px becomes 2 × 440 px, so they stack where they were side by side. */
export const ColumnsLargeText: Story = {
  render: () => room(600, <Columns weights={[1, 2]} minColumnWidth={220} fontScale={2}><div>Summary</div><div>The file</div></Columns>),
  play: async ({ canvasElement }) => {
    await expect(firstRow(canvasElement, "[data-layout='columns'] > div").count).toBe(1);
  },
};
