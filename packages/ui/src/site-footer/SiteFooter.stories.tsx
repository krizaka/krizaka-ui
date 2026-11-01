import type { Meta, StoryObj } from "@storybook/react-vite";

import AppExample from "../../registry/examples/site-footer/app";
import CompanyExample from "../../registry/examples/site-footer/company";
import ConfiguredExample from "../../registry/examples/site-footer/configured";
import DocsExample from "../../registry/examples/site-footer/docs";
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
export const App: Story = { render: () => <AppExample /> };
export const Docs: Story = { render: () => <DocsExample /> };
/** The footer as the admin configured it (`config`): real columns, then one legal line that names the company once. */
export const Configured: Story = { render: () => <ConfiguredExample /> };
