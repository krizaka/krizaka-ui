import type { Meta, StoryObj } from "@storybook/react-vite";

import InlineExample from "../../registry/examples/language-switch/inline";
import MenuExample from "../../registry/examples/language-switch/menu";
import { LanguageSwitch } from "./language-switch";

/** The language switch. Each story renders a named example of the registry (`registry/examples/language-switch/*`). */
const meta = {
  title: "Primitives/LanguageSwitch",
  component: LanguageSwitch,
  args: { label: "Langue", current: "fr", languages: [{ code: "fr", name: "Français", href: "/fr" }] },
} satisfies Meta<typeof LanguageSwitch>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Menu: Story = { render: () => <MenuExample /> };
export const MenuOpen: Story = {
  render: () => (
    <div className="min-h-40">
      <MenuExample defaultOpen />
    </div>
  ),
  parameters: { capture: "viewport" },
};
export const Inline: Story = { render: () => <InlineExample /> };
