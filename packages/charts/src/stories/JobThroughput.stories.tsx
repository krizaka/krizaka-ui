import type { Meta, StoryObj } from "@storybook/react-vite";

import LiveHoursExample from "../../registry/examples/job-throughput/live-hours";
import WeekOfJobsExample from "../../registry/examples/job-throughput/week-of-jobs";
import { chartFrame } from "./frame";

/** JobThroughput — a ready-made chart. Each story renders a named example of the registry: the code krizaka.com/docs/ui shows. */
const meta = { title: "Charts/JobThroughput", decorators: [chartFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const WeekOfJobs: Story = { render: () => <WeekOfJobsExample /> };
export const LiveHours: Story = { render: () => <LiveHoursExample /> };
