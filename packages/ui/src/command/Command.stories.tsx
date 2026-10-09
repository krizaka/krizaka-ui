import type { Meta, StoryObj } from "@storybook/react-vite";

import { Kbd } from "../kbd/kbd";
import { Command, CommandDialog } from "./command";

/**
 * `Command.Root/Input/List/Empty/Loading/Group/Item/Separator/Shortcut` on cmdk: combobox + listbox, the arrows,
 * Enter, filtering (`shouldFilter={false}` when the server searches). `CommandDialog` puts it in the platform's
 * Dialog, named by `label`, without a close button. Words arrive as props (`label`, `placeholder`, `emptyLabel`).
 */
const meta = {
  title: "Primitives/Command",
  component: Command.Root,
  args: { label: "Commands" },
} satisfies Meta<typeof Command.Root>;
export default meta;

type Story = StoryObj<typeof meta>;

const Items = () => (
  <>
    <Command.Empty emptyLabel="Nothing matches." />
    <Command.Group heading="Pages">
      <Command.Item>
        Home
        <Command.Shortcut>G H</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        Wallet
        <Command.Shortcut>G W</Command.Shortcut>
      </Command.Item>
      <Command.Item disabled>Studio</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Actions">
      <Command.Item keywords={["video", "new"]}>Upload a video</Command.Item>
      <Command.Item>Switch the theme</Command.Item>
    </Command.Group>
  </>
);

/** Inline, in a card. */
export const Inline: Story = {
  render: (args) => (
    <Command.Root {...args} className="w-[28rem] max-w-full rounded-xl border border-border-default shadow-lg">
      <Command.Input placeholder="Type a command or search" />
      <Command.List label="Suggestions">
        <Items />
      </Command.List>
    </Command.Root>
  ),
};

/** What `emptyLabel` says when nothing matches. */
export const Empty: Story = {
  render: (args) => (
    <Command.Root {...args} className="w-[28rem] max-w-full rounded-xl border border-border-default">
      <Command.Input placeholder="Type a command or search" defaultValue="zzz" />
      <Command.List label="Suggestions">
        <Items />
      </Command.List>
    </Command.Root>
  ),
};

/** `CommandDialog`, opened at load: the screenshot covers the viewport, where the portal renders. */
export const Dialog: Story = {
  parameters: { capture: "viewport" },
  render: () => (
    <CommandDialog
      defaultOpen
      label="Search"
      footer={
        <div className="flex items-center gap-3 border-t border-border-subtle bg-surface-2 px-4 py-2.5 text-xs text-fg-secondary">
          <span>
            <Kbd size="sm">↑↓</Kbd> to move
          </span>
          <span>
            <Kbd size="sm">↵</Kbd> to open
          </span>
        </div>
      }
    >
      <Command.Input placeholder="Search creators, videos, tags" />
      <Command.List label="Results">
        <Items />
      </Command.List>
    </CommandDialog>
  ),
};
