import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/update-prompt/native/default";
import { nativeFrame } from "./story-frame";

/** Native — UpdatePrompt. The story renders the named example of the registry (`registry/examples/update-prompt/native/default`). */
const meta = { title: "Native/UpdatePrompt", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
