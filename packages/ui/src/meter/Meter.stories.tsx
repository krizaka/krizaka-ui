import type { Meta, StoryObj } from "@storybook/react-vite";

import BalanceExample from "../../registry/examples/meter/balance";
import QuotaExample from "../../registry/examples/meter/quota";
import SplitExample from "../../registry/examples/meter/split";
import { Meter } from "./meter";

/** A measure within a range. Each story renders a named example. */
const meta = {
  title: "Primitives/Meter",
  component: Meter,
  args: { label: "Storage" },
} satisfies Meta<typeof Meter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Split: Story = { render: () => <SplitExample /> };
export const Quota: Story = { render: () => <QuotaExample /> };
export const Balance: Story = { render: () => <BalanceExample /> };
