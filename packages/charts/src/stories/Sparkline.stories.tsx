import type { Meta, StoryObj } from "@storybook/react-vite";

import BarsExample from "../../registry/examples/sparkline/bars";
import StatTrendExample from "../../registry/examples/sparkline/stat-trend";
import TableRowsExample from "../../registry/examples/sparkline/table-rows";
import { chartFrame } from "./frame";

/** Sparkline. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/Sparkline", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const StatTrend: Story = { render: () => <StatTrendExample /> };
export const TableRows: Story = { render: () => <TableRowsExample /> };
export const Bars: Story = { render: () => <BarsExample /> };
