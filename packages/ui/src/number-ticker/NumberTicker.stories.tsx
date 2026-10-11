import type { Meta, StoryObj } from "@storybook/react-vite";

import GradientExample from "../../registry/examples/number-ticker/gradient";
import LiveTotalExample from "../../registry/examples/number-ticker/live-total";
import StatsExample from "../../registry/examples/number-ticker/stats";
import { NumberTicker } from "./number-ticker";

/** Figures that climb into view, or roll to a new value. Each story renders a named example. */
const meta = {
  title: "Primitives/NumberTicker",
  component: NumberTicker,
  args: { value: 0 },
} satisfies Meta<typeof NumberTicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Stats: Story = { render: () => <StatsExample /> };
export const LiveTotal: Story = { render: () => <LiveTotalExample /> };
export const Gradient: Story = { render: () => <GradientExample /> };
