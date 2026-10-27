import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import AppliedExample from "../../registry/examples/promo-code-field/applied";
import DefaultExample from "../../registry/examples/promo-code-field/default";
import ExpiredExample from "../../registry/examples/promo-code-field/expired";
import { PromoCodeField } from "./promo-code-field";

/** `PromoCodeField`: enter, apply, see the state. Each story renders a named example; `Default` applies a code. */
const meta = {
  title: "Primitives/PromoCodeField",
  component: PromoCodeField,
  args: { label: "Promo code", applyLabel: "Apply", removeLabel: "Remove", onApply: async () => ({ ok: true as const, effect: "" }) },
} satisfies Meta<typeof PromoCodeField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DefaultExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Promo code"), "founder{Enter}");
    await expect((await canvas.findAllByText(/39 \$/))[0]).toBeVisible();
  },
};
export const Applied: Story = { render: () => <AppliedExample /> };
export const Expired: Story = {
  render: () => <ExpiredExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Promo code"), "old{Enter}");
    await expect(await canvas.findByText(/expired/)).toBeVisible();
  },
};
