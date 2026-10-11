import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/video-player/default";
import GatedExample from "../../registry/examples/video-player/gated";
import SignedSourceExample from "../../registry/examples/video-player/signed-source";
import VerticalExample from "../../registry/examples/video-player/vertical";

/**
 * VideoPlayer: each story renders a named example of the registry (`registry/examples/video-player/*`) — the code
 * krizaka.com/docs/ui shows.
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

// Its poster is a remote picture of the Orochia app that is re-recorded as the product moves (and decoded differently
// from one run to the next): audited, not screenshot-compared — the controls are covered by the other stories.
export const Default: Story = { render: () => <DefaultExample />, parameters: { screenshot: false } };
export const SignedSource: Story = { render: () => <SignedSourceExample /> };
export const Vertical: Story = { render: () => <VerticalExample /> };
export const Gated: Story = { render: () => <GatedExample /> };
