import type { Meta, StoryObj } from "@storybook/react-vite";

import LoadingExample from "../../registry/examples/list/native/loading";
import NotificationsExample from "../../registry/examples/list/native/notifications";
import { nativeFrame } from "./story-frame";

/**
 * Native — List. Each story renders a named example of the registry (`registry/examples/list/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/List", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Notifications: Story = { render: () => <NotificationsExample /> };
export const Loading: Story = { render: () => <LoadingExample /> };
