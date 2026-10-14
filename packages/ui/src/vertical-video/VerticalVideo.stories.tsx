import type { Meta, StoryObj } from "@storybook/react-vite";

import FeedExample from "../../registry/examples/vertical-video/feed";
import RailExample from "../../registry/examples/vertical-video/rail";
import { VerticalVideo } from "./vertical-video";

/** A 9:16 short video with its action rail, and a snap-scrolling feed. Each story renders a named example. */
const meta = {
  title: "Primitives/VerticalVideo",
  component: VerticalVideo,
  // A <video> frame depends on the decoder: the audit runs, the screenshot does not.
  parameters: { screenshot: false },
} satisfies Meta<typeof VerticalVideo>;
export default meta;

type Story = StoryObj;

export const Rail: Story = { render: () => <RailExample /> };
export const Feed: Story = { render: () => <FeedExample /> };
