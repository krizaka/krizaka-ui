import type { Meta, StoryObj } from "@storybook/react-vite";

import PhoneExample from "../../registry/examples/sticky-action/phone";

/** StickyAction. Each story renders a named example of the registry (`registry/examples/sticky-action/*`). */
const meta = { title: "Primitives/StickyAction", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Phone: Story = { render: () => <PhoneExample />, parameters: { phone: true } };
