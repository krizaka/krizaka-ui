import type { Meta, StoryObj } from "@storybook/react-vite";

import KeyExample from "../../registry/examples/kbd/key";
import ShortcutExample from "../../registry/examples/kbd/shortcut";
import SmallExample from "../../registry/examples/kbd/small";
import { Kbd } from "./kbd";

/**
 * A key or a shortcut: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. `size` sm · md.
 * Each story renders a named example of the registry (`registry/examples/kbd/*`): the code krizaka.com/docs/ui shows.
 */
const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  args: { children: "Esc" },
} satisfies Meta<typeof Kbd>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Key: Story = { render: () => <KeyExample /> };
export const Small: Story = { render: () => <SmallExample /> };
export const Shortcut: Story = { render: () => <ShortcutExample /> };
