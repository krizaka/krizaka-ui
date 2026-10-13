import type { Meta, StoryObj } from "@storybook/react-vite";

import ModerationExample from "../../registry/examples/kanban/moderation";

/** Kanban. Each story renders a named example of the registry (`registry/examples/kanban/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/Kanban" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Moderation: Story = { render: () => <ModerationExample /> };
