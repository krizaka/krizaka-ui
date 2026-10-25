import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/quota-meter/default";
import FullExample from "../../registry/examples/quota-meter/full";

/** Quota meter. Each story renders a named example of the registry. */
const meta = { title: "Data display/QuotaMeter", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Full: Story = { render: () => <FullExample /> };
