import type { Meta, StoryObj } from "@storybook/react-vite";

import NotificationsExample from "../../registry/examples/activity-feed/native/notifications";
import { nativeFrame } from "./story-frame";

/** Native — ActivityFeed. Each story renders a named example of the registry (`registry/examples/activity-feed/native/*`). */
const meta = { title: "Native/ActivityFeed", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Notifications: Story = { render: () => <NotificationsExample /> };
