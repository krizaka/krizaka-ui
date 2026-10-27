import type { Meta, StoryObj } from "@storybook/react-vite";

import ListExample from "../../registry/examples/collection-switcher/native/list";
import { nativeFrame } from "./story-frame";

/** Native — the collections of a workspace, nested, the default one marked. Each story renders a named example of the registry. */
const meta = { title: "Native/CollectionSwitcher", decorators: [nativeFrame] } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = { render: () => <ListExample /> };
