import type { Meta, StoryObj } from "@storybook/react-vite";

import DialogExample from "../../registry/examples/command/dialog";
import InlineExample from "../../registry/examples/command/inline";
import NoResultsExample from "../../registry/examples/command/no-results";
import { Command } from "./command";

/**
 * `Command.Root/Input/List/Empty/Loading/Group/Item/Separator/Shortcut` on cmdk; `CommandDialog` puts it in the
 * platform's Dialog. Each story renders a named example of the registry (`registry/examples/command/*`); the dialog is
 * opened at load (`defaultOpen`) and its screenshot covers the viewport.
 */
const meta = {
  title: "Primitives/Command",
  component: Command.Root,
  args: { label: "Commands" },
} satisfies Meta<typeof Command.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = { render: () => <InlineExample /> };
export const NoResults: Story = { render: () => <NoResultsExample /> };
export const Dialog: Story = { render: () => <DialogExample defaultOpen />, parameters: { capture: "viewport" } };
