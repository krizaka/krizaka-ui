import type { Meta, StoryObj } from "@storybook/react-vite";

import BasicExample from "../../registry/examples/identity-card/basic";

/** IdentityCard. Each story renders a named example of the registry (`registry/examples/identity-card/*`): the code ui.krizaka.com shows. */
const meta = { title: "Blocks/IdentityCard" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <BasicExample /> };
