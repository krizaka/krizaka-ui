import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { View } from "react-native";

import { AkinazaMark } from "./AkinazaMark";
import { KrizakaMark } from "./KrizakaMark";
import { OrazakaMark } from "./OrazakaMark";
import { ProductMark } from "./ProductMark";
import { nativeFrame } from "./story-frame";
import { YomizakaMark } from "./YomizakaMark";

/** Native — the brand marks (react-native-svg), the geometry of the web marks. Still here; they move on a device. */
const meta = {
  title: "Native/Marks",
  component: ProductMark,
  decorators: [nativeFrame],
  args: { id: "krizaka", size: 96, animated: false },
} satisfies Meta<typeof ProductMark>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The brand family at 96 pt: Krizaka, Orazaka, Yomizaka, Akinaza. */
export const Family: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <KrizakaMark {...args} title="Krizaka" />
      <OrazakaMark {...args} title="Orazaka" />
      <YomizakaMark {...args} title="Yomizaka" />
      <AkinazaMark {...args} title="Akinaza" />
    </View>
  ),
};

/** Below 48 pt each mark crops to its emblem (tab bar, header). */
export const Small: Story = {
  render: (args) => (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <ProductMark {...args} id="krizaka" size={28} />
      <ProductMark {...args} id="orazaka" size={28} />
      <ProductMark {...args} id="yomizaka" size={28} />
      <ProductMark {...args} id="akinaza" size={28} />
    </View>
  ),
};
