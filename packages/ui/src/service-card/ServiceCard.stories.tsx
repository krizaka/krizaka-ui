import type { Meta, StoryObj } from "@storybook/react-vite";

import IndexCardExample from "../../registry/examples/service-card/index-card";
import IndexListExample from "../../registry/examples/service-card/index-list";
import ServicesExample from "../../registry/examples/service-card/services";

/** ServiceCard. Each story renders a named example of the registry (`registry/examples/service-card/*`). */
const meta = { title: "Primitives/ServiceCard", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Services: Story = { render: () => <ServicesExample /> };
export const ServicesPhone: Story = { render: () => <ServicesExample />, parameters: { phone: true } };
export const IndexCard: Story = { render: () => <IndexCardExample /> };
export const IndexCardPhone: Story = { render: () => <IndexCardExample />, parameters: { phone: true } };
export const IndexList: Story = { render: () => <IndexListExample /> };
