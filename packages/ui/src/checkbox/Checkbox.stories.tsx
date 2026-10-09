import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "../field/field";
import { Checkbox } from "./checkbox";

/**
 * `Checkbox` on Radix: checked · unchecked · indeterminate, Space toggles. Its words as children make one clickable
 * label; in a `Field` it takes `Field.Label htmlFor`, `invalid` and a `Field.Error`.
 */
const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  args: { children: "I accept the terms of use" },
} satisfies Meta<typeof Checkbox>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

/** `checked="indeterminate"`: some of a list. */
export const Indeterminate: Story = { args: { checked: "indeterminate", children: "Select all videos" } };

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox disabled>Email me the receipts</Checkbox>
      <Checkbox disabled defaultChecked>
        Keep me signed in
      </Checkbox>
    </div>
  ),
};

/** In a `Field`, invalid, with its error. */
export const Invalid: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Checkbox invalid aria-describedby="age-error">
        I am 18 or older
      </Checkbox>
      <Field.Error id="age-error">You must be 18 or older to continue.</Field.Error>
    </Field.Root>
  ),
};
