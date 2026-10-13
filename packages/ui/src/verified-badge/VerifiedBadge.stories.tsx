import type { Meta, StoryObj } from "@storybook/react-vite";

import VerifiedExample from "../../registry/examples/verified-badge/verified";

/** VerifiedBadge. Each story renders a named example of the registry (`registry/examples/verified-badge/*`): the code krizaka.com/docs/ui shows. */
const meta = { title: "Primitives/VerifiedBadge" } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Verified: Story = { render: () => <VerifiedExample /> };
