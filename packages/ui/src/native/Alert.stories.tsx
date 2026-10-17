import type { Meta, StoryObj } from "@storybook/react-vite";

import TonesExample from "../../registry/examples/alert/native/tones";
import { nativeFrame } from "./story-frame";

/** Native — a message in the flow of the screen, in four tones. Each story renders a named example of the registry (`registry/examples/alert/native/*`). */
const meta = {
  title: "Native/Alert",
  decorators: [nativeFrame],
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = { render: () => <TonesExample /> };
