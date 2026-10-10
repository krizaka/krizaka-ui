import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import CustomExample from "../../registry/examples/toast/custom";
import TonesExample from "../../registry/examples/toast/tones";
import { Toaster } from "./toast";

/**
 * `Toaster` (sonner, once in the root layout) styled by roles, and `toast`, `toast.success/warning/error/info`,
 * `toast.custom(…)`. Each story renders a named example of the registry (`registry/examples/toast/*`), its toasts shown
 * at load (`defaultOpen`): the screenshot covers the viewport, where they stack.
 */
const meta = {
  title: "Primitives/Toast",
  component: Toaster,
  args: { label: "Notifications", closeLabel: "Dismiss" },
  parameters: { capture: "viewport" },
} satisfies Meta<typeof Toaster>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Waits until exactly `count` toasts are mounted (the screenshot is taken after `play`). */
const settled = (count: number): Story["play"] =>
  async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.ownerDocument.querySelectorAll("[data-sonner-toast][data-mounted=true]")).toHaveLength(count));
  };

// sonner's queue is global: each example has its own toaster (`id` + `toasterId`), so no toast leaks into the next
// story's screenshot.
export const Tones: Story = { render: () => <TonesExample defaultOpen />, play: settled(4) };
export const Custom: Story = { render: () => <CustomExample defaultOpen />, play: settled(1) };
