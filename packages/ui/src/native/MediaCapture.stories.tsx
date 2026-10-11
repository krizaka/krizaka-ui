import type { Meta, StoryObj } from "@storybook/react-vite";

import PhotoExample from "../../registry/examples/media-capture/native/photo";
import { nativeFrame } from "./story-frame";

/**
 * Native — MediaCapture through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/media-capture/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/MediaCapture",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Photo: Story = { render: () => <PhotoExample /> };
