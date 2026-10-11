import type { Meta, StoryObj } from "@storybook/react-vite";

import WeekOfJobsExample from "../../../registry/examples/job-throughput/native/week-of-jobs";
import { chartsNativeFrame } from "./frame";

/** Native — JobThroughput, a ready-made chart. Each story renders a named example of the registry. */
const meta = { title: "Charts Native/JobThroughput", decorators: [chartsNativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const WeekOfJobs: Story = { render: () => <WeekOfJobsExample /> };
