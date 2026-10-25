import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/status-chip/default";

/** StatusChip (#627). Each story renders a named example of the registry (`registry/examples/status-chip/*`). */
const meta = { title: "Data display/StatusChip" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
