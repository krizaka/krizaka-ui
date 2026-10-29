import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductLogo } from "./ProductLogo";

/** A brand mark picked by id — for navigation, cards and lists driven by data. */
const meta = {
  title: "Brand/ProductLogo",
  component: ProductLogo,
  args: { id: "krizaka", size: 96, animated: true },
  argTypes: { id: { control: "inline-radio", options: ["krizaka", "orazaka", "yomizaka", "akinaza"] } },
} satisfies Meta<typeof ProductLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Krizaka: Story = {};
export const Orazaka: Story = { args: { id: "orazaka" } };
export const Yomizaka: Story = { args: { id: "yomizaka" } };
export const Akinaza: Story = { args: { id: "akinaza" } };

/** Every mark, still (`animated={false}`). */
export const AllStill: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <ProductLogo {...args} id="krizaka" />
      <ProductLogo {...args} id="orazaka" />
      <ProductLogo {...args} id="yomizaka" />
      <ProductLogo {...args} id="akinaza" />
    </div>
  ),
  args: { animated: false },
};
