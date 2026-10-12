import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { KrizakaMark } from "./KrizakaMark";
import { OrazakaMark } from "./OrazakaMark";
import { OrochiaMark } from "./OrochiaMark";
import { ProductMark } from "./ProductMark";
import { nativeFrame } from "./story-frame";
import { YazakiaMark } from "./YazakiaMark";

/** Native — the brand marks (react-native-svg), the geometry of the web marks. Still here; they move on a device. */
const meta = {
  title: "Native/Marks",
  component: ProductMark,
  decorators: [nativeFrame],
  args: { id: "krizaka", size: 96, animated: false },
} satisfies Meta<typeof ProductMark>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The brand family at 96 pt: Krizaka, Orazaka, Orochia, Yazakia. */
export const Family: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <KrizakaMark {...args} title="Krizaka" />
      <OrazakaMark {...args} title="Orazaka" />
      <OrochiaMark {...args} title="Orochia" />
      <YazakiaMark {...args} title="Yazakia" />
    </View>
  ),
};

/** Below 48 pt each mark crops to its emblem (tab bar, header). */
export const Small: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <ProductMark {...args} id="krizaka" size={28} />
      <ProductMark {...args} id="orazaka" size={28} />
      <ProductMark {...args} id="orochia" size={28} />
      <ProductMark {...args} id="yazakia" size={28} />
    </View>
  ),
};
