import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductLockup } from "./ProductLockup";

/** The « Verikora by Krizaka » lockup: the product's mark, its name and the endorsement — words passed in from @krizaka/org. */
const meta = {
  title: "Brand/ProductLockup",
  component: ProductLockup,
  args: { id: "verikora", name: "Verikora", endorsement: "by Krizaka", size: 40 },
} satisfies Meta<typeof ProductLockup>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Verikora: Story = {};
export const FoliovivInline: Story = { args: { id: "folioviv", name: "Folioviv", endorsement: "par Krizaka", layout: "inline" } };
export const Sovkora: Story = { args: { id: "sovkora", name: "Sovkora", size: 64 } };
export const Kridoc: Story = { args: { id: "kridoc", name: "Kridoc" } };
