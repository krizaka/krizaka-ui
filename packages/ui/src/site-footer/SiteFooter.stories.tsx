import type { Meta, StoryObj } from "@storybook/react-vite";

import CompanyExample from "../../registry/examples/site-footer/company";
import OpenSourceFrExample from "../../registry/examples/site-footer/open-source-fr";
import ProductExample from "../../registry/examples/site-footer/product";
import { SiteFooter } from "./site-footer";

/** The footer of every Krizaka site. Each story renders a named example of the registry (`registry/examples/site-footer/*`). */
const meta = {
  title: "Primitives/SiteFooter",
  component: SiteFooter,
  args: { current: "krizaka" },
  decorators: [
    (Story) => (
      <div className="w-[64rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteFooter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Product: Story = { render: () => <ProductExample /> };
export const Company: Story = { render: () => <CompanyExample /> };
export const OpenSourceFr: Story = { render: () => <OpenSourceFrExample /> };
