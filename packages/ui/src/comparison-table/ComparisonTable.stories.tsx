import type { Meta, StoryObj } from "@storybook/react-vite";

import VersusExample from "../../registry/examples/comparison-table/versus";

/** A fair “versus” grid: aligned rows, your column a highlighted band, neutral answers elsewhere; cards on a phone. */
const meta = { title: "Blocks/ComparisonTable" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Versus: Story = { render: () => <VersusExample /> };
export const Phone: Story = { render: () => <VersusExample />, globals: { viewport: { value: "mobile1" } } };
