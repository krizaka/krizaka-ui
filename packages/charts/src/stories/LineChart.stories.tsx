import type { Meta, StoryObj } from "@storybook/react-vite";

import CreatorEarningsExample from "../../registry/examples/line-chart/creator-earnings";
import ForecastExample from "../../registry/examples/line-chart/forecast";
import LiveJobsExample from "../../registry/examples/line-chart/live-jobs";
import StatesExample from "../../registry/examples/line-chart/states";
import { chartFrame } from "./frame";

/** Line chart. Each story renders a named example of the registry: the code ui.krizaka.com shows. */
const meta = { title: "Charts/LineChart", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const CreatorEarnings: Story = { render: () => <CreatorEarningsExample /> };
export const Forecast: Story = { render: () => <ForecastExample /> };
export const LiveJobs: Story = { render: () => <LiveJobsExample /> };
export const States: Story = { render: () => <StatesExample /> };
