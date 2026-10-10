import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import ArmedExample from "../../registry/examples/confirm-button/armed";
import IdleExample from "../../registry/examples/confirm-button/idle";
import WithTextExample from "../../registry/examples/confirm-button/with-text";
import { ConfirmButton } from "./confirm-button";

/**
 * `ConfirmButton`: a destructive action in two presses, never `window.confirm`. Each story renders a named example of
 * the registry (`registry/examples/confirm-button/*`); `Armed` presses it once.
 */
const meta = {
  title: "Primitives/ConfirmButton",
  component: ConfirmButton,
  args: { confirmLabel: "Delete?", onConfirm: () => {} },
} satisfies Meta<typeof ConfirmButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = { render: () => <IdleExample /> };
export const Armed: Story = { render: () => <ArmedExample />, play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await expect(button).toHaveAttribute("data-armed");
  }, };
export const WithText: Story = { render: () => <WithTextExample /> };
