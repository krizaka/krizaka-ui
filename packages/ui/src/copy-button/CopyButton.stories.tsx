import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import DefaultExample from "../../registry/examples/copy-button/default";
import IconOnlyExample from "../../registry/examples/copy-button/icon-only";
import { CopyButton } from "./copy-button";

/** `CopyButton`: copies a value and says “Copied”. Each story renders a named example of the registry. */
const meta = {
  title: "Primitives/CopyButton",
  component: CopyButton,
  args: { value: "x", label: "Copy", copiedLabel: "Copied", fallbackLabel: "Select and copy" },
} satisfies Meta<typeof CopyButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DefaultExample /> };
export const IconOnly: Story = {
  render: () => <IconOnlyExample />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};
