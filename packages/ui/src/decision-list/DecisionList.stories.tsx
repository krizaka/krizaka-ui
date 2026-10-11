import type { Meta, StoryObj } from "@storybook/react-vite";

import ProductExample from "../../registry/examples/decision-list/product";
import { DecisionList } from "./decision-list";

/** Decision list — a page block. Each story renders a named example. */
const meta = {
  title: "Blocks/DecisionList",
  component: DecisionList,
} satisfies Meta<typeof DecisionList>;
export default meta;

type Story = StoryObj;

export const Product: Story = { render: () => <ProductExample /> };
