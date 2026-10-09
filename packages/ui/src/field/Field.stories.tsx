import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field, Input, Select, Textarea } from "./field";

/**
 * A form field: `Field.Root/Label/Hint/Error` around a control (`Input`, `Textarea`, `Select`). The wiring is HTML —
 * `htmlFor`/`id`, `aria-describedby` — and `invalid` sets `aria-invalid` and `data-invalid`.
 */
const meta = {
  title: "Primitives/Field",
  component: Input,
  args: { placeholder: "you@example.com" },
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

export const Default: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label htmlFor="email">Email</Field.Label>
      <Input id="email" type="email" aria-describedby="email-hint" {...args} />
      <Field.Hint id="email-hint">We never share it.</Field.Hint>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label htmlFor="email-invalid">Email</Field.Label>
      <Input id="email-invalid" type="email" invalid defaultValue="you@" aria-describedby="email-error" {...args} />
      <Field.Error id="email-error">Enter a complete address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label htmlFor="email-disabled">Email</Field.Label>
      <Input id="email-disabled" disabled defaultValue="you@example.com" {...args} />
    </Field.Root>
  ),
};

export const TextareaField: Story = {
  name: "Textarea",
  render: () => (
    <Field.Root>
      <Field.Label htmlFor="bio">Bio</Field.Label>
      <Textarea id="bio" placeholder="A few words about you" />
    </Field.Root>
  ),
};

/** A native select: the platform's menu, accessible and right on phones. */
export const SelectField: Story = {
  name: "Select",
  render: () => (
    <Field.Root>
      <Field.Label htmlFor="country">Country</Field.Label>
      <Select id="country" defaultValue="fr">
        <option value="fr">France</option>
        <option value="tn">Tunisia</option>
        <option value="ca">Canada</option>
      </Select>
    </Field.Root>
  ),
};
