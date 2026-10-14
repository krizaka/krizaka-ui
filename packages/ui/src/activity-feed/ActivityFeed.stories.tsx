import type { Meta, StoryObj } from "@storybook/react-vite";

import JobActivityExample from "../../registry/examples/activity-feed/job-activity";
import LiveExample from "../../registry/examples/activity-feed/live";
import TimelineExample from "../../registry/examples/activity-feed/timeline";

/** ActivityFeed. Each story renders a named example of the registry (`registry/examples/activity-feed/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/ActivityFeed" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const JobActivity: Story = { render: () => <JobActivityExample /> };
export const Live: Story = { render: () => <LiveExample /> };
export const Timeline: Story = { render: () => <TimelineExample /> };
