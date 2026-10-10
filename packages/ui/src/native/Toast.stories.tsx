import type { Meta, StoryObj } from "@storybook/react-vite";

import NotificationExample from "../../registry/examples/toast/native/notification";
import TonesExample from "../../registry/examples/toast/native/tones";
import { nativeFrame } from "./story-frame";
import { Toaster } from "./toast";

/**
 * Native — `Toaster` (once, at the root; `offset` = the safe-area inset) and `toast`, `toast.success/warning/error/info`,
 * `toast.dismiss`: the web's names. Each story renders a named example of the registry
 * (`registry/examples/toast/native/*`), its toasts shown at load (`defaultOpen`).
 */
const meta = {
  title: "Native/Toast",
  component: Toaster,
  decorators: [nativeFrame],
  args: { closeLabel: "Dismiss" },
} satisfies Meta<typeof Toaster>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = { render: () => <TonesExample defaultOpen /> };
export const Notification: Story = { render: () => <NotificationExample defaultOpen /> };
