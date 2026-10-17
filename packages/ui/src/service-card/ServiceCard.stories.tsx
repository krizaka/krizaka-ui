import type { Meta, StoryObj } from "@storybook/react-vite";

import ServicesExample from "../../registry/examples/service-card/services";

/** ServiceCard. Each story renders a named example of the registry (`registry/examples/service-card/*`). */
const meta = { title: "Primitives/ServiceCard", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Services: Story = { render: () => <ServicesExample /> };
export const ServicesPhone: Story = { render: () => <ServicesExample />, parameters: { phone: true } };
