import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import FiveExample from "../../registry/examples/shop-gallery/five";
import ThreeExample from "../../registry/examples/shop-gallery/three";
import TwelveExample from "../../registry/examples/shop-gallery/twelve";

/** ShopGallery: each story renders a named registry example. */
const meta = {
  title: "Blocks/ShopGallery",
  tags: ["shop-gallery"],
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Regression (akinaza#572): with an odd count of five or more, the strip rule's 4/5 ratio won over the mosaic's `auto` on the
 * lead tile, so on desktop it painted taller than the 2:1 grid and overlapped the next heading. Measured in the browser.
 */
export const Five: Story = {
  render: () => <FiveExample />,
  play: async ({ canvasElement }) => {
    if (!window.matchMedia("(min-width: 40rem)").matches) return;
    const list = within(canvasElement).getAllByRole("list")[0] as HTMLElement;
    const lead = list.querySelector("li") as HTMLElement;
    await expect(lead.getBoundingClientRect().height).toBeLessThanOrEqual(list.getBoundingClientRect().height + 1);
    await expect(lead.getBoundingClientRect().bottom).toBeLessThanOrEqual(list.getBoundingClientRect().bottom + 1);
  },
};
export const Twelve: Story = { render: () => <TwelveExample /> };
export const Three: Story = { render: () => <ThreeExample /> };
