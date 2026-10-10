import type { Meta, StoryObj } from "@storybook/react-vite";

import AlertDestructiveExample from "../../registry/examples/dialog/alert-destructive";
import BottomExample from "../../registry/examples/dialog/bottom";
import CenterExample from "../../registry/examples/dialog/center";
import GateExample from "../../registry/examples/dialog/gate";
import RightExample from "../../registry/examples/dialog/right";
import SheetFormExample from "../../registry/examples/dialog/sheet-form";
import { Dialog } from "./dialog";

/**
 * `Dialog` on Radix Dialog, `Sheet`, `AlertDialog`. Each story renders a named example of the registry
 * (`registry/examples/dialog/*`), opened at load (`defaultOpen`): the screenshot covers the viewport, where the portal
 * renders.
 */
const meta = {
  title: "Primitives/Dialog",
  component: Dialog.Content,
  args: { closeLabel: "Close" },
  parameters: { capture: "viewport" },
} satisfies Meta<typeof Dialog.Content>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Center: Story = { render: () => <CenterExample defaultOpen /> };
export const Bottom: Story = { render: () => <BottomExample defaultOpen /> };
export const Right: Story = { render: () => <RightExample defaultOpen /> };
export const SheetForm: Story = { render: () => <SheetFormExample defaultOpen /> };
export const AlertDestructive: Story = { render: () => <AlertDestructiveExample defaultOpen /> };
export const Gate: Story = { render: () => <GateExample defaultOpen /> };
