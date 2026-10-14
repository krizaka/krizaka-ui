import type { Meta, StoryObj } from "@storybook/react-vite";

import BlockedExample from "../../registry/examples/permission-prompt/native/blocked";
import CameraExample from "../../registry/examples/permission-prompt/native/camera";
import { nativeFrame } from "./story-frame";

/**
 * Native — PermissionPrompt. Each story renders a named example of the registry (`registry/examples/permission-prompt/native/*`): the code
 * ui.krizaka.com shows, and the screenshots it shows beside it.
 */
const meta = { title: "Native/PermissionPrompt", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Camera: Story = { render: () => <CameraExample /> };
export const Blocked: Story = { render: () => <BlockedExample /> };
