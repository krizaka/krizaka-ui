import type { Meta, StoryObj } from "@storybook/react-vite";

import EntityExample from "../../registry/examples/collection-switcher/entity";
import ListExample from "../../registry/examples/collection-switcher/list";
import TreeExample from "../../registry/examples/collection-switcher/tree";

/** CollectionSwitcher. Each story renders a named example of the registry (`registry/examples/collection-switcher/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/CollectionSwitcher" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <ListExample /> };
export const Tree: Story = { render: () => <TreeExample /> };
export const Entity: Story = { render: () => <EntityExample /> };
