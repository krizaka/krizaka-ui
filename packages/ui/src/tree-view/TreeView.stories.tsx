import type { Meta, StoryObj } from "@storybook/react-vite";

import DocsExample from "../../registry/examples/tree-view/docs";
import LazyExample from "../../registry/examples/tree-view/lazy";

/** TreeView. Each story renders a named example of the registry (`registry/examples/tree-view/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/TreeView" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Docs: Story = { render: () => <DocsExample /> };
export const Lazy: Story = { render: () => <LazyExample /> };
