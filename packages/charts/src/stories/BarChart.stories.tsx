import type { Meta, StoryObj } from "@storybook/react-vite";

import JobsByStatusExample from "../../registry/examples/bar-chart/jobs-by-status";
import PlansByQuarterExample from "../../registry/examples/bar-chart/plans-by-quarter";
import TopSupportersExample from "../../registry/examples/bar-chart/top-supporters";
import { chartFrame } from "./frame";

/** Bar chart. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/BarChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobsByStatus: Story = { render: () => <JobsByStatusExample /> };
export const TopSupporters: Story = { render: () => <TopSupportersExample /> };
export const PlansByQuarter: Story = { render: () => <PlansByQuarterExample /> };
