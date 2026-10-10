import type { Meta, StoryObj } from "@storybook/react-vite";

import CheckedExample from "../../registry/examples/checkbox/checked";
import DisabledExample from "../../registry/examples/checkbox/disabled";
import IndeterminateExample from "../../registry/examples/checkbox/indeterminate";
import InvalidExample from "../../registry/examples/checkbox/invalid";
import UncheckedExample from "../../registry/examples/checkbox/unchecked";
import { Checkbox } from "./checkbox";

/**
 * `Checkbox` on Radix: checked · unchecked · indeterminate, Space toggles. Its words as children make one clickable
 * label. Each story renders a named example of the registry (`registry/examples/checkbox/*`).
 */
const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = { render: () => <UncheckedExample /> };
export const Checked: Story = { render: () => <CheckedExample /> };
export const Indeterminate: Story = { render: () => <IndeterminateExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
export const Invalid: Story = { render: () => <InvalidExample /> };
