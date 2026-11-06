import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { FoliovivMark } from "./FoliovivMark";
import { KrizakaMark } from "./KrizakaMark";
import { ProductMark } from "./ProductMark";
import { SovkoraMark } from "./SovkoraMark";
import { nativeFrame } from "./story-frame";
import { VerikoraMark } from "./VerikoraMark";

/** Native — the brand marks (react-native-svg), the geometry of the web marks. Still here; they move on a device. */
const meta = {
  title: "Native/Marks",
  component: ProductMark,
  decorators: [nativeFrame],
  args: { id: "krizaka", size: 96, animated: false },
} satisfies Meta<typeof ProductMark>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The brand family at 96 pt: Krizaka, Sovkora, Verikora, Folioviv. */
export const Family: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <KrizakaMark {...args} title="Krizaka" />
      <SovkoraMark {...args} title="Sovkora" />
      <VerikoraMark {...args} title="Verikora" />
      <FoliovivMark {...args} title="Folioviv" />
    </View>
  ),
};

/** Below 48 pt each mark crops to its emblem (tab bar, header). */
export const Small: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <ProductMark {...args} id="krizaka" size={28} />
      <ProductMark {...args} id="sovkora" size={28} />
      <ProductMark {...args} id="verikora" size={28} />
      <ProductMark {...args} id="folioviv" size={28} />
    </View>
  ),
};
