import type { Meta, StoryObj } from "@storybook/react-vite";

import DashboardHeadExample from "../../../registry/examples/kpi-stat/native/dashboard-head";
import { chartsNativeFrame } from "./frame";

/** Native — KpiStat. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts Native/KpiStat", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardHead: Story = { render: () => <DashboardHeadExample /> };
