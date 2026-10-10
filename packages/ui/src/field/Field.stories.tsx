import type { Meta, StoryObj } from "@storybook/react-vite";

import DefaultExample from "../../registry/examples/field/default";
import DisabledExample from "../../registry/examples/field/disabled";
import InvalidExample from "../../registry/examples/field/invalid";
import SelectExample from "../../registry/examples/field/select";
import TextareaExample from "../../registry/examples/field/textarea";
import { Input } from "./field";

/**
 * A form field: `Field.Root/Label/Hint/Error` around a control (`Input`, `Textarea`, `Select`). Each story renders a
 * named example of the registry (`registry/examples/field/*`).
 */
const meta = {
  title: "Primitives/Field",
  component: Input,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const Invalid: Story = { render: () => <InvalidExample /> };
export const Disabled: Story = { render: () => <DisabledExample /> };
export const Textarea: Story = { render: () => <TextareaExample /> };
export const Select: Story = { render: () => <SelectExample /> };
