import type { Meta, StoryObj } from "@storybook/react-vite";

import CardExample from "../../registry/examples/reviews/card";
import SummaryExample from "../../registry/examples/reviews/summary";

/** Reviews: each story renders a named registry example. */
const meta = { title: "Blocks/Reviews", tags: ["reviews"], parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Summary: Story = { render: () => <SummaryExample /> };
export const Card: Story = { render: () => <CardExample /> };
export const CardPhone: Story = { render: () => <CardExample />, parameters: { phone: true } };
