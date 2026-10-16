import type { Meta, StoryObj } from "@storybook/react-vite";

import BeforeAfterExample from "../../registry/examples/chart-card/before-after";
import JobsActivityExample from "../../registry/examples/chart-card/jobs-activity";
import SparseAndEmptyExample from "../../registry/examples/chart-card/sparse-and-empty";
import UsageDonutExample from "../../registry/examples/chart-card/usage-donut";
import { chartFrame } from "./frame";

/** ChartCard. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/ChartCard", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobsActivity: Story = { render: () => <JobsActivityExample /> };
export const UsageDonut: Story = { render: () => <UsageDonutExample /> };
export const SparseAndEmpty: Story = { render: () => <SparseAndEmptyExample /> };
export const BeforeAfter: Story = { render: () => <BeforeAfterExample /> };
