import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/status-chip/native/default";
import { nativeFrame } from "./story-frame";

/** Native — StatusChip. Each story renders a named example of the registry (`registry/examples/status-chip/native/*`). */
const meta = { title: "Native/StatusChip", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
