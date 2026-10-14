import type { Meta, StoryObj } from "@storybook/react-vite";

import BrandedExample from "../../registry/examples/pull-to-refresh/native/branded";
import FeedExample from "../../registry/examples/pull-to-refresh/native/feed";
import { nativeFrame } from "./story-frame";

/**
 * Native — PullToRefresh. Each story renders a named example of the registry (`registry/examples/pull-to-refresh/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/PullToRefresh", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Feed: Story = { render: () => <FeedExample /> };
export const Branded: Story = { render: () => <BrandedExample /> };
