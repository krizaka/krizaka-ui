import type { Meta, StoryObj } from "@storybook/react-vite";

import JobsExample from "../../registry/examples/list/jobs";
import SelectableExample from "../../registry/examples/list/selectable";
import VirtualizedExample from "../../registry/examples/list/virtualized";

/** List. Each story renders a named example of the registry (`registry/examples/list/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/List" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Jobs: Story = { render: () => <JobsExample /> };
export const Selectable: Story = { render: () => <SelectableExample /> };
export const Virtualized: Story = { render: () => <VirtualizedExample /> };
