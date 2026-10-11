import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/video-player/native/default";
import { nativeFrame } from "./story-frame";

/**
 * Native — VideoPlayer through react-native-web. Each story renders a named example of the registry
 * (`registry/examples/video-player/native/*`): the code krizaka.com/docs/ui shows, with these screenshots.
 */
const meta = {
  title: "Native/VideoPlayer",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
