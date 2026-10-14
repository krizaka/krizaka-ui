import type { Meta, StoryObj } from "@storybook/react-vite";

import CustomExample from "../../registry/examples/video-trimmer/custom";
import FilmstripExample from "../../registry/examples/video-trimmer/filmstrip";
import PlayheadExample from "../../registry/examples/video-trimmer/playhead";

/**
 * VideoTrimmer: each story renders a named example of the registry (`registry/examples/video-trimmer/*`) — the code
 * ui.krizaka.com shows.
 */
const meta = {
  title: "Primitives/VideoTrimmer",
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

export const Filmstrip: Story = { render: () => <FilmstripExample /> };
export const Playhead: Story = { render: () => <PlayheadExample /> };
export const Custom: Story = { render: () => <CustomExample /> };
