import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import DefaultExample from "../../registry/examples/schema-form/default";
import { SchemaForm } from "./schema-form";

/** `SchemaForm`: a form from a JSON Schema. Each story renders the named example. */
const meta = {
  title: "Forms/SchemaForm",
  component: SchemaForm,
  args: { schema: {}, locale: "en-CA", words: { submit: "Create", advanced: "More options" }, messages: {} as never, onSubmit: () => {} },
} satisfies Meta<typeof SchemaForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Create" }));
    await expect(await canvas.findByText("Required.")).toBeVisible();
  },
};
/** On a phone (390 × 844): one column, the button under the fields. */
export const Phone: Story = { render: () => <DefaultExample />, parameters: { phone: true } };
