import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "../field/field";
import { Switch } from "./switch";

/** `Switch` on Radix: role="switch", Space toggles. `label` names it when no visible label does. `size` sm · md. */
const meta = {
  title: "Primitives/Switch",
  component: Switch,
  args: { label: "Autoplay" },
} satisfies Meta<typeof Switch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Switch label="Autoplay" disabled />
      <Switch label="Loop" disabled defaultChecked />
    </div>
  ),
};

export const Small: Story = { args: { size: "sm", defaultChecked: true } };

/** Named by a visible label (`Field.Label htmlFor`), with a hint. */
export const WithLabel: Story = {
  render: () => (
    <Field.Root className="w-80">
      <div className="flex items-center justify-between gap-4">
        <Field.Label htmlFor="digest" className="text-sm text-fg">
          Weekly digest
        </Field.Label>
        <Switch id="digest" defaultChecked aria-describedby="digest-hint" />
      </div>
      <Field.Hint id="digest-hint">One email on Monday with what you missed.</Field.Hint>
    </Field.Root>
  ),
};
