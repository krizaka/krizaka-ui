import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/video-player/default";
import GatedExample from "../../registry/examples/video-player/gated";
import SignedSourceExample from "../../registry/examples/video-player/signed-source";
import VerticalExample from "../../registry/examples/video-player/vertical";

/**
 * VideoPlayer: each story renders a named example of the registry (`registry/examples/video-player/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/VideoPlayer",
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const SignedSource: Story = { render: () => <SignedSourceExample /> };
export const Vertical: Story = { render: () => <VerticalExample /> };
export const Gated: Story = { render: () => <GatedExample /> };
