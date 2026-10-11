import type { Meta, StoryObj } from "@storybook/react-vite";

import AvatarExample from "../../registry/examples/image-cropper/avatar";
import BannerExample from "../../registry/examples/image-cropper/banner";
import VerticalVideoExample from "../../registry/examples/image-cropper/vertical-video";

/**
 * ImageCropper: each story renders a named example of the registry (`registry/examples/image-cropper/*`) — the code
 * krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/ImageCropper",
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Avatar: Story = { render: () => <AvatarExample /> };
export const Banner: Story = { render: () => <BannerExample /> };
// A `<video>` frame is decoded by the browser at its own pace: audited, not screenshot-compared.
export const VerticalVideo: Story = { render: () => <VerticalVideoExample />, parameters: { screenshot: false } };
