import type { Meta, StoryObj } from "@storybook/react-vite";

import ClipExample from "../../registry/examples/media-capture/clip";
import ProfilePhotoExample from "../../registry/examples/media-capture/profile-photo";

/**
 * MediaCapture: each story renders a named example of the registry (`registry/examples/media-capture/*`) — the code
 * krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/MediaCapture",
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ProfilePhoto: Story = { render: () => <ProfilePhotoExample /> };
export const Clip: Story = { render: () => <ClipExample /> };
