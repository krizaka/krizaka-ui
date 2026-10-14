import type { Meta, StoryObj } from "@storybook/react-vite";

import RecipientsExample from "../../registry/examples/tag-input/recipients";
import VideoTagsExample from "../../registry/examples/tag-input/video-tags";

/**
 * TagInput: each story renders a named example of the registry (`registry/examples/tag-input/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/TagInput",
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const VideoTags: Story = { render: () => <VideoTagsExample /> };
export const Recipients: Story = { render: () => <RecipientsExample /> };
