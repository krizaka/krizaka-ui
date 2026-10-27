import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/entity-header/basic";

/** EntityHeader. Each story renders a named example of the registry (`registry/examples/entity-header/*`): the code ui.krizaka.com shows. */
const meta = { title: "Primitives/EntityHeader" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
