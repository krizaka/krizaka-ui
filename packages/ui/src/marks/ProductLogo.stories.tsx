import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductLogo } from "./ProductLogo";

/** A brand mark picked by id — for navigation, cards and lists driven by data. */
const meta = {
  title: "Brand/ProductLogo",
  component: ProductLogo,
  args: { id: "krizaka", size: 96, animated: true },
  argTypes: { id: { control: "inline-radio", options: ["krizaka", "sovkora", "verikora", "folioviv"] } },
} satisfies Meta<typeof ProductLogo>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Krizaka: Story = {};
export const Sovkora: Story = { args: { id: "sovkora" } };
export const Verikora: Story = { args: { id: "verikora" } };
export const Folioviv: Story = { args: { id: "folioviv" } };

/** Every mark, still (`animated={false}`). */
export const AllStill: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <ProductLogo {...args} id="krizaka" />
      <ProductLogo {...args} id="sovkora" />
      <ProductLogo {...args} id="verikora" />
      <ProductLogo {...args} id="folioviv" />
    </div>
  ),
  args: { animated: false },
};
