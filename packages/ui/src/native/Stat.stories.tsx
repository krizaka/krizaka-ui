import type { Meta, StoryObj } from "@storybook/react-vite";

import DashboardExample from "../../registry/examples/stat/native/dashboard";
import WithChartExample from "../../registry/examples/stat/native/with-chart";
import { nativeFrame } from "./story-frame";

/** Native — a key figure: label, value, the change in words, a hint. Each story renders a named example of the registry (`registry/examples/stat/native/*`). */
const meta = {
  title: "Native/Stat",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Dashboard: Story = { render: () => <DashboardExample /> };
export const WithChart: Story = { render: () => <WithChartExample /> };
