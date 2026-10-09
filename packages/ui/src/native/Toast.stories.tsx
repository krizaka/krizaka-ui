import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { nativeFrame } from "./story-frame";
import { BellIcon } from "./story-icons";
import { toast, Toaster } from "./toast";

/**
 * Native — `Toaster` (once, at the root; `offset` = the safe-area inset) and `toast`, `toast.success/warning/error/info`,
 * `toast.dismiss`: the web's names. `id` replaces a toast (a notification shown once), `onPress` opens what it is about.
 */
const meta = {
  title: "Native/Toast",
  component: Toaster,
  decorators: [nativeFrame],
  args: { closeLabel: "Dismiss", duration: Number.POSITIVE_INFINITY },
} satisfies Meta<typeof Toaster>;
export default meta;

type Story = StoryObj<typeof meta>;

function Stage({ run, ...props }: React.ComponentProps<typeof Toaster> & { run: () => void }) {
  React.useEffect(() => {
    toast.dismiss();
    run();
    return () => toast.dismiss();
  }, [run]);
  return (
    <View style={{ width: 360, height: 260 }}>
      <Toaster {...props} />
    </View>
  );
}

const tones = () => {
  toast("Draft saved", { description: "Autosaved a moment ago." });
  toast.success("Payment received", { description: "€12.00 from @maya." });
  toast.error("Upload failed", { description: "The connection dropped at 64 %.", action: { label: "Retry", onPress: () => undefined } });
};

/** default · success · error with an action. */
export const Tones: Story = { render: (args) => <Stage {...args} run={tones} /> };

const notification = () => {
  toast("@maya started a live auction", { id: "n-42", icon: <BellIcon />, onPress: () => undefined });
};

/** A notification from the live stream: an icon, tap to open it — what Orochia's `LiveToast` did. */
export const Notification: Story = { render: (args) => <Stage {...args} run={notification} /> };
