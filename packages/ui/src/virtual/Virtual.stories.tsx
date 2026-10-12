import type { Meta, StoryObj } from "@storybook/react-vite";

import FeedExample from "../../registry/examples/virtual/feed";
import GalleryExample from "../../registry/examples/virtual/gallery";
import MessagesExample from "../../registry/examples/virtual/messages";

/**
 * Virtual (TanStack Virtual through the facade): each story renders a named example of the registry
 * (`registry/examples/virtual/*`) — 50,000 items, a few in the page.
 */
const meta = {
  title: "Primitives/Virtual",
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Messages: Story = { render: () => <MessagesExample /> };
export const Gallery: Story = { render: () => <GalleryExample /> };
export const Feed: Story = { render: () => <FeedExample /> };
