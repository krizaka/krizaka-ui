import type { Meta, StoryObj } from "@storybook/react-vite";

import CabinetExample from "../../registry/examples/retro-tv/cabinet";
import FacadeExample from "../../registry/examples/retro-tv/facade";
import ChannelExample from "../../registry/examples/retro-tv/playlist-channel";
import CrossfadeExample from "../../registry/examples/retro-tv/playlist-crossfade";
import SlideExample from "../../registry/examples/retro-tv/playlist-slide";
import PortableExample from "../../registry/examples/retro-tv/portable";

/** RetroTv: each story renders a named registry example. */
const meta = {
  title: "Primitives/RetroTv",
  tags: ["retro-tv"],
  decorators: [(Story) => <div className="mx-auto w-72 max-w-full"><Story /></div>],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Cabinet: Story = { render: () => <CabinetExample /> };
export const Portable: Story = { render: () => <PortableExample /> };
export const Facade: Story = { render: () => <FacadeExample /> };
export const PlaylistChannel: Story = { render: () => <ChannelExample />, decorators: [(Story) => <div className="mx-auto w-full max-w-4xl"><Story /></div>] };
export const PlaylistCrossfade: Story = { render: () => <CrossfadeExample />, decorators: [(Story) => <div className="mx-auto w-full max-w-4xl"><Story /></div>] };
export const PlaylistSlide: Story = { render: () => <SlideExample />, decorators: [(Story) => <div className="mx-auto w-full max-w-4xl"><Story /></div>] };
