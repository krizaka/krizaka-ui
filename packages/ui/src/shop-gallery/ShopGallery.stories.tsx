import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Five: Story = { render: () => <FiveExample /> };
export const Twelve: Story = { render: () => <TwelveExample /> };
export const Three: Story = { render: () => <ThreeExample /> };
