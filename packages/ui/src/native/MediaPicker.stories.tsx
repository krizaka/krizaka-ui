import type { Meta, StoryObj } from "@storybook/react-vite";

import StoryExample from "../../registry/examples/media-picker/native/story";
import { nativeFrame } from "./story-frame";

/**
 * Native — MediaPicker. Each story renders a named example of the registry (`registry/examples/media-picker/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/MediaPicker", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = { render: () => <StoryExample /> };
