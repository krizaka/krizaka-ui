import type { Meta, StoryObj } from "@storybook/react-vite";

import VideoActionsExample from "../../registry/examples/action-sheet/native/video-actions";
import { nativeFrame } from "./story-frame";

/**
 * Native — ActionSheet. Each story renders a named example of the registry (`registry/examples/action-sheet/native/*`): the code
 * krizaka.com/docs/ui shows, and the screenshots it shows beside it. Opened at load (`defaultOpen`), captured on the viewport.
 */
const meta = { title: "Native/ActionSheet", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const VideoActions: Story = { render: () => <VideoActionsExample defaultOpen />, parameters: { capture: "viewport" } };
