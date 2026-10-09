import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";

import { Avatar } from "../avatar/avatar";
import { Button } from "../button/button";
import { toast, Toaster } from "./toast";

/**
 * `Toaster` (sonner, once in the root layout) styled by roles — sonner's own look is off, `richColors` too — and
 * `toast`, `toast.success/warning/error/info`, `toast.custom(…)`. `label` names the region, `closeLabel` the close
 * buttons. The screenshot covers the viewport, where the toasts stack.
 */
const meta = {
  title: "Primitives/Toast",
  component: Toaster,
  args: { label: "Notifications", closeLabel: "Dismiss", position: "bottom-right", expand: true, visibleToasts: 4, duration: Number.POSITIVE_INFINITY },
  parameters: { capture: "viewport" },
} satisfies Meta<typeof Toaster>;
export default meta;

type Story = StoryObj<typeof meta>;

function Show({ run }: { run: () => void }) {
  useEffect(() => {
    toast.dismiss();
    run();
  }, [run]);
  return (
    <Button variant="outline" onClick={run}>
      Show again
    </Button>
  );
}

const tones = () => {
  toast("Draft saved", { description: "Autosaved a moment ago." });
  toast.success("Payment received", { description: "€12.00 from @maya." });
  toast.warning("Your balance is low", { description: "Two tips left before a top-up." });
  toast.error("Upload failed", { description: "The connection dropped at 64 %.", action: { label: "Retry", onClick: () => {} } });
};

/** The tones: default, success, warning, danger (error) — a tinted edge and a coloured icon, the text stays legible. */
export const Tones: Story = {
  render: (args) => (
    <>
      <Toaster {...args} />
      <Show run={tones} />
    </>
  ),
};

const custom = () => {
  toast.custom(() => (
    <div className="flex items-center gap-3">
      <Avatar fallback="MA" size="sm" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-fg">Maya started following you</span>
        <span className="text-xs font-normal text-fg-secondary">Just now</span>
      </div>
    </div>
  ));
};

/** `toast.custom`: arbitrary JSX in the platform's shell — the live notifications of a product. */
export const Custom: Story = {
  render: (args) => (
    <>
      <Toaster {...args} />
      <Show run={custom} />
    </>
  ),
};
