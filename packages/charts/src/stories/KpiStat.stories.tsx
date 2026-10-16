import type { Meta, StoryObj } from "@storybook/react-vite";

import DashboardRowExample from "../../registry/examples/kpi-stat/dashboard-row";
import SingleExample from "../../registry/examples/kpi-stat/single";
import { chartFrame } from "./frame";

/** KpiStat. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/KpiStat", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardRow: Story = { render: () => <DashboardRowExample /> };
export const Single: Story = { render: () => <SingleExample /> };
