import type { Meta, StoryObj } from "@storybook/react-vite";

import OrazakaExample from "../../registry/examples/product-page/orazaka";
import { ProductPage } from "./product-page";

/** Product page — a page template. Each story renders a named example, on a desktop and on a phone. */
const meta = {
  title: "Templates/ProductPage",
  component: ProductPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductPage>;
export default meta;

type Story = StoryObj;

export const Orazaka: Story = { render: () => <OrazakaExample /> };
/** On a phone (390 × 844). */
export const OrazakaPhone: Story = { render: () => <OrazakaExample />, parameters: { phone: true } };
