import type { Meta, StoryObj } from "@storybook/react-vite";

import ProductsExample from "../../registry/examples/card-grid/products";
import RevealExample from "../../registry/examples/card-grid/reveal";
import { CardGrid } from "./card-grid";

/** Card grid — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/CardGrid",
  component: CardGrid,
} satisfies Meta<typeof CardGrid>;
export default meta;

type Story = StoryObj;

export const Products: Story = { render: () => <ProductsExample /> };
export const Reveal: Story = { render: () => <RevealExample /> };
