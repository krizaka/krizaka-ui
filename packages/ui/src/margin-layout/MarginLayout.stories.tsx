import type { Meta, StoryObj } from "@storybook/react-vite";

import FindingsExample from "../../registry/examples/margin-layout/findings";
import StepsExample from "../../registry/examples/margin-layout/steps";

/** Margin layout. Each story renders a named example of the registry. */
const meta = { title: "Blocks/MarginLayout", parameters: { layout: "padded" } } satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Findings: Story = { render: () => <FindingsExample /> };
export const Steps: Story = { render: () => <StepsExample /> };
