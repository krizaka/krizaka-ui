import type { Meta, StoryObj } from "@storybook/react-vite";

import SovkoraExample from "../../registry/examples/product-page/sovkora";
import { ProductPage } from "./product-page";

/** Product page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ProductPage",
  component: ProductPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductPage>;
export default meta;

type Story = StoryObj;

export const Sovkora: Story = { render: () => <SovkoraExample /> };
/** On a phone (390 × 844). */
export const SovkoraPhone: Story = { render: () => <SovkoraExample />, parameters: { phone: true } };
