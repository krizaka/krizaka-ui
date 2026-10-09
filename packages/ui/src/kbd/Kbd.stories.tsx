import type { Meta, StoryObj } from "@storybook/react-vite";

import KbdDemo from "../../registry/demos/kbd";
import { Kbd } from "./kbd";

/** A key or a shortcut: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. `size` sm · md. */
const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  args: { children: "Esc" },
} satisfies Meta<typeof Kbd>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The demo of the registry (`registry/demos/kbd.tsx`). */
export const Key: Story = { render: () => <KbdDemo /> };

export const Small: Story = { args: { size: "sm" } };

/** In a sentence. */
export const Shortcut: Story = {
  render: () => (
    <p className="flex items-center gap-1.5 text-sm text-fg-secondary">
      Search with <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </p>
  ),
};
